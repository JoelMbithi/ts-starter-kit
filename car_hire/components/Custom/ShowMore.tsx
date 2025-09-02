"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import CustomButton from './CustomButton'
import { showMoreProps } from '@/types'


const ShowMore = ({isNext, pageNumber}: showMoreProps) => {
  const router = useRouter()

  const handleNavigation = () => {}
  return (
    <div className='w-full flex-center gap-5 mt-10 '>
      {!isNext && (
        <CustomButton 
        title='Show More'
        btnType='button'
        containerStyles='bg-blue-600 rounded text-white'
        handleClick={handleNavigation}
        />
      )}
    </div>
  )
}

export default ShowMore
