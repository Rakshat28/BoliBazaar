export const runtime = "nodejs";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import {
  UserJSON,
  DeletedObjectJSON,
  WebhookEvent,
} from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const CLERK_WEBHOOK_SECRET_KEY = process.env.CLERK_WEBHOOK_SECRET_KEY || "";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(CLERK_WEBHOOK_SECRET_KEY);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  // ---------------- Handle user events ----------------
  if (eventType === "user.created" || eventType === "user.updated") {
    const user = evt.data as UserJSON;

    const role = (user.private_metadata?.role || "VENDOR") as UserRole;

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email_addresses[0]?.email_address || "",
        phone_number: user.phone_numbers[0]?.phone_number || null,
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        role_type: role,
      },
      create: {
        id: user.id,
        email: user.email_addresses[0]?.email_address || "",
        phone_number: user.phone_numbers[0]?.phone_number || null,
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        role_type: role,
      },
    });

    console.log(`User ${eventType === "user.created" ? "created" : "updated"}: ${user.id}`);
  }

  if (eventType === "user.deleted") {
    const deleted = evt.data as DeletedObjectJSON;

    await prisma.user.delete({
      where: { id: deleted.id },
    });

    console.log(`User deleted: ${deleted.id}`);
  }

  // ---------------- Handle other events if needed ----------------
  if (eventType.startsWith("event.")) {
    console.log(`Event Event Received: ${eventType}`, evt.data);
    // Add your own logic here...
  }

  if (eventType.startsWith("role.")) {
    console.log(`Role Event Received: ${eventType}`, evt.data);
    // Add your own logic here...
  }

  return new NextResponse("Webhook processed", { status: 200 });
}