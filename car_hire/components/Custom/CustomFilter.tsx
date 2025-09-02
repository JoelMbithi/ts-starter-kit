"use client"

import React, { Fragment, useState } from "react"
import { CustomFilterProps } from "@/types"
import { Listbox, Transition } from "@headlessui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { updateSearchParams } from "@/utils"
const CustomFilter = ({ title, options }: CustomFilterProps) => {
  const [selected, setSelected] = useState(options[0])
  const router = useRouter()

  const handleUpdateParams = (option: { title: string; value: string }) => {
    const newPathName = updateSearchParams(title, option.value.toLowerCase())
    router.push(newPathName)
  }

  return (
    <div className="w-fit">
      <Listbox value={selected} onChange={(e) =>{
       setSelected(e);
        handleUpdateParams(e);
      }}>
        <div className="relative w-fit z-10">
          {/* Button */}
          <Listbox.Button className="relative text-gray-600 w-full min-w-[127px] flex justify-between items-center cursor-default rounded-lg py-2 px-3 text-left shadow-md sm:text-sm border">
            <span>{selected.title}</span>
            <Image
              src="/chevron-up-down.svg"
              width={20}
              height={20}
              className="ml-4 object-contain"
              alt="chevron up down"
            />
          </Listbox.Button>

          {/* Dropdown Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.title}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-600"
                    }`
                  }
                >
                  {({ selected }) => (
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.title}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CustomFilter
