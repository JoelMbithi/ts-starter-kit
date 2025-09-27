

import { logOut } from '@/lib/actions/auth.client'
import { FooterProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Footer = ({user, type= 'desktop'}: FooterProps) => {
    const router = useRouter()
    const [loading,setLoading] = useState(false)

    const handleLogOut = async() => {
          setLoading(true)
        const loggedOut = await logOut()
      setLoading(false)
         if (loggedOut)
            { router.push("/sign-in")}
    }
  return (
    <footer className='flex cursor-pointer items-center justify-between gap-2 py-6'>
     <div className={type === 'mobile' ? 'flex size-10 items-center justify-center rounded-full bg-gray-200' : 'flex  size-10 items-center justify-center rounded-full bg-gray-200 max-xl:hidden'}>
        <p className='text-xl font-bold text-gray-700'>
            {user?.firstName[0]}
        </p>
     </div>
     <div className={type === "mobile"? 'flex flex-col justify-center': 'flex flex-1 flex-col justify-center max-xl:hidden'}>
        <h1 className='text-14 truncate font-normal capitalize text-gray-800'>{user.firstName} {user.lastName}</h1>
        <p className='text-xs truncate font-normal text-gray-600'> {user.email}</p>
     </div>
     <div className='relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center'>
        <Image src={"/icons/logout.svg"} alt="logout" fill className='cursor-pointer'
        onClick={handleLogOut}
        />
     </div>
    </footer>
  )
}

export default Footer
