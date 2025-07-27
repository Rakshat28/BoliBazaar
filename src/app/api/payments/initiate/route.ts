import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount } = body;

    // FIXME: Get your KEY and SALT from your .env.local file.
    // These are provided in your PayU test dashboard.
    const merchantKey = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;

    if (!merchantKey || !salt) {
      console.error("PayU credentials are not configured.");
      return new NextResponse("Server configuration error", { status: 500 });
    }
    
    const user = await prisma.user.findUnique({ where: { id: userId }});
    if (!user) return new NextResponse("User not found", { status: 404 });

    const txnid = `BOLI-WALLET-${Date.now()}`;
    const productinfo = "Boli-Lagao Wallet Top-up";
    const firstname = user.full_name || "Boli-Lagao Vendor";
    const email = user.email;
    const phone = user.phone_number || "9999999999";
    const surl = `${process.env.NEXT_PUBLIC_URL}/vendor/wallet?payment=success`; // Redirect after success
    const furl = `${process.env.NEXT_PUBLIC_URL}/vendor/wallet?payment=failure`; // Redirect after failure

    // The order of these fields for the request hash is critical.
    const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${userId}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const formData = {
        txnid, amount, productinfo, firstname, email, phone, surl, furl, hash, merchantKey, udf1: userId
    };

    return NextResponse.json(formData);

  } catch (error) {
    console.error("[PAYMENT_INITIATE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}