// src/app/api/webhook/clerk/route.ts
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define webhook event types
type EventType = 'user.created' | 'user.updated' | 'user.deleted';

interface WebhookEvent {
  type: EventType;
  data: {
    id: string;
    email_addresses?: Array<{
      email_address: string;
      id: string;
    }>;
    phone_numbers?: Array<{
      phone_number: string;
      id: string;
    }>;
    first_name?: string;
    last_name?: string;
    public_metadata?: {
      role?: string;
    };
    object?: string;
  };
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
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new NextResponse('Error occured', {
        status: 400
      });
    }

    const eventType = evt.type;

    // Handle different event types
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const user = evt.data;
      const userId = user.id;
      
      // Extract user data with proper null checking
      const email = user.email_addresses?.[0]?.email_address || '';
      const phone = user.phone_numbers?.[0]?.phone_number || null;
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';

      // Get role from public_metadata with validation
      const roleFromMetadata = user.public_metadata?.role;
      let role: UserRole = UserRole.VENDOR; // Default role

      // Validate the role
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
          // Create the main user record
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

          // Create associated profile based on role
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
        } catch (error) {
          console.error(`[Webhook] Error creating user ${userId}:`, error);
          return new NextResponse('Database error', { status: 500 });
        }

      } else if (eventType === 'user.updated') {
        try {
          // Check if user exists first
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          });

          if (!existingUser) {
            console.error(`[Webhook] User ${userId} not found for update`);
            return new NextResponse('User not found', { status: 404 });
          }

          // Update the main user record
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

          // Handle role changes if needed
          if (existingUser.role_type !== role) {
            
            // Delete old profile
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
                  area_group_id: 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
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
            }
          }
        } catch (error) {
          console.error(`[Webhook] Error updating user ${userId}:`, error);
          return new NextResponse('Database error', { status: 500 });
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
        // Delete user (cascading deletes should handle related records)
        await prisma.user.delete({
          where: { id: userId },
        });
      } catch (error) {
        console.error(`[Webhook] Error deleting user ${userId}:`, error);
        // If user doesn't exist, that's okay - return success
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        } else {
          return new NextResponse('Database error', { status: 500 });
        }
      }
    }
    else {
      return new NextResponse('Event type not implemented', { status: 200 });
    }

    return new NextResponse('Success', { status: 200 });

  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}