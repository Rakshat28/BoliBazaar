import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(cities);
  } catch (error) {
    console.error("[CITIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}