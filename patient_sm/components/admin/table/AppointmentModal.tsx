'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import AppointmentForm from '@/components/form/AppointmentForm'


export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
  notes?: string;
  status?: string;
  patientId?: string; 
  patient?: {          
    id: string;
    name: string;
  };
}

interface AppointmentProps {
    type: 'schedule' | 'cancel' | 'update',
    patientId:string,
    appointment?: Appointment,
    title:string,
    description: string
    patient?: {          
    id: string;
    name: string;
    email:string
  };
}
const AppointmentModal = ({type, patientId, appointment, description}: AppointmentProps) => {
    const [ open, setOpen] = useState(false)
  return (
   <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button  className={`capitalize ${type === 'update' && 'text-green-500'}`}>
        {type}
    </Button>
  </DialogTrigger>
  <DialogContent className='sm:max-w-md max-h-[80vh] overflow-y-auto'>
    <DialogHeader className='mb-4 space-y-3'>
      <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
      <DialogDescription>
       Please fill in the following details to {type} an appointment
      </DialogDescription>
    </DialogHeader>
   
   <AppointmentForm
      patientId={patientId}
      appointment={appointment} 
      type={type}
       patient={appointment?.patient || { name: "" }} 
      setOpen={setOpen}
   />
  </DialogContent>
</Dialog>
  )
}

export default AppointmentModal
