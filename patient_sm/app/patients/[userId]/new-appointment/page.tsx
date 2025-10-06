"use client";

import { useEffect, useState, use } from "react";
import AppointmentForm from "@/components/form/AppointmentForm";
import Image from "next/image";

interface PatientType {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export default function NewAppointment({ params }: { params: Promise<{ userId: string }> }) {
  // Unwrap the params promise
  const { userId } = use(params);

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
       const res = await fetch(`/api/Patient?patientId=${userId}`);

        if (!res.ok) throw new Error("Patient not found");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [userId]);

  if (loading) return <p>Loading patient info...</p>;
  if (!patient) return <p>Patient not found</p>;

  return (
    <div className="flex h-screen w-full max-h-screen">
      <section className="remove-scrollbar flex items-center w-full justify-center my-auto">
        <div className="flex w-120 flex-col px-10">
          {/* Logo */}
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            className="mb-12 h-10 w-fit"
            height={1000}
            width={1000}
          />

          {/* Appointment Form */}
          <AppointmentForm
            type="create"
            patientId={patient.id}
            patient={patient}
          />

          <div className="text-14-regular mt-10 flex justify-between">
            <p className="text-dark-600 xl:text-left">&copy; 2025 CarePulse</p>
          </div>
        </div>
      </section>

      {/* Right side image */}
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="hidden md:flex side-img max-w-[50%]"
      />
    </div>
  );
}
