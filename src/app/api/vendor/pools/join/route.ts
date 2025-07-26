import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  // FIXME: This is a placeholder for testing.
  // Once Clerk is live, this will be replaced by the real user ID.
  const userId = "user_2i3B2aBcDeFgHiJkLmNoPqRsTuV"; // Replace with a valid user_id from your 'vendors' table
  // const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { poolId, quantity } = body;

    // --- Validation ---
    if (!poolId || !quantity) {
      return new NextResponse("Pool ID and quantity are required", { status: 400 });
    }
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return new NextResponse("Invalid quantity provided", { status: 400 });
    }

    // --- Database Transaction ---
    // A transaction ensures that both operations (creating the item and updating the pool)
    // either both succeed or both fail. This maintains data integrity.
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Create the new OrderItem
      const newOrderItem = await tx.orderItem.create({
        data: {
          pooled_order_id: poolId,
          vendor_id: userId,
          quantity_committed: numQuantity,
          status: 'COMMITTED', // Or 'DEPOSIT_PAID' if you handle payment here
        },
      });

      // Step B: Update the total committed quantity on the PooledOrder
      await tx.pooledOrder.update({
        where: { id: poolId },
        data: {
          total_quantity_committed: {
            increment: numQuantity,
          },
        },
      });
      
      // TODO: Implement escrow deposit logic.
      // This would involve creating a record in the 'transactions' table
      // and potentially integrating with a payment provider.

      return newOrderItem;
    });

    return NextResponse.json(result, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("[VENDOR_POOLS_JOIN_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}