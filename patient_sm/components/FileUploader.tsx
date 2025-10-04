"use client"

import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type FileUploaderProps ={
    file: File[] | undefined
    onChange: (file: File[]) => void
}

const FileUploader = ({file,onChange}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles : File []) => {
     onChange(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className='text-12-regular flex cursor-pointer  flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dark-500 bg-dark-400 p-5' {...getRootProps()}>
      <input {...getInputProps()} />
      {  file && file?.length > 0 ? (
        <Image
        src={convertFileToUrl(file[0])}
        width={1000}
        height={1000}
        alt='uploaded image'
        className='mav-h-[400px] overflow-hidden object-cover'
        />
      ): (
        <>
        <Image
        src={"/assets/icons/upload.svg"}
        alt='upload'
        width={40}
        height={40}
        />
        <div className=' flex flex-col justify-center gap-2 text-center text-gray-500'>
            <p className='text-14-regular'>
                <span className='text-green-500'> Click to upload</span> or drag and drop
            </p>
        </div>
        </>
      )}
       
    </div>
  )
}

export default FileUploader