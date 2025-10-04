import { prisma } from "@/lib/prisma.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract all form data
    const userId = formData.get("userId") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const occupation = formData.get("occupation") as string;
    const emergencyContactName = formData.get("emergencyContactName") as string;
    const emergencyContactNumber = formData.get("emergencyContactNumber") as string;
    const primaryPhysician = formData.get("primaryPhysician") as string;
    const insuranceProvider = formData.get("insuranceProvider") as string;
    const insurancePolicyNumber = formData.get("insurancePolicyNumber") as string;
    const allergies = formData.get("allergies") as string;
    const currentMedication = formData.get("currentMedication") as string;
    const familyMedicalHistory = formData.get("familyMedicalHistory") as string;
    const pastmedicalHistory = formData.get("pastmedicalHistory") as string;
    const identificationTypeId = formData.get("identificationTypeId") as string;
    const identificationNumber = formData.get("identificationNumber") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate") as string;
    const treatementConsent = formData.get("treatementConsent") === "true";
    const disclosureConsent = formData.get("disclosureConsent") === "true";
    const privacyConsent = formData.get("privacyConsent") === "true";

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    // Check if patient already exists for this user
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: "Patient profile already exists for this email" },
        { status: 409 }
      );
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        email,
        name,
        phone,
        address,
        occupation,
        emergencyContactName,
        emergencyContactNumber,
        primaryPhysician,
        insuranceProvider,
        insurancePolicyNumber,
        allergies: allergies || "",
        currentMedication: currentMedication || "",
        familyMedicalHistory: familyMedicalHistory || "",
        pastmedicalHistory: pastmedicalHistory || "",
        identificationTypeId: parseInt(identificationTypeId),
        identificationNumber,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        treatmentConsent: treatementConsent,
        disclosureConsent,
        privacyConsent,
        userId: parseInt(userId),
      },
      include: {
        identificationType: true,
        user: true,
      },
    });

    return NextResponse.json(
      { message: "Patient created successfully", patient },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("id");

    if (!patientId || isNaN(Number(patientId))) {
      return NextResponse.json(
        { error: "Valid patient id is required" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: Number(patientId) },
      include: {
        identificationType: true,
        user: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}