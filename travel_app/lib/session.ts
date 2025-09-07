// lib/session.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

export async function getSession() {
  return await getServerSession(authOptions);
}

// Alternative: Get session from request cookies
export async function getSessionFromRequest(req: NextRequest) {
  // This is a workaround for server actions
  const session = await getServerSession(authOptions);
  return session;
}