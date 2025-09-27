"use client"
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Footer from '../Footer/Footer'
import { MobileNavProps } from '@/types'

const MobileNav = ({user}: MobileNavProps) => {
    const pathname = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
    <Sheet>
  <SheetTrigger>
    <Image src="/icons/hamburger.svg" alt="menu" width={30} height={30} className='cursor-pointer'/>
  </SheetTrigger>
  <SheetContent className='bg-white border-none p-4' side="left">
    <Link href={"/"} className=' flex cursor-pointer items-center gap-4 '>
        <Image src="/icons/logo.svg"
        alt='logo'
        width={34}
        height={34}
        className='flex size-[24px] max-xl:size-14'
        />
        <h1 className=' 2xl:text-26 font-ibm-plex-serif text-10  font-bold text-black max-xl:hidden'>Summit Bank</h1>
   </Link>

      <div className='flex gap-3 items-center p-4 rounded-lg w-full max-w-60 '>
        <SheetClose asChild>
              <nav className='flex h-full flex-col gap-2'>
                  {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
          return (
            <Link href={item.route}
            key={item.label}
            className={cn("flex gap-3 w-full items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start",{
              "bg-blue-500": isActive
            })}
            >
             <div className='relative size-6'>
              <Image src={item.imgURL} 
              alt={item.label}
              fill
              className={cn({"brightness-[3] invert-0": isActive})}
              />
             </div>
             <p className={cn(" text-sm font-semibold text-black",{"text-white": isActive})}>
              {item.label}
             </p>
            </Link>
          )
        })}
        
              </nav>
        </SheetClose>
        <Footer user={user}  type='mobile'/>
      </div>

       
  </SheetContent>
</Sheet>
    </section>
  )
}

export default MobileNav
