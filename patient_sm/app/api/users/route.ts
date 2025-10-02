import { prisma } from "@/lib/prisma.config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, name, phone, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 409 }
      )
    }

    // create new user
    const user = await prisma.user.create({
      data: { email, name, password, phone },
    })

    return NextResponse.json(
      { message: "User Created Successfully", user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error(" Error creating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export const getUser = async (req:Request) => {
    try {
        const  { searchParams } = new URL(req.url)
        const userId = searchParams.get("id")

        if(!userId){
            return NextResponse.json(
                {error:"User id is required"},
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where:{id: Number(userId)},
            include: { patients: true}
        })

        if(!user) {
            return NextResponse.json(
                {error:"User not found"},
                {status: 404}
            )
        }

        return NextResponse.json(userId, {status: 200})
        
    } catch (error:any) {
        console.error("Error fetching user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
    }
}