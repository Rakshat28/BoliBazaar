
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  try {
    // 1. Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    // 2. Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    
    // 3. Create or update user in database
    await prisma.user.upsert({
      where: { id: userId },
      update: { role_type: role.toUpperCase() },
      create: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        phone_number: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role_type: role.toUpperCase(),
      },
    });

    // 4. If role is vendor, create vendor record (without area_group_id initially)
    if (role === 'vendor') {
      await prisma.vendor.upsert({
        where: { user_id: userId },
        update: {}, // No updates needed
        create: {
          user_id: userId,
          area_group_id: 0, // Temporary value, will be updated during onboarding
        },
      });
    }

    // 5. If role is supplier, create supplier record
    if (role === 'supplier') {
      await prisma.supplier.upsert({
        where: { user_id: userId },
        update: {}, // No updates needed
        create: {
          user_id: userId,
          business_name: clerkUser.firstName ? `${clerkUser.firstName}'s Business` : 'My Business',
        },
      });
    }

    return new Response('Role updated and profile created', { status: 200 });
  } catch (error) {
    console.error('Failed to update user metadata and create profile:', error);
    return new Response('Failed to update metadata', { status: 500 });
  }
}
