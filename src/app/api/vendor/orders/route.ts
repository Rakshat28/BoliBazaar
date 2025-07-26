import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  // FIXME: This is a temporary placeholder for testing.
  // Replace with the real userId from auth() once Clerk is live.
  const userId = "user_2i3B2aBcDeFgHiJkLmNoPqRsTuV"; // Replace with a valid user_id from your 'vendors' table
  // const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch all order items linked to this vendor
    const orderItems = await prisma.orderItem.findMany({
      where: {
        vendor_id: userId,
      },
      // Include related data for display on the frontend
      include: {
        pooledOrder: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Show the most recent orders first
      },
    });

    return NextResponse.json(orderItems);

  } catch (error) {
    console.error("[VENDOR_ORDERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}