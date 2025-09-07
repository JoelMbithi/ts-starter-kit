// app/actions/create-trip.ts
"use server"
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies, headers } from "next/headers";

export async function createTrip(formData: FormData) {
  try {
    // Get the session using getServerSession
    const session = await getServerSession(authOptions);
    
    console.log("Session in createTrip:", session); // Debug log

    if (!session || !session.user?.id) {
      console.log("No session found - checking cookies");
      
      // Debug: log all cookies (properly await the promise)
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      console.log("All cookies:", allCookies);
      
      // Check for NextAuth specific cookies
      const nextAuthCookies = allCookies.filter(cookie => 
        cookie.name.includes('next-auth') || cookie.name.includes('session')
      );
      console.log("NextAuth cookies:", nextAuthCookies);
      
      throw new Error("Not authenticated - please sign in again");
    }

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const startDateStr = formData.get("startDate")?.toString();
    const endDateStr = formData.get("endDate")?.toString();

    if (!title || !description || !startDateStr || !endDateStr) {
      throw new Error("All fields are required.");
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    await prisma.trip.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        userId: session.user.id, 
      },
    });

    redirect("/trips");
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
}