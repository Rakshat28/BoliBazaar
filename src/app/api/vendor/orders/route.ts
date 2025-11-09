import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
const { userId } = await auth();

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