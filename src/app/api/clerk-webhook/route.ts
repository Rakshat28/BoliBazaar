// src/app/api/webhook/clerk/route.ts
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client';

// Import Clerk's specific event types for better type safety
// These are the actual types Clerk uses for its webhook payloads.
import type { UserJSON, EmailAddress, WebhookEvent as ClerkWebhookEvent } from '@clerk/nextjs/server';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define a more accurate custom interface for the webhook event
// This mirrors Clerk's WebhookEvent structure more closely,
// especially for the 'data' property which changes based on 'type'.
interface CustomWebhookEvent {
  data: UserJSON | { id: string } | EmailAddress; // Simplified for common cases. Add other data types as needed.
  object: 'event'; // All webhook events have object: 'event'
  type: string; // The specific event type, e.g., 'user.created'
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
    // Ensure CLERK_WEBHOOK_SECRET is set in your environment variables.
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set in environment variables');
    }
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: CustomWebhookEvent; // Use your more accurate custom type here

    // Verify the payload with the headers
    try {
      // The 'verify' method returns a generic object, so we cast it to our custom type.
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as CustomWebhookEvent; // Cast to your custom interface
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new NextResponse('Error occured -- webhook verification failed', {
        status: 400
      });
    }

    const eventType = evt.type;

    // Handle different event types with proper type narrowing
    if (eventType === 'user.created' || eventType === 'user.updated') {
      // Type Guard: We know evt.data is a UserJSON here
      const user = evt.data as UserJSON; // Cast to Clerk's UserJSON type

      const userId = user.id;
      // Use nullish coalescing (??) for default values to handle potential null/undefined
      const email = user.email_addresses?.[0]?.email_address ?? '';
      const phone = user.phone_numbers?.[0]?.phone_number ?? null;
      const firstName = user.first_name ?? ''; // Use nullish coalescing for names
      const lastName = user.last_name ?? '';
      const fullName = `${firstName} ${lastName}`.trim();

      // Get role from public_metadata with validation
      const roleFromMetadata = (user.public_metadata as { role?: string })?.role; // Cast public_metadata to access 'role'
      let role: UserRole = UserRole.VENDOR; // Default role

      // Validate the role against your Prisma UserRole enum
      if (roleFromMetadata && Object.values(UserRole).includes(roleFromMetadata as UserRole)) {
        role = roleFromMetadata as UserRole;
      } else {
        console.warn(`[Webhook] Invalid or missing role for user ${userId}: '${roleFromMetadata}'. Using default: VENDOR`);
      }

      if (!userId) {
        console.error('[Webhook] User ID is missing for user.created/updated event. Cannot process.');
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

          if (role === UserRole.VENDOR) {
            await prisma.vendor.create({
              data: {
                user_id: userId,
                area_group_id: 1, // TODO: Replace with actual default area group ID
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
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
          }
        } catch {
          return new NextResponse('Database error during user creation', { status: 500 });
        }

      } else if (eventType === 'user.updated') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          });

          if (!existingUser) {
            return new NextResponse('User not found for update', { status: 404 }); // Return 404 if user not in your DB
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

          // Handle role changes: delete old profile, create new one
          if (existingUser.role_type !== role) {

            // Delete old profile (using deleteMany for robustness in case of multiple entries, though unlikely)
            if (existingUser.role_type === UserRole.VENDOR) {
              await prisma.vendor.deleteMany({ where: { user_id: userId } });
            } else if (existingUser.role_type === UserRole.SUPPLIER) {
              await prisma.supplier.deleteMany({ where: { user_id: userId } });
            }

            // Create new profile
            if (role === UserRole.VENDOR) {
              await prisma.vendor.create({
                data: {
                  user_id: userId,
                  area_group_id: 1, // TODO: Replace with actual default area group ID
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
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
            }
          }
        } catch (error) {
          console.error(`[Webhook] Error updating user ${userId}:`, error);
          return new NextResponse('Database error during user update', { status: 500 });
        }
      }
    }
    // --- User Event: user.deleted ---
    else if (eventType === 'user.deleted') {
      // For 'user.deleted' events, evt.data is a simple object with 'id'.
      const userId = evt.data.id;

      if (!userId) {
        console.error('[Webhook] User ID is missing for deletion event. Cannot process.');
        return new NextResponse('User ID missing', { status: 400 });
      }

      try {
        // Delete user (Prisma's onDelete: CASCADE in your schema should handle related records)
        await prisma.user.delete({
          where: { id: userId },
        });
      } catch (error) {
        console.error(`[Webhook] Error deleting user ${userId}:`, error);
        // If the record doesn't exist (e.g., already deleted), that's fine.
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
          console.warn(`[Webhook] User ${userId} already deleted or not found in DB.`);
        } else {
          return new NextResponse('Database error during user deletion', { status: 500 });
        }
      }
    }
    // --- Email Events: email.created, email.updated, email.deleted ---
    // These events' data structure is typically EmailAddressJSON.
    else if (eventType.startsWith('email.')) { // Catch all email events
      const emailData = evt.data as EmailAddress; // Cast to Clerk's EmailAddressJSON type
      //
      // IMPORTANT: Your 'users' table only stores a single 'email'.
      // If you need to track ALL email addresses a user has (primary, secondary, etc.),
      // you would need a separate 'UserEmail' table in your Prisma schema.
      // These handlers are placeholders for such a scenario.
      //
      // Example:
      // if (eventType === 'email.created') {
      //   await prisma.userEmail.create({ data: { id: emailData.id, userId: emailData.user_id, emailAddress: emailData.email_address, verified: emailData.verified } });
      // } else if (eventType === 'email.updated') {
      //   await prisma.userEmail.update({ where: { id: emailData.id }, data: { emailAddress: emailData.email_address, verified: emailData.verified } });
      // } else if (eventType === 'email.deleted') {
      //   await prisma.userEmail.delete({ where: { id: emailData.id } });
      // }
      //
      // For now, just acknowledge these events
      return new NextResponse('Email event handled (no DB update)', { status: 200 });
    }
    // --- End Email Events ---

    // --- Unhandled Event Types ---
    else {
      return new NextResponse('Unhandled event type', { status: 200 });
    }

    // 3. Return success response for all handled events
    return new NextResponse('Success', { status: 200 });

  } catch (error) {
    // 4. Catch any unexpected errors during webhook processing
    console.error('[Webhook] Unexpected error during webhook processing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    // 5. Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}