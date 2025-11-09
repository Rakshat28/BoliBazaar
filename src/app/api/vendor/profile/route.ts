import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: Request) {
const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { areaGroupId } = body;

  if (!areaGroupId) {
    return new NextResponse("Area Group ID is required", { status: 400 });
  }

  try {
    // This query finds the vendor by their user ID and updates their area_group_id.
    await prisma.vendor.update({
      where: {
        user_id: userId,
      },
      data: {
        area_group_id: areaGroupId,
      },
    });

    return new NextResponse("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("[VENDOR_PROFILE_PATCH]", error);
    // This could fail if the vendor profile doesn't exist yet, which is a state to consider.
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}