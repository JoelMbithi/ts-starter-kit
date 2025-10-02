import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

interface ButtonCustomProps {
  className?: string
  isLoading: boolean
  children: React.ReactNode
}

function ButtonCustom({ className, isLoading, children }: ButtonCustomProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? 'w-full bg-green-500 text-white'}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={20}
            height={20}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export default ButtonCustom
