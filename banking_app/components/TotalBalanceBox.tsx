"use client"

import React from 'react'

import AnimatedCount from './AnimatedCount'
import DoughnutChart from './DoughnutChart'

const TotalBalanceBox = ({accounts=[],totalBanks,totalCurrentBalance}: TotalBalanceBoxProps) => {
  return (
    <section className='flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6'>
        <div className='flex size-full max-w-[100px] items-center sm:max-w-[120px]'>
     <DoughnutChart accounts={accounts}/>
        </div>
      
      <div className='flex flex-col gap-4'>
        <h2 className='font-semibold '>Bank Accounts: {totalBanks}</h2>
     
        <div className='flex flex-col gap-1'>
            <p className='text-xs text-gray-600'>
            Total Current Balance
        </p>
        <h2 className='font-bold flex flex-center gap-2'>
            <AnimatedCount amount={totalCurrentBalance}/>
            </h2>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox
