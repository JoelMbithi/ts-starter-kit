"use client"
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCount = ({amount} : {amount:number}) => {
  return (
    <div className='w-full'>
     <CountUp
      decimals={2}
        decimal="."
        prefix="Ksh "
      end={amount}/>
    </div>
  )
}

export default AnimatedCount
