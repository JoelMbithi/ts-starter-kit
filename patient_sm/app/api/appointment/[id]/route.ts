import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = parseInt(params.id);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        doctor: {
          select: { name: true, image: true },
        },
        patient: {
          select: { name: true, email: true },
        },
      },
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




/*   export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = parseInt(params.id);
    const body = await req.json();
    const { doctorId, date, time, reason, notes, status } = body;

    // Find existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Prepare update data safely
    const updateData: any = {
      date: date ? new Date(date) : existingAppointment.date,
      time: time ?? existingAppointment.time,
      reason: reason ?? existingAppointment.reason,
      notes: notes ?? existingAppointment.notes,
      status: status ?? existingAppointment.status,
    };

    // Only connect doctor if valid doctorId exists
    if (doctorId && !isNaN(parseInt(doctorId))) {
      updateData.doctor = { connect: { id: parseInt(doctorId) } };
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        doctor: {
          select: { name: true, image: true },
        },
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { message: "Failed to update appointment", error: String(error) },
      { status: 500 }
    );
  }
} */

 export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = parseInt(params.id);
    const body = await req.json();
    const { doctorId, date, time, reason, notes, status } = body;

    // Find existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Prepare update data safely
    const updateData: any = {
      date: date ? new Date(date) : existingAppointment.date,
      time: time ?? existingAppointment.time,
      reason: reason ?? existingAppointment.reason,
      notes: notes ?? existingAppointment.notes,
      status: status ?? existingAppointment.status,
    };

    // ✅ Safely connect doctor if valid ID exists
    if (doctorId && Number.isInteger(Number(doctorId))) {
      updateData.doctor = { connect: { id: Number(doctorId) } };
    }

    console.log("Updating appointment with data:", updateData);

    // ✅ Update appointment with safe data
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        doctor: {
          select: { name: true, image: true },
        },
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      {
        message: "Failed to update appointment",
        error:
          error instanceof Error ? error.message : "Unknown server error occurred",
      },
      { status: 500 }
    );
  }
}