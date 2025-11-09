import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// Ensure this route is always dynamic and uses the latest user session
export const dynamic = 'force-dynamic';

export async function GET() {
  // Use the real userId from Clerk's auth helper
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    if (!vendor) {
      // This is a valid state for a user who just signed up but hasn't onboarded
      // Return 0 stats instead of an error
      const dashboardStats = {
        activePools: 0,
        successfulPools: 0,
        totalSaved: `₹0`,
      };
      return NextResponse.json(dashboardStats);
    }

    // --- Real Database Queries for Dashboard Stats ---

    let activePoolsCount = 0;

    // Only search for pools if the vendor has an area_group_id
    if (vendor.area_group_id) {
      activePoolsCount = await prisma.pooledOrder.count({
        where: {
          area_group_id: vendor.area_group_id,
          status: { in: ['PREPARING', 'AUCTION_OPEN'] },
        },
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const successfulPoolsCount = await prisma.orderItem.count({
      where: {
        vendor_id: userId,
        status: 'DELIVERED',
        pooledOrder: {
          created_at: { gte: thirtyDaysAgo },
        },
      },
    });
    
    // TODO: Implement a robust savings calculation.
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