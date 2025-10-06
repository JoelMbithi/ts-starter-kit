import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, doctorId, reason, date, time, notes } = await req.json();

    if (!email || !doctorId || !date || !time || !reason) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    //  Find existing patient by email
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: "Patient not found. Please register first." },
        { status: 404 }
      );
    }

    // Create new appointment
    const appointment = await prisma.appointment.create({
      data: {
        doctorId: parseInt(doctorId),
        patientId: existingPatient.id,
        date: new Date(date),
        time,
        reason,
        notes: notes || "",
        status: "scheduled",
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    return NextResponse.json(
      { message: "Appointment created successfully", appointment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/* export async function GET() {
  try {
    const response = await prisma.appointment.findMany()
    return NextResponse.json(response)
  } catch (error) {
   console.log(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
} */

  export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(params.id) },
      include: { doctor: true, patient: true }
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}
