
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    return new Response('Role updated', { status: 200 });
  } catch (error) {
    console.error('Failed to update user metadata:', error);
    return new Response('Failed to update metadata', { status: 500 });
  }
}
