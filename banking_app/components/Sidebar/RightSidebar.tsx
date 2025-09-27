import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from '../Bank/BankCard'
import { RightSidebarProps } from '@/types'

const RightSidebar = ({user,transactions,banks}: RightSidebarProps) => {
  return (
    <aside className='hidden xl:flex gap-24 flex-col h-screen max-h-screen w-[372px] border border-gray-200 xl:overflow-y-scroll'>
      <section className='flex flex-col pb-8'>
        <div className='h-[120px] w-full bg-blue-600 bg-cover bg-no-repeat relative'>
          <div className='absolute top-20 left-6 flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-xl'>
            <span className='text-5xl font-bold text-blue-500'>{user?.firstName?.[0] || "G"}</span>
          </div>
          <div className='flex flex-col pt-50 pl-6'>
            <h1 className='text-24 font-semibold text-gray-900'>
              {user?.firstName || "Guest"} {user?.lastName || ""}
            </h1>
            <p className='text-sm text-gray-500'>{user?.email}</p>
          </div>
        </div>
      </section>

      <section className='flex flex-col px-6 py-8 justify-center gap-8'>
        <div className='flex w-full justify-between'>
          <h1 className='text-lg font-semibold'>My Banks</h1>
          <Link href="/" className='flex gap-2 items-center justify-center'>
          <Image src="/icons/plus.svg" alt="plus" width={16} height={16} className='' />
          <span className='text-sm font-medium text-gray-900'>Add Bank</span>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className='relative flex flex-1 flex-col items-center justify-center gap-5'>
            <div className='relative z-10'>
              <BankCard
                key={banks[0].$id}
                accounts={banks[0]}
                userName={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
                
              />
            </div>
            {banks[1] && (
              <div className='absolute right-0 top-8 z-0 w-[90%]'>
                <BankCard
                key={banks[1].$id}
                accounts={banks[1]}
                  userName={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
                
              /> 
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  )
}

export default RightSidebar
