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
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'


interface CustomFormProps {
    control: any,
    formField:FormFieldType,
    name:string,
    label?:string,
    placeholder?:string,
    iconSrc?: string
    iconAlt?: string
      children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    disabled?: boolean
}

const RenderField = ({props,field}: { field: any, props:CustomFormProps}) => {
  const {control, formField,name,label,placeholder,iconSrc,iconAlt, renderSkeleton} = props
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
      case FormFieldType.TEXTaREA:
      return(
        <div className='flex rounded-md ring-1 ring-gray-700 bg-black'>
        
          <FormControl>
           <Textarea
              placeholder={placeholder}
              {...field}
            className="bg-black placeholder:text-dark-600 border-0 border-dark-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"

             disabled={props.disabled}
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
      case FormFieldType.DATE_PICKER:
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
           type='date'
              placeholder={placeholder}
              {...field}
            className="bg-black placeholder:text-dark-600 border-0 border-dark-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"


           />
         </FormControl>
        </div>
      )
      case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton (field) : null

      case FormFieldType.PHONE_INPUT:
        return (
         <div className="flex rounded-md ring-1 ring-gray-700 bg-black">
  <FormControl>
    <PhoneInput
      defaultCountry={"KE" as CountryCode}
      placeholder={placeholder}
      international
      withCountryCallingCode
      value={field.value as E164Number | undefined}
      onChange={field.onChange}
      className="p-1 "
    />
  </FormControl>
</div>

        )

        case FormFieldType.CHECKBOX:
          return (
             <FormControl>
            <div className='flex items-center gap-4'>
              <Checkbox 
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              />
              <Label
              htmlFor='props.name'
              className=' cursor-pointer text-sm font-medium text-dark-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none'

              >
                {props.label}
              </Label>
            </div>
          </FormControl>
          )
         

     case FormFieldType.SELECT:
  return (
    
    <FormControl>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger className='bg-dark-400 placeholder:text-dark-600 border-dark-500 h-11 focus:ring-0 focus:ring-offset-0'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className=' ring-1 ring-gray-900 h-80 bg-black '>
          {props.children}
        </SelectContent>
      </Select>
    </FormControl>
  );

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
