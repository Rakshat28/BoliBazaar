// src/app/api/webhook/clerk/route.ts
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { UserRole, VerificationStatus } from '@prisma/client'; // Removed PrismaClient import here

// Import your singleton Prisma client instance
import prisma from '@/lib/prisma'; // <--- IMPORTANT: Use your singleton here

// Import Clerk's specific event types for better type safety
import type { UserJSON, EmailAddress, WebhookEvent as ClerkWebhookEvent } from '@clerk/nextjs/server';

// Define a more accurate custom interface for the webhook event
interface CustomWebhookEvent {
  data: UserJSON | { id: string } | EmailAddress;
  object: 'event';
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse('Error occured -- no svix headers', {
        status: 400
      });
    }

    // Get the body
    const payload = await req.text();

    // Create a new Svix instance with your secret.
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      // This error means the env var is missing during execution.
      // If this happens during build, it means the variable isn't available at build time.
      console.error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
      return new NextResponse('Server configuration error', { status: 500 });
    }
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: CustomWebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as CustomWebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new NextResponse('Error occured -- webhook verification failed', {
        status: 400
      });
    }

    const eventType = evt.type;

    console.log(`[Webhook] Received event: ${eventType}`);

    // --- Handle different event types ---
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const user = evt.data as UserJSON;

      const userId = user.id;
      const email = user.email_addresses?.[0]?.email_address ?? '';
      const phone = user.phone_numbers?.[0]?.phone_number ?? null;
      const firstName = user.first_name ?? '';
      const lastName = user.last_name ?? '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';

      const roleFromMetadata = (user.public_metadata as { role?: string })?.role;
      let role: UserRole = UserRole.VENDOR;

      if (roleFromMetadata && Object.values(UserRole).includes(roleFromMetadata as UserRole)) {
        role = roleFromMetadata as UserRole;
      } else {
        console.warn(`[Webhook] Invalid or missing role for user ${userId}: '${roleFromMetadata}'. Using default: VENDOR`);
      }

      if (!userId) {
        console.error('[Webhook] User ID is missing');
        return new NextResponse('User ID missing', { status: 400 });
      }

      if (eventType === 'user.created') {
        try {
          await prisma.user.create({
            data: {
              id: userId,
              email,
              phone_number: phone,
              full_name: fullName,
              role_type: role,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
          console.log(`[Webhook] User created in DB: ${userId} with role: ${role}`);

          if (role === UserRole.VENDOR) {
            await prisma.vendor.create({
              data: {
                user_id: userId,
                area_group_id: 1, // TODO: Replace with actual default area group ID
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            console.log(`[Webhook] Vendor profile created for user: ${userId}`);
          } else if (role === UserRole.SUPPLIER) {
            await prisma.supplier.create({
              data: {
                user_id: userId,
                business_name: 'New Business', // TODO: Implement proper business name collection
                verification_status: VerificationStatus.PENDING,
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            console.log(`[Webhook] Supplier profile created for user: ${userId}`);
          }
        } catch (error) {
          console.error(`[Webhook] Error creating user ${userId}:`, error);
          return new NextResponse('Database error during user creation', { status: 500 });
        }

      } else if (eventType === 'user.updated') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          });

          if (!existingUser) {
            console.error(`[Webhook] User ${userId} not found for update. Skipping.`);
            return new NextResponse('User not found for update', { status: 404 });
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              email,
              phone_number: phone,
              full_name: fullName,
              role_type: role,
              updated_at: new Date(),
            },
          });
          console.log(`[Webhook] User updated in DB: ${userId} with new role: ${role}`);

          if (existingUser.role_type !== role) {
            console.log(`[Webhook] Role changed for user ${userId} from ${existingUser.role_type} to ${role}. Updating profiles.`);

            if (existingUser.role_type === UserRole.VENDOR) {
              await prisma.vendor.deleteMany({ where: { user_id: userId } });
              console.log(`[Webhook] Deleted old Vendor profile for ${userId}`);
            } else if (existingUser.role_type === UserRole.SUPPLIER) {
              await prisma.supplier.deleteMany({ where: { user_id: userId } });
              console.log(`[Webhook] Deleted old Supplier profile for ${userId}`);
            }

            if (role === UserRole.VENDOR) {
              await prisma.vendor.create({
                data: {
                  user_id: userId,
                  area_group_id: 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
              console.log(`[Webhook] Created new Vendor profile for ${userId}`);
            } else if (role === UserRole.SUPPLIER) {
              await prisma.supplier.create({
                data: {
                  user_id: userId,
                  business_name: 'New Business',
                  verification_status: VerificationStatus.PENDING,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
              console.log(`[Webhook] Created new Supplier profile for ${userId}`);
            }
          }
        } catch (error) {
          console.error(`[Webhook] Error updating user ${userId}:`, error);
          return new NextResponse('Database error during user update', { status: 500 });
        }
      }
    }
    else if (eventType === 'user.deleted') {
      const userId = evt.data.id;

      if (!userId) {
        console.error('[Webhook] User ID is missing for deletion');
        return new NextResponse('User ID missing', { status: 400 });
      }

      try {
        await prisma.user.delete({
          where: { id: userId },
        });
        console.log(`[Webhook] User deleted from DB: ${userId}`);
      } catch (error) {
        console.error(`[Webhook] Error deleting user ${userId}:`, error);
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
          console.warn(`[Webhook] User ${userId} already deleted or not found in DB.`);
        } else {
          return new NextResponse('Database error during user deletion', { status: 500 });
        }
      }
    }
    else if (eventType.startsWith('email.')) {
      const emailData = evt.data as EmailAddress;
      console.log(`[Webhook] Email event (${eventType}): ${emailData.emailAddress}`);
      return new NextResponse('Email event handled (no DB update)', { status: 200 });
    }
    else {
      console.log(`[Webhook] Unhandled event type: ${eventType}. Returning 200 to acknowledge.`);
      return new NextResponse('Unhandled event type', { status: 200 });
    }

    return new NextResponse('Success', { status: 200 });

  } catch (error) {
    console.error('[Webhook] Unexpected error during webhook processing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}