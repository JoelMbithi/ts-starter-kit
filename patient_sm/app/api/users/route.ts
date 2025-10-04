import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name, phone, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { patients: true }, // Include patients in the response
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          error: "User Already Exists",
          user: existingUser // Return the existing user with patients
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: { email, name, password, phone },
      include: { patients: true }, // Include patients in the response
    });

    return NextResponse.json(
      { message: "User Created Successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const email = searchParams.get("email");

    console.log("🔍 Fetching user with:", { userId, email });

    // Handle email-based lookup
    if (email && email !== "undefined") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { 
          patients: {
            include: {
              identificationType: true
            }
          } 
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    }

    // Handle ID-based lookup
    if (userId && userId !== "undefined" && !isNaN(Number(userId))) {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { 
          patients: {
            include: {
              identificationType: true
            }
          } 
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    }

    // If neither valid ID nor email is provided
    return NextResponse.json(
      { error: "Valid user id or email is required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}