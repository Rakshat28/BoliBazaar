// types/globals.d.ts

export {};

export type Roles = "vendor" | "supplier";

declare module '@clerk/nextjs' {
  interface UserPublicMetadata {
    role?: Roles;
  }

  interface SessionClaims {
    publicMetadata: {
      role?: Roles;
    };
  }

  // ✅ This is the actual fix — override the method signature
  interface User {
    update: (params: {
      publicMetadata?: {
        role?: Roles;
        [key: string]; // allow flexibility for other metadata
      };
    }) => Promise<void>;
  }
}

declare global {
  interface CustomJWTSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
