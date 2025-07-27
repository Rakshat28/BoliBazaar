import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

//TODO: this was created brand new and needs to be tested

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { areaGroupId } = await req.json();

    if (!areaGroupId) {
      return new NextResponse("Area group ID is required", { status: 400 });
    }

    // Verify the area group exists
    const areaGroup = await prisma.areaGroup.findUnique({
      where: { id: areaGroupId },
    });

    if (!areaGroup) {
      return new NextResponse("Area group not found", { status: 404 });
    }

    // Update vendor's area group
    await prisma.vendor.update({
      where: { user_id: userId },
      data: { area_group_id: areaGroupId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VENDOR_UPDATE_AREA]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 