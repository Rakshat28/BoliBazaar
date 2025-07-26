import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId');

  if (!cityId) {
    return new NextResponse("City ID is required", { status: 400 });
  }

  try {
    const areaGroups = await prisma.areaGroup.findMany({
      where: {
        city_id: parseInt(cityId),
      },
      orderBy: {
        area_name: 'asc',
      },
    });
    return NextResponse.json(areaGroups);
  } catch (error) {
    console.error("[AREA_GROUPS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}