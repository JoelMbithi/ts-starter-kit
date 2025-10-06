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

const formSchema = z.object({
  doctorId: z.string().min(1, { message: "Please select a doctor" }),
  notes: z.string().optional(),
  reason: z.string().min(1, { message: "Reason is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  patientId: string;
  patient?: any; // Add patient prop
  type: "create" | "cancel" | "schedule";
}

const AppointmentForm = ({ patientId, patient, type }: AppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);


  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
    case "schedule":
      buttonLabel = "Create Appointment";
      break;
    default:
      buttonLabel = "Submit";
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: "",
      notes: "",
      reason: "",
      date: "",
      time: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      console.log("Creating appointment:", data);
     
      const response = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
    email: patient.email,
    doctorId: data.doctorId,
    date: data.date,
    time: data.time,
    reason: data.reason,
    notes: data.notes,
  }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create appointment');
      }

      console.log(" Appointment created:", result);
      
      // Redirect to success page or appointments list
      router.push(`/patients/${patientId}/appointments/success?appointmentId=${result.appointment.id}`);

      
    } catch (error) {
      console.error(" Error submitting form:", error);
      alert(error instanceof Error ? error.message : "Failed to create appointment");
    } finally {
      setIsLoading(false);
    }
  };

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

 

  // Generate available times
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    setAvailableTimes(times);
  };

  useEffect(() => {
    fetchDoctors();
    generateTimeSlots();
   
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="text-xl font-bold text-white">New Appointment</h1>
          <p className="text-sm text-gray-400">
            {patient ? `Booking for ${patient.name}` : 'Schedule your appointment'}
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
            type === 'cancel' 
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