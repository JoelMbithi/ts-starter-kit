"use client"
import { getUser } from '@/app/api/users/route'
import RegisterForm from '@/components/form/RegisterForm'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'



const Registion = ({ user }: { user?: RegistionProps }) => {
 const [users,setUsers] = useState("")
   
  const fetchUser = async () => {
          try {
            const response = await fetch(`/api/users?id=${user}`)
            const data = await response.json()
            setUsers(data)
          } catch (error) {
             console.error("Failed to fetch user:", error);
          }
         }

         useEffect (() => {
           fetchUser()
         },[])
  return (
    <div className="flex h-screen w-full max-h-screen">
        <section className="remove-scrollbar flex items-center w-full  justify-center my-auto ">
         <div className="flex w-120 flex-col px-10 "> 
           <Image src="/assets/icons/logo-full.svg" alt="logo"
             className="mb-12 h-10 w-fit"
             height={1000}
             width={1000}
           />
           {user ? <RegisterForm user={user} /> : <RegisterForm />}
   
           <div className="text-14-regular mt-20 flex  justify-between">
             <p className="justify-items-end text-dark-600 xl:text-left">
               &copy; 2025 CarePulse
             </p>
             <Link href={'/?admin=true' } className="text-green-500">Admin</Link>
           </div>
         </div>
        </section>
        <Image
         src="/assets/images/register-img.png"
         height={1000}
         width={1000}
         alt="patient"
         className="hidden sticky md:flex side-img max-w-[690px]"
        />
      </div>
  )
}

export default Registion
