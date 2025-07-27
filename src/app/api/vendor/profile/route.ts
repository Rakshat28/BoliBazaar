import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: Request) {
  try {
    // Get the real authenticated user
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { areaGroupId } = body;

    if (!areaGroupId) {
      return new NextResponse("Area Group ID is required", { status: 400 });
    }

    // First, check if vendor exists, if not create it
    let vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    if (!vendor) {
      // Create vendor record if it doesn't exist
      vendor = await prisma.vendor.create({
        data: {
          user_id: userId,
          area_group_id: areaGroupId,
        },
      });
    } else {
      // Update existing vendor
      vendor = await prisma.vendor.update({
        where: { user_id: userId },
        data: { area_group_id: areaGroupId },
      });
    }

    return new NextResponse("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("[VENDOR_PROFILE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}