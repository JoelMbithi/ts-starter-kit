import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavbarItems from './NavbarItems'

const navbar = () => {
  return (
    <div className='navbar '>
      <Link href={"/"}>
      <div className='flex items-center gap-2 cursor-pointer'>
        <Image
          src={"/images/logo.svg"}
          height={46}
          width={46}
          alt='logo'
        />
      </div>
      </Link>

      <div className='flex items-center gap-8'>
        <NavbarItems/>
        <p>Sign In</p>
      </div>
    </div>
  )
}

export default navbar
