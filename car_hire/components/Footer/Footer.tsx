import React from 'react'
import Image from 'next/image'
import  { footerLinks } from '@/constants/index'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col text-black mt-5 border-t border-gray-100'>
      <div className='flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10'>
         <div className='flex flex-col flex-wrap justify-start items-start gap-6'>
             <Image src="/logo.svg" alt='logo'
             width={118}
             height={18}
             className='object-contain'/>
             <p className='text-base text-gray-700'>CarHub 2025 <br /> All rights reserved &copy;</p>
         </div>
        
        <div className='flex-1 w-full flex md:justify-end flex-wrap max-md:mt-10 gap-20'>
          {footerLinks.map((link,index) => (
            <div className='flex flex-col gap-6 text-base min-w-[170px]' key={index}>
              <h3 className='font-bold'>{link.title}</h3>
              {link.links.map((item) => (
                <Link key={item.title} href={item.url}
                className='text-gray-500' >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
           </div>

        <div className='flex flex-wrap justify-between items-center mt-10 border-t border-gray-100 sm:px-16 py-10 px-6'>
          <p>@2025 CarHub. All Rights Reserved</p>
           <div className='flex-1 flex sm:justify-end justify-center max-sm:mt-4 gap-8'>
            <Link href='/' className='text-gray-500'>
            Privacy Policy</Link>
             <Link href='/' className='text-gray-500'>
            Terms of Use</Link>
           </div>
        </div>
   
    </footer>
  )
}

export default Footer
