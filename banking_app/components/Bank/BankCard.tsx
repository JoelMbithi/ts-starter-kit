import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BankCard = ({accounts, userName,showBalance = true} : CreditCardProps) => {
  return (
    <div className='flex flex-col'>
      <Link href={"/"} className='relative flex h-[190px] w-[300px] justify-between rounded-[20px] border border-white bg-bank-gradient shadow-creditCard backdrop-blur-[6px]'>
        <div className='relative z-10 flex size-full w-[228px] flex-col justify-between rounded-l-[20px] bg-blue-500  px-5 pb-4 pt-5'>
           <div>
            <h1 className='text-16 text-white font-semibold'>
                {accounts?.name || userName}
            </h1>
            <p className='font-serif font-black text-white'>
                {formatAmount(accounts.currentBalance || 0)}
            </p>
           </div>

           <article className='flex flex-col gap-2'>
            <div className='flex justify-between'>
                <h1 className='text-12 font-semibold text-white'>
                    {userName || "Joe Mbithi"}
                </h1>
                 <h2 className='text-12 font-semibold text-white'>
                   ●● / ●●
                </h2>
            </div>
            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
               ●●●● ●●●● ●●●● <span className='text-12'>1234</span>
            </p>
           </article>
        </div>

        <div className='flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-blue-500 bg-cover bg-center bg-no-repeat py-5 pr-5'>
            <Image src="/icons/Paypass.svg" alt='pay' width={20} height={24}/>
             <Image src="/icons/mastercard.svg" alt='mastercard' width={45} height={32}/>
        </div>
         <Image src="/icons/lines.png" alt='line' width={316} height={190} className='absolute top-0 left-0'/>
      </Link>
    </div>
  )
}

export default BankCard
