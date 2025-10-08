import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.config";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, passKey } = await req.json();

    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json({ valid: false, message: "Admin not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(passKey, admin.passKey);

    if (!isValid) {
      return NextResponse.json({ valid: false, message: "Invalid passkey" }, { status: 401 });
    }

    return NextResponse.json({ valid: true, message: "Access granted" }, { status: 200 });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}
