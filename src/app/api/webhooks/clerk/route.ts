export const runtime = "nodejs";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
// Import Prisma types
import { PrismaClient, UserRole, Prisma } from "@prisma/client"; 
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
    console.error(" Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  // Handle user created
  if (eventType === "user.created") {
    const user = evt.data as UserJSON;
    const roleFromMetadata =
      (user.public_metadata?.role as UserRole | undefined) || "VENDOR";

    try {
      // Use a transaction to create the User AND the related profile
      await prisma.$transaction(async (tx) => {
        // 1. Create the User
        await tx.user.create({
          data: {
            id: user.id,
            email: user.email_addresses[0]?.email_address || "",
            phone_number: user.phone_numbers[0]?.phone_number || null,
            full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            role_type: roleFromMetadata,
          },
        });

        // 2. Create the corresponding Vendor or Supplier profile
        if (roleFromMetadata === "VENDOR") {
          await tx.vendor.create({
            data: {
              user_id: user.id,
              reputation_score: 5.00,
              area_group_id: null,
            },
          });
        } else if (roleFromMetadata === "SUPPLIER") {
          await tx.supplier.create({
            data: {
              user_id: user.id,
              business_name: `${user.first_name || "New"} ${user.last_name || "Supplier"}`.trim(),
              verification_status: "PENDING",
              overall_rating: 5.00,
            },
          });
        }
      });

      console.log(
        `User and ${roleFromMetadata} profile created: ${user.id}`
      );
    } catch (error) {
      console.error("Failed to create user and profile:", error);
      return new NextResponse("Error creating user profile", { status: 500 });
    }
  }

  // Handle user updated
  if (eventType === "user.updated") {
    const user = evt.data as UserJSON;
    const roleFromMetadata = user.public_metadata?.role as UserRole | undefined;

    const updateData: Prisma.UserUpdateInput = {
      email: user.email_addresses[0]?.email_address || "",
      phone_number: user.phone_numbers[0]?.phone_number || null,
      full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    };

    if (roleFromMetadata) {
      updateData.role_type = roleFromMetadata;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    console.log(`User updated: ${user.id}`);
  }

  // Handle user deleted
  if (eventType === "user.deleted") {
    const deleted = evt.data as DeletedObjectJSON;

    if (!deleted.id) {
      return new NextResponse("User ID missing from delete event", { status: 400 });
    }

    try {
      await prisma.user.delete({
        where: { id: deleted.id },
      });
      console.log(`User deleted: ${deleted.id}`);
    } catch (error) {
      console.error(`Failed to delete user: ${deleted.id}`, error);
    }
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
