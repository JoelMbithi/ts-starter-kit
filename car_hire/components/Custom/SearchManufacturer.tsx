"use client"
import React, { useState, Fragment } from 'react'
import { SearchManufacturerProps } from '@/types'
import { Combobox, ComboboxOptions, Transition } from '@headlessui/react'
import { manufacturers } from '@/constants'
import Image from 'next/image'


const SearchManufacturer = ({manufacturer, setManufacturer} : SearchManufacturerProps) => {
    
    const [query,setQuery] = useState('')
    const filteredManufacturers = query === ""
    ? manufacturers  
    : manufacturers.filter((item) => (
        item.toLocaleLowerCase()
        .replace(/\s+/g,"")
        .includes(query.toLowerCase()
        .replace(/\s+/g,""))
    ))
  return (
    <div className='flex-1 max-sm:w-full flex justify-start items-center'>
      <Combobox  value={manufacturer} onChange={setManufacturer} >
        <div className='relative flex  ring-1 ring-gray-400 rounded items-center w-full'>
            
            <Combobox.Button className= "absolute top=[14px]"

            >
              <Image src="/car-logo.svg" 
              width={20}
              height={20}
              className='ml-4'
              alt='car Logo' 
              />
              </Combobox.Button>

             <div className='flex flex-col '>
                 <Combobox.Input className="w-full h-[30px]  pl-12 p-4 rounded-l-full max-sm:rounded-full bg-light-white outline-none cursor-pointer text-sm" 
                placeholder='Search manufacturer... '
                displayValue = {(manufacturer: string) => manufacturer}
                onChange = {(e) => setQuery(e.target.value)}
            />

            
           <Transition
  as={Fragment}
  leave="transition ease-in duration-100"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
  afterLeave={() => setQuery("")}
>
  <Combobox.Options
    className="absolute mt-10 max-h-60 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none sm:text-sm z-10"
  >
    {
      filteredManufacturers.map((items) => (
        <Combobox.Option
          key={items}
          value={items}
          className={({ active }) =>
            `relative cursor-default select-none py-2 pl-10 pr-4 ${
              active ? "bg-blue-600 text-white" : "text-gray-900"
            }`
          }

        >
          {({ selected, active}) => (
             <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {items}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            
                          </span>
                        ) : null}
                      </>
      )}
        </Combobox.Option>
      )
    )}
  </Combobox.Options>
</Transition>

             </div>

        </div>
      </Combobox>
    </div>
  )
}

export default SearchManufacturer
