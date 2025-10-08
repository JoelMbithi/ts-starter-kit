import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { json } from 'zod'


interface StatCardProps {
    type: 'appointments' | 'pending' | 'cancelled'
  
    label: string
    icon: string
 appointments: any[];
}
const StatCard = ({label, icon, type}: StatCardProps) => {
    const [loading,setLoading] = useState(false)
    const [appointments,setAppointments] = useState<any[]> ([])
     const [county,setCounty] = useState(0)

    const fetchAppointments = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/appointment")
            const data = await  res.json()
            setAppointments(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    },[])

    //count filter bty type
    const count = appointments.filter((appointment:any) => {
      if(type === 'appointments') return appointment.status==='scheduled';
      if(type === 'pending') return appointment.status === 'pending';
      if(type === 'cancelled') return appointment.status === 'cancelled'
    }).length

  return (
    <div className={clsx('flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-3 shadow-lg',  {
          // Gradient left to right for appointments
          "bg-gradient-to-r from-blue-500/40 to-black text-blue-300 border-blue-600":
            type === "pending",
          // Gradient left to right for pending
          "bg-gradient-to-r from-green-500/40 to-black text-yellow-300 border-yellow-600":
            type === "appointments",
          // Gradient left to right for cancelled
          "bg-gradient-to-r from-red-500/20 to-black text-red-300 border-red-600":
            type === "cancelled",
        }

)}>
      <div className='flex items-center gap-4'>
        <Image
        src={icon}
        height={32}
        width={32}
        alt='label'
        className='size-8 w-fit'
        />
        <h2 className='text-3xl font-bold text-white'>
        {loading ? <Loader2 /> : count}
        </h2>

      </div>
      <p className='text- font-regular'>{label}</p>
    </div>
  )
}

export default StatCard
