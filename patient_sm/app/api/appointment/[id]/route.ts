import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = parseInt(params.id);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true, patient: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}
