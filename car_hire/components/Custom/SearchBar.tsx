"use client"
import React, { useState } from 'react'
import SearchManufacturer from './SearchManufacturer'
import Image from 'next/image'
import {  useRouter } from 'next/navigation'
import { FiSearch } from "react-icons/fi";


const SearchBar = () => {
    const [manufacturer,setManufacturer] = useState('')
    const [model,setModel] = useState('')

    const SearchButton = ({otherClasses} :{otherClasses : string}) => (
      <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
        <FiSearch className='text-xl'/>  
      </button>

     
    )
   const router = useRouter()
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (manufacturer === "" && model === "") {
        return alert("Please fill the search bar")
      }
      updateSearchParams(model.toLowerCase(), manufacturer.toLowerCase())
    }

    

    const updateSearchParams = (model: string, manufacture:string) => {
      const searchParams = new URLSearchParams(window.location.search)
       
      if  (model) {
        searchParams.set('model',model)
      } else{
        searchParams.delete('model',model)
      }

      if  (manufacturer) {
        searchParams.set('manufacturer',manufacturer)
      } else{
        searchParams.delete('manufacturer',manufacturer)
      }

      const newPathname = `${window.location.pathname}?${searchParams.toString()}`

      router.push(newPathname)
    }

  return (
   <form className=' flex items-center justify-start max-sm:flex-col  w-full relative max-sm:gap-4 max-w-3xl'>
    <div className='flex-1 max-sm:w-full flex justify-start items-center relative'>
        <SearchManufacturer
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
        />

        <SearchButton otherClasses="sm:hidden ml-2"/>
    </div>

     <div className=' flex-1 max-sm:w-full flex justify-start items-center relative'>
      <Image src="/model-icon.png"
      width={25}
      height={25}
      className='absolute w-[20px] h-[20px] ml-4'
      alt='car model'
      />

      <input 
       type="text"
       name="model"
       value={model}
       onChange={(e) => setModel(e.target.value)}
       placeholder='Select model...'    
       className=' w-full h-[30px] ml-2 ring-1 ring-gray-400 pl-12 p-2 bg-light-white rounded max-sm:rounded outline-none cursor-pointer text-sm' 
       
     />
     <SearchButton  otherClasses=' sm:hidden ml-2'/>
     </div>
       <SearchButton otherClasses=' max-sm:hidden ml-2'/>
   </form>
  )
}

export default SearchBar
