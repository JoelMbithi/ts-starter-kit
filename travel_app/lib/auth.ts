// lib/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const auth = async () => {
  // For App Router, we need to use a different approach
  // getServerSession requires req/res objects which we don't have in server components
  const { getServerSession: getAppRouterSession } = await import("next-auth");
  
  return getAppRouterSession();
};

// Alternative: If you need the traditional getServerSession for API routes
export const getAuthSession = async (req: NextApiRequest, res: NextApiResponse) => {
  return getServerSession(req, res, authOptions);
};