// auth/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Export the auth function
export const { auth } = NextAuth(authOptions);