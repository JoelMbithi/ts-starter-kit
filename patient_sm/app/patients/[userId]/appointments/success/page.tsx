"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

// Define the Appointment interface (adjust if needed)
interface Doctor {
  id: number;
  name: string;
  image: string;
}

interface Patient {
  id: number;
  name: string;
  email: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  notes?: string;
  doctor: Doctor;
  patient: Patient;
}

const Success = () => {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientId = searchParams.get("patientId"); // Get userId from search params if available

  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const formatDateTime = (dateString: string, time: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${formattedDate} at ${time}`;
};


  const fetchAppointment = async () => {
    if (!appointmentId) return;

    try {
      const response = await fetch(`/api/appointment/${appointmentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAppointment(data); // Single object
      console.log(data)
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='m-auto flex flex-1 flex-col items-center justify-between gap-10 py-10'>
        <Link href="/">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt='logo'
            className='h-10 w-fit'
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image
            src={"/assets/gifs/success.gif"}
            height={300}
            width={280}
            alt='success'
          />
          <h2 className='mb-6 max-w-[600px] text-center text-xl font-bold md:text-2xl '>
            Your <span className='text-green-500'>appointment request</span> has  <br />been successfully submitted!
          </h2>
          <h1>We will be in touch shortly to confirm.</h1>
        </section>

        <section className="flex w-full flex-col items-center gap-8 border-y-1 border-dark-400 py-8 md:w-fit md:flex-row">
          <p>Requested appointment details:</p>
          {appointment && (
            <div className="flex items-center gap-3">
              <Image
                src={appointment.doctor.image}
                alt={appointment.doctor.name}
                width={100}
                height={100}
                className='size-10'
              />
              <p>Dr. {appointment.doctor.name}</p> <div className='flex gap-2'>
                <Image
                src={"/assets/icons/calendar.svg"}
                height={24}
                width={24}
                alt='calender'
                />
                <p>{formatDateTime(appointment.date, appointment.time)}</p>
            </div>
            </div>
            
          )}
         
         </section>
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="outline" asChild>
             <Link href={ `/patients/${patientId}/new-appointment` }>
            
             New Appointment</Link>
       
        </Button>

        <p className='text-xl '>&copy; 2025 CarePulse</p>
      </div>
    </div>
  );
};

export default Success;
