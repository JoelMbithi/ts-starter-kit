import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface StatusProps {
    status: 'scheduled' | 'pending' | 'cancelled'
}

// Status icon mapping
const StatusIcon: Record<'scheduled' | 'pending' | 'cancelled', string> = {
  scheduled: "/assets/icons/appointments.svg",
  pending: '/assets/icons/pending.svg',
  cancelled: '/assets/icons/cancelled.svg',
}

const StatusBadge = ({status}: StatusProps) => {
  return (
    <div className={clsx('flex w-fit items-center gap-2 rounded-full px-4 py-2',{
        'bg-green-500': status === 'scheduled',
        'bg-blue-500': status === 'pending',
        'bg-red-500': status === 'cancelled'
    })}>

        <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className='h-fit w-3'
        />
      <p className={clsx('text-sm font-semibold capitalize',{
        'text-green-200': status === 'scheduled',
        'text-blue-200': status === 'pending',
        'text-red-500': status === 'cancelled'
      })}>{status}</p>
    </div>
  )
}

export default StatusBadge
