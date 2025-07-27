import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  // FIXME: This is a temporary placeholder for testing.
  // Once Clerk authentication is fully implemented and tested on the frontend,
  // this line should be replaced with the one below it to get the real logged-in user.
  const userId = "user_2i3B2aBcDeFgHiJkLmNoPqRsTuV"; // Replace with a valid user_id from your 'vendors' table for testing
  // const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    if (!vendor) {
      return new NextResponse("Vendor profile not found for the provided user ID", { status: 404 });
    }

    // --- Real Database Queries for Dashboard Stats ---

    const activePoolsCount = await prisma.pooledOrder.count({
      where: {
        area_group_id: vendor.area_group_id,
        status: { in: ['PREPARING', 'AUCTION_OPEN'] },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const successfulPoolsCount = await prisma.orderItem.count({
      where: {
        vendor_id: userId,
        status: 'DELIVERED', // Counting delivered orders as successful participations
        pooledOrder: {
          created_at: { gte: thirtyDaysAgo },
        },
      },
    });
    
    // TODO: Implement a robust savings calculation.
    // This will require comparing the `final_price_per_unit` from won orders
    // against a benchmark market price for that product on that day.
    // Returning 0 until this logic is built.
    const totalSaved = 0;

    const dashboardStats = {
      activePools: activePoolsCount,
      successfulPools: successfulPoolsCount,
      totalSaved: `₹${totalSaved}`,
    };

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error("[VENDOR_DASHBOARD_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}