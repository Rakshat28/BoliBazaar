"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Roles } from "../../../../types/globals";
import { revalidatePath } from "next/cache";

interface CustomSessionClaims {
  publicMetadata?: {
    role?: Roles;
  };
}

export async function setRole(formData : FormData){
    const { sessionClaims } = await auth();

    const claims = sessionClaims as CustomSessionClaims | null | undefined;

    if(claims?.publicMetadata?.role !== 'supplier'){
        throw new Error("Unauthorized: You are not a supplier");
    }

    const client = await clerkClient();
    const id = formData.get('id') as string;
    const role = formData.get('role') as Roles;

    try {
        await client.users.updateUser(id, {
            publicMetadata: {
                role: role
            }
        });
        revalidatePath('/supplier');
    } catch (error) {
        console.error("Failed to update user role:", error);
        throw new Error("Failed to update user role");
    }
}