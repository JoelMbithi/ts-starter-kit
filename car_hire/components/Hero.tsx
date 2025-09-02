"use client"
import React from 'react'
import Image from 'next/image'
import CustomButton from './Custom/CustomButton'

const Hero = () => {
    const handleScroll = () => {

    }
  return (
    <div className='flex xl:flex-row flex-col gap-5 px-10 py-8 relative z-0 max-w-[1440px] mx-auto'>
      <div className='flex-1 pt-36 padding-x'>
        <h1 className='2xl:text-[72px] sm:text-[64px] text-[50px] font-extrabold'>Find,book, or rent a car - quickly and easy!</h1>

        <p className=' text-[27px] text-gray-600 font-light mt-5'>Streamline your car rental experience with our effortless booking process.</p>

        <CustomButton
          title="Explore Cars"
          containerStyles="bg-blue-700 text-white rounded-full mt-10"
            handleClick={() => {}}
         />
      </div>
        
        <div className='xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen'>
            <div className='relative xl:w-full w-[90%] h-[500px] z-0'>
                <Image
                    src="/hero.png"
                    alt="hero"
                    width={700}
                    height={700}
                    className='object-contain'
                /> </div>
                <div
  className="absolute xl:-top-15 xl:-right-1/2 -right-1/4 
             bg-blue-700 bg-repeat-round -z-10 w-full 
             xl:h-screen h-[590px] overflow-hidden mr-30 
             animate-wave pentagon-shape"
/>

           
        </div>
      </div>
    
  )
}

export default Hero
