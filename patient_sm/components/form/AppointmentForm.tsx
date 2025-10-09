"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomForm from "./CustomForm";
import ButtonCustom from "../ButtonCustom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import Image from "next/image";
import { SelectItem } from "../ui/select";


// Type Definitions

interface Doctor {
  id: string;
  name: string;
  image: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
  notes?: string;
  status?: string;
}

interface UpdateAppointmentInput {
  id: string;
  doctorId?: string;
  date?: string;
  time?: string;
  reason?: string;
  notes?: string;
  status?: string;
}

const formSchema = z.object({
  doctorId: z.string().optional(),
  notes: z.string().optional(),
  reason: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  cancellationReason: z.string().optional(),
});


type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  patientId: string;
  patient?: any;
  type: "create" | "cancel" | "schedule" | "update";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void; 
}



// Component

const AppointmentForm = ({
  patientId,
  patient,
  type,
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
   const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
   
 
  // Button Label

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "update":
      buttonLabel = "Update Appointment";
      break;
    case "create":
    case "schedule":
      buttonLabel = "Create Appointment";
      break;
    default:
      buttonLabel = "Submit";
  }


  // React Hook Form

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: "",
      notes: "",
      reason: "",
      date: "",
      time: "",
      cancellationReason: "",
    },
  });


  // Create Appointment

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      console.log("Creating appointment:", data);

      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: patient?.email,
          doctorId: data.doctorId,
          date: data.date,
          time: data.time,
          reason: data.reason,
          notes: data.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create appointment");
      }

      console.log("Appointment created:", result);

      router.push(
        `/patients/${patientId}/appointments/success?appointmentId=${result.appointment.id}&patientId=${patientId}`
      );

      if (setOpen) setOpen(false);
    } catch (error) {
      console.error(" Error submitting form:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };


  // Update Appointment
/* 
  const updateAppointment = async (appointmentData: UpdateAppointmentInput) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointment/${appointmentData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to update appointment");
      }

      console.log(" Appointment updated:", result.updatedAppointment);

      router.push(
        `/patients/${patientId}/appointments/success?appointmentId=${appointmentData.id}&updated=true`
      );

      if (setOpen) setOpen(false);
    } catch (error) {
      console.error(" Error updating appointment:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };
 */  
const fetchSingleAppointment = async (id: string) => {
   try {
      const res = await fetch(`/api/appointment/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      console.log("Fetched appointment:", data);
      setCurrentAppointment(data);

      //  Prefill form with existing appointment details
      form.reset({
       doctorId: data.doctor?.name || "",
      
        notes: data.notes || "",
        reason: data.reason || "",
        date: data.date.split("T")[0],
        time: data.time,
      });
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
    }
  };

  useEffect(() => {
    if (type === "update" && appointment?.id) {
      fetchSingleAppointment(appointment.id);
    }
  }, [type, appointment]);
  
  // Fetch Doctors
 
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

 
  // Generate Time Slots

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    setAvailableTimes(times);
  };

  useEffect(() => {
    fetchDoctors();
    generateTimeSlots();
  }, []);

  //  When updating, prefill form
  useEffect(() => {
    if (appointment && type === "update") {
      form.reset({
        doctorId: appointment.doctorId || "",
        notes: appointment.notes || "",
        reason: appointment.reason || "",
        date: appointment.date ? appointment.date.split("T")[0] : "",
        time: appointment.time || "",
      });
    }
  }, [appointment, type, form]);

 
 const updateAppointment = async (appointmentData: UpdateAppointmentInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appointment/${appointmentData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      console.log("Appointment Updated:", result.updatedAppointment);
      router.push(`/admin/dashboard`);
      if (setOpen) setOpen(false);
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update appointment");
    } finally {
      setIsLoading(false);
    }
  };
  // Cancel Appointment
const cancelAppointment = async (id: string, cancellationReason: string) => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/appointment/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        notes: cancellationReason || "Cancelled by user",
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to cancel appointment");

    console.log("Appointment cancelled:", result.updatedAppointment);
    alert("Appointment cancelled successfully!");

    router.refresh();
    if (setOpen) setOpen(false);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    alert("Failed to cancel appointment");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          if (type === "create" /* || type === "schedule" */) {
  await onSubmit(data);
} else if (type === "update" && appointment) {
  await updateAppointment({
    id: appointment.id,
    doctorId: data.doctorId,
    date: data.date,
    time: data.time,
    reason: data.reason,
    notes: data.notes,
    status: "scheduled",
  });
} else if (type === "cancel" && appointment) {
  await cancelAppointment(appointment.id, data.cancellationReason || "");

}

        })}
        className="space-y-8"
      >
        <section className="mb-12 space-y-4">
          <h1 className="text-xl font-bold text-white">
            {type === "update" ? "Update Appointment" : "New Appointment"}
          </h1>
          <p className="text-sm text-gray-400">
            {patient
              ? `Booking for ${patient.name}`
              : "Schedule your appointment"}
          </p>
        </section>

        {type !== "cancel" && (
          <>
            {/* Doctor Selection */}
            <CustomForm
              control={form.control}
              formField={FormFieldType.SELECT}
              name="doctorId"
              placeholder="Select a Doctor"
              label="Doctor"
            >
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomForm>

            {/* Date Selection */}
            <CustomForm
              control={form.control}
              formField={FormFieldType.DATE_PICKER}
              name="date"
              placeholder="Select appointment date"
              label="Appointment Date"
            />

            {/* Time Selection */}
            <CustomForm
              control={form.control}
              formField={FormFieldType.SELECT}
              name="time"
              placeholder="Select appointment time"
              label="Appointment Time"
            >
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </CustomForm>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomForm
                control={form.control}
                formField={FormFieldType.TEXTaREA}
                name="notes"
                placeholder="Additional notes (optional)"
                label="Notes"
              />
              <CustomForm
                control={form.control}
                formField={FormFieldType.TEXTaREA}
                name="reason"
                placeholder="Reason for appointment"
                label="Reason for Appointment"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomForm
            control={form.control}
            formField={FormFieldType.TEXTaREA}
            name="cancellationReason"
            placeholder="Enter reason for cancellation"
            label="Reason for Cancellation"
          />
        )}

        <ButtonCustom
          className={`${
            type === "cancel"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } w-full`}
          isLoading={isLoading}
        >
          {buttonLabel}
        </ButtonCustom>
      </form>
    </Form>
  );
};

export default AppointmentForm;
