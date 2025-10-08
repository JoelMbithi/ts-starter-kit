"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "./AppointmentModal";

// Appointment type for your table data
export type Appointment = {
  id: string;
  amount: number;
  status: "pending" | "scheduled" | "cancelled";
  email: string;
  date: string;
  patient: { id: string; name: string };
  doctor: { image: string; name: string };
};

//  Define columns
export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-lg font-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-lg font-medium">{appointment.patient.name}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text font-regular min-w[100px]">
        {formatDateTime(row.original.date).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryphysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image}
            alt={doctor.name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <p>Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-2">
          <AppointmentModal
            type="update"
            patientId={data.patient.id}
            appointment={{
              id: data.id,
              doctorId: data.doctor.name, 
              date: data.date,
              time: "10:00 AM",
              reason: "Follow-up",
              notes: "",
              status: data.status,
              patient: data.patient,
            }}
            title="Update Appointment"
            description="Please confirm the following details to update this appointment."
          />

          <AppointmentModal
            type="cancel"
            patientId={data.patient.id}
            appointment={{
              id: data.id,
              doctorId: data.doctor.name,
              date: data.date,
              time: "10:00 AM",
              reason: "Cancel",
              notes: "",
              status: data.status,
              patient: data.patient,
            }}
            title="Cancel Appointment"
            description="Are you sure you want to cancel this appointment?"
          />
        </div>
      );
    },
  },
];
