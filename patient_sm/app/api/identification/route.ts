import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";



export async function GET () {
    try {
        const  IdentificationType = await prisma.identificationType.findMany()
         return NextResponse.json(IdentificationType )
    } catch (error) {
        console.error("Error fetching identificationTypes:", error);
            return NextResponse.json({ error: "Failed to fetch dentificationTypes" }, { status: 500 });
          }
    
}