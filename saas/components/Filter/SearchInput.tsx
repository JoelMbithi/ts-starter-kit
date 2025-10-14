"use client"
import { Value } from '@radix-ui/react-select'
import { Key } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const SearchInput = () => {
    const pathname= usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('topic')

    const [searchQuery,setSearchQuery] = useState('')
    
 //  Update URL when user types a search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
            // Skip running on initial render (no change)
    if (searchQuery === query) return

    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("topic", searchQuery)
    } else {
        // remove topic if search box is empty
      params.delete("topic") 
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },100)
  
  }, [searchQuery, router, pathname])

  return (
    <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1  h-fit'>
      <Image
        src="/icons/search.svg" 
        alt="search"
        height={15}
        width={15}

      />
      <input type="text" placeholder='Search Topic'
       className='outline-none text-black'
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
