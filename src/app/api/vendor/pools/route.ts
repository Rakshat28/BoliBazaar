import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    if (!vendor || !vendor.area_group_id) {
      return new NextResponse("Vendor profile not found or incomplete", { status: 404 });
    }

    // Get available pools for the vendor's area
    const pools = await prisma.pooledOrder.findMany({
      where: {
        area_group_id: vendor.area_group_id,
        status: { in: ['PREPARING', 'AUCTION_OPEN'] },
      },
      include: {
        product: true,
        areaGroup: true,
        Bids: {
          include: {
            supplier: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(pools);
  } catch (error) {
    console.error("[VENDOR_POOLS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 