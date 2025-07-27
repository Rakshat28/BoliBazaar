import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    //FIXME:
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

    if (!vendor) {
      return new NextResponse("Vendor profile not found", { status: 404 });
    }

    // Check if vendor has completed onboarding (has area_group_id)
    if (!vendor.area_group_id || vendor.area_group_id === 0) {
      return new NextResponse("Vendor onboarding incomplete", { status: 400 });
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

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error("[VENDOR_DASHBOARD_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}