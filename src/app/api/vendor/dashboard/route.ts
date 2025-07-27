import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // Get the real authenticated user
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
      include: {
        areaGroup: true,
      },
    });

    console.log('Dashboard API: Vendor profile found:', vendor);

    // If vendor profile doesn't exist, return default stats
    if (!vendor) {
      console.log('Dashboard API: No vendor profile found, returning default stats');
      const defaultStats = {
        activePools: 0,
        successfulPools: 0,
        totalSaved: "₹0",
      };
      return NextResponse.json(defaultStats);
    }

    // If vendor hasn't completed onboarding, return default stats
    if (!vendor.area_group_id) {
      console.log('Dashboard API: Vendor onboarding incomplete, returning default stats');
      const defaultStats = {
        activePools: 0,
        successfulPools: 0,
        totalSaved: "₹0",
      };
      return NextResponse.json(defaultStats);
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
        status: 'DELIVERED',
        pooledOrder: {
          created_at: { gte: thirtyDaysAgo },
        },
      },
    });
    
    const totalSaved = 0; // TODO: Implement savings calculation

    const dashboardStats = {
      activePools: activePoolsCount,
      successfulPools: successfulPoolsCount,
      totalSaved: `₹${totalSaved}`,
    };

    console.log('Dashboard API: Returning stats:', dashboardStats);
    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error("[VENDOR_DASHBOARD_GET]", error);
    // Return default stats instead of error
    const defaultStats = {
      activePools: 0,
      successfulPools: 0,
      totalSaved: "₹0",
    };
    return NextResponse.json(defaultStats);
  }
}