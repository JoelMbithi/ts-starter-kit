// app/api/auth/sign-up/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, address, city, gender, code, date } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to DB
    const user = await Prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        city,
        gender,
        code,
        dateOfBirth: date,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
