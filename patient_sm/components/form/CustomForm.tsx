"use client"

import React from 'react'
import type { CountryCode, E164Number } from 'libphonenumber-js'

import {

  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import  { FormFieldType} from "../form/PatientForm"
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


interface CustomFormProps {
    control: any,
    formField:FormFieldType,
    name:string,
    label?:string,
    placeholder?:string,
    iconSrc?: string
    iconAlt?: string
}

const RenderField = ({props,field}: { field: any, props:CustomFormProps}) => {
  const {control, formField,name,label,placeholder,iconSrc,iconAlt} = props
   switch (formField) {
    case FormFieldType.INPUT:
      return(
        <div className='flex rounded-md ring-1 ring-gray-700 bg-black'>
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || 'icon'}
              className='ml-2'
            />
          )}
          <FormControl>
           <Input
              placeholder={placeholder}
              {...field}
            className="bg-black placeholder:text-dark-600 border-0 border-dark-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"


           />
         </FormControl>
        </div>
      )

       case FormFieldType.PASSWORD:
      return(
        <div className='flex rounded-md ring-1 ring-gray-700 bg-black'>
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || 'icon'}
              className='ml-2'
            />
          )}
          <FormControl>
           <Input
           type='password'
              placeholder={placeholder}
              {...field}
            className="bg-black placeholder:text-dark-600 border-0 border-dark-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"


           />
         </FormControl>
        </div>
      )
      case FormFieldType.PHONE_INPUT:
        return(
         <div className="flex rounded-md ring-1 ring-gray-700 bg-black">
  <FormControl>
    <PhoneInput
      defaultCountry={"KE" as CountryCode}
      placeholder={placeholder}
      international
      withCountryCallingCode
      value={field.value as E164Number | undefined}
      onChange={field.onChange}
      className="w-full p-2"
    />
  </FormControl>
</div>

        )
   
    default:
      break;
   }
}

const CustomForm = (props : CustomFormProps) => {
    const {control, formField,name,label,placeholder,iconSrc} = props
  return (
     <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className='flex-1'>
              {formField !== FormFieldType.CHECKBOX && label && (
                <FormLabel > {label}</FormLabel>
              )}
              <RenderField field={field} props={props}
             
              />

              <FormMessage className='text-red-500 text-sm'/>
            </FormItem>
          )}
        />
  )
}

export default CustomForm
