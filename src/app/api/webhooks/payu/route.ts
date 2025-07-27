import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // PayU sends data as 'application/x-www-form-urlencoded'
    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());
    
    // --- 1. Hash Validation (CRITICAL FOR SECURITY) ---
    // FIXME: Get your SALT from your PayU Merchant Dashboard and add it to your .env.local file.
    const salt = process.env.PAYU_SALT;
    if (!salt) {
      console.error("PAYU_SALT is not configured in environment variables.");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    // This is the specific string format for a SUCCESSFUL payment response hash from PayU.
    const hashString = `${salt}|${payload.status}|${payload.udf10}|${payload.udf9}|${payload.udf8}|${payload.udf7}|${payload.udf6}|${payload.udf5}|${payload.udf4}|${payload.udf3}|${payload.udf2}|${payload.udf1}|${payload.email}|${payload.firstname}|${payload.productinfo}|${payload.amount}|${payload.txnid}|${payload.key}`;
    
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (calculatedHash !== payload.hash) {
      console.warn("Webhook hash mismatch. Potential tampering.", { calculated: calculatedHash, received: payload.hash });
      return new NextResponse("Invalid hash", { status: 403 }); // 403 Forbidden
    }

    // --- 2. Process the Validated Webhook ---
    const { amount, status, udf1: userId } = payload;
    
    if (status === 'success') {
      const user = await prisma.user.findUnique({
        where: { id: userId as string },
      });

      if (!user) {
        console.warn(`Webhook received for non-existent user ID: ${userId}`);
        return new NextResponse("User not found", { status: 404 });
      }

      const numAmount = new Decimal(amount as string);

      // Create the transaction record to credit the vendor's wallet
      await prisma.transaction.create({
        data: {
          user_id: user.id,
          amount: numAmount,
          // TODO: Add a 'WALLET_CREDIT' enum to your TransactionType. Using 'REFUND' as a placeholder for a positive transaction.
          txn_type: 'REFUND',
          status: 'SUCCESSFUL',
        },
      });
    }

    // Respond to PayU that we have successfully received and processed the webhook
    return new NextResponse("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("[PAYU_WEBHOOK_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}