import React from 'react'

const page = ({type="title", title,subtext,user}: HeaderBoxProps) => {
  return (
    <div className='flex flex-col gap-2 '>
     <h1 className='text-24 lg:text-30 font-semibold text-gray-900 '>
      {title}
      {type ==="greeting" && (
        <span className='text-blue-500'>&nbsp;{user}</span>
      )}
     </h1>
     <p className='text-sm text-slate-600'>{subtext}</p>
    </div>
  )
}

export default page
