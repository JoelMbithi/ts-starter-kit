import { prisma } from "@/lib/prisma.config"
import { NextResponse } from "next/server"



export async function  GET () {
    try {
        const doctors = await prisma.doctors.findMany()
        return NextResponse.json(doctors ?? [])
    } catch (error) {
          console.error("Error fetching doctors:", error);
            return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
          }
    
}