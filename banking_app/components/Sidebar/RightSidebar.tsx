import React from 'react'

const RightSidebar = ({user,transactions,banks}: RightSidebarProps) => {
  return (
    <aside className='hidden xl:flex flex-col h-screen max-h-screen w-[355px] border border-gray-200 xl:overflow-y-scroll'>
      <section className='flex flex-col pb-8'>
        <div className='h-[120px] w-full bg-red-600 bg-cover bg-no-repeat relative'>
          <div className='absolute top-20 left-6 flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 border-8 border-white shadow-xl'>
            <span className='text-5xl font-bold text-blue-500'>{user.firstName[0]}</span>
          </div>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar
