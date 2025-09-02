"use client"
import { CarCardProps } from '@/types'
import { calculateCarRent, generateCarImageUrl } from '@/utils'
import Image from 'next/image'
import React, { useState } from 'react'
import CustomButton from '../Custom/CustomButton'
import CarDetails from './CarDetails'

interface CarProps {
        car:CarCardProps
    }
   
const CarCard = ({car} : CarProps) => {
    const {city_mpg,year,make,model,transmission,drive,cylinders} = car
    const carRent = calculateCarRent(city_mpg,year)
    

    const [isOpen,setIsOpen] = useState(false)
  return (
    <div  className='flex flex-col p-6 justify-center items-start text-black-100 ring-1 ring-gray-400  hover:bg-white hover:shadow-md rounded'>
     <div className='w-full flex justify-between items-start gap-2'>
        <h2 className='text-[22px] leading-[26px] font-bold capitalize'>
            {make} {model}
        </h2>
     </div>
     <p className='flex mt-6 text-[32px] font-extrabold'>
        <span className='self-start text-[14px] font-semibold'>
           $
        </span>
         {carRent}
         <span className='self-end text-[14px] font-semibold'>
           /day
        </span>
     </p>

     <div className='relative w-full h-40 my-3 object-container'>
        <Image src={generateCarImageUrl(car)} alt="car mode"
        fill priority className='object-contain'
        />
     </div>

     <div className='relative group flex w-full mt-2'>
        <div className='flex group-hover:invisible w-full justify-between text-gray'>
            <div className='flex flex-col justify-center items-center gap-2'>
                <Image src="/steering-wheel.svg" width={20} height={20} alt='steering wheel'/>
                <p className='text-[14px]'>
                    {transmission === 'a' ? 'Automatic' : 'Manual'}
                </p>
            </div>
             <div className='flex flex-col justify-center items-center gap-2'>
                <Image src="/tire.svg" width={20} height={20} alt='tire'/>
                <p className='text-[14px]'>
                    {drive.toUpperCase()}
                </p>
            </div>
             <div className='flex flex-col justify-center items-center gap-2'>
                <Image src="/gas.svg" width={20} height={20} alt='gas'/>
                <p className='text-[14px]'>
                    {cylinders}MPG
                </p>
            </div>
        </div>

        <div className='hidden group-hover:flex absolute bottom-0 w-full z-10'>
            <CustomButton 
            title="View More"
            containerStyles='w-full py-[16px] rounded-full bg-blue-600'
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon='/right-arrow.svg'
            handleClick={() => setIsOpen(true)}
            />
        </div>
     </div>

     <CarDetails isOpen={isOpen} closeModal={()=> setIsOpen(false)} car={car}/>
    </div>
  )
}

export default CarCard
