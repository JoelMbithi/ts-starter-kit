  "use client"

  import StatCard from '@/components/admin/StatCard'
import { columns, Payment } from '@/components/admin/table/columns'
import { DataTable } from '@/components/admin/table/DataTable'
  import Image from 'next/image'
  import Link from 'next/link'
  import React, { useEffect, useState } from 'react'



  const dashboard =  () => {
      const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
  

     const fetchAppointments = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/appointment')
        const data = await res.json()
        setAppointments(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchAppointments()
    }, []) 
    return (
      <div className='mx-auto flex flex-col space-y-14'>
        <header className='sticky top-3 z-20 mx-3 flex items-center justify-between rounded-2xl bg-black px-[5%] py-5 shadow-lg xl:px-12'>
          <Link href={"/"} className='cursor-pointer'>
          <Image 
            src={"/assets/icons/logo-full.svg"}
            height={32}
            width={162}
            className='h-8 w-fit'
            alt='logo'
          />
          </Link>
        <p className='text-16 font-semibold'>Admin Dashboard</p>
        </header>

        <main className='flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12'>
          <section className='w-full space-y-4'>
            <h1 className='text-2xl font-bold text-white'>Welcome</h1>
            <p className='text-gray-300 '>Start the day with managing new appointments</p>
            </section>

            <section className=' flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10'>
              <StatCard  
              type="appointments"
              appointments={appointments}
              label="Sceheduled appointments"
              icon="/assets/icons/appointments.svg"
              />
              <StatCard  
              type="pending"
            appointments={appointments}
              label="Pending appointments"
              icon="/assets/icons/pending.svg"
              />
              <StatCard  
              type="cancelled"
            appointments={appointments}
              label="Cancelled appointments"
              icon="/assets/icons/cancelled.svg"
              />
            </section>
           {/*  <DataTable columns={columns}  appointments={appointments}/> */}
             <DataTable columns={columns} data={appointments} />
        </main>
      </div>
    )
  } 

  export default dashboard
