import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch all transactions linked to this user's ID
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
      // Include related order item and product for more context
      include: {
        relatedOrderItem: {
          include: {
            pooledOrder: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Show the most recent transactions first
      },
    });

    // TODO: Fetch or calculate the current wallet balance.
    // This might be a separate field on the Vendor model or calculated
    // by summing all transactions. For now, we'll send a static value.
    const walletData = {
      balance: "2450.00",
      history: transactions,
    };

    return NextResponse.json(walletData);

  } catch (error) {
    console.error("[VENDOR_WALLET_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}