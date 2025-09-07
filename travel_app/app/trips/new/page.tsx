"use client"
import { createTrip } from "@/app/app/actions/create-trip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";


export default function NewTrip() {
    const [isPending, startTransition] = useTransition()
    const [imageUrl,setImageUrl] = useState<string | null>(null)
    return (
        <div className="max-w-lg mx-auto mt-10">
            <Card>
                <CardHeader>
                    New Trip
                </CardHeader>
                <CardContent>
                 <form action={(formData: FormData) => {
                    if (imageUrl) {
                        formData.append("imageUrl", imageUrl)
                    }
                    startTransition(() => {
                      createTrip(formData)
                    })
                 }}
                    
                    className="space-y-6">
                    <div className="">
                        <label  className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input 
                        type="text"
                        name="title"
                        placeholder="caribean trip..."
                        className={cn("w-full ring-1 ring-slate-400 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        )}
                        />
                    </div>
                     <div className="">
                        <label  className="block text-sm font-medium text-gray-700 mb-1">
                           Description
                        </label>
                        <textarea
                      
                        name="description"
                        placeholder="Trip description..."
                        className={cn("w-full ring-1 ring-slate-400 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        )}
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="">
                        <label  className="block text-sm font-medium text-gray-700 mb-1">
                           Start Date
                        </label>
                        <input 
                        type="date"
                        name="startDate"
                       
                        className={cn("w-full ring-1 ring-slate-400 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        )}
                        />
                    </div>
                    <div className="">
                        <label  className="block text-sm font-medium text-gray-700 mb-1">
                           EndDate
                        </label>
                        <input 
                        type="date"
                        name="endDate"
                       
                        className={cn("w-full ring-1 ring-slate-400 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        )}
                        />
                    </div>
                     </div>

                         <div>
                            <label htmlFor=""> Trip Image</label>

                            {imageUrl && (
                                <Image
                                 src={imageUrl}
                                  alt="trip Preview" 
                                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                                  height={100}
                                  width={300}
                                  />
                                  
                            )}
                        
                     <UploadButton
                     endpoint={"imageUploader"}
                     onClientUploadComplete={(res) => {
                        if (res && res[0].ufsUrl) {
                           setImageUrl(res[0].ufsUrl)
                        }
                     }}

                     onUploadError={(error) => {
                        console.log("Upload Error: ", error)
                     }}
                     />
                        </div>
                     <Button
                     type="submit"
                     className="w-full"
                   
                     >
                        {isPending ?"Create..." : "Create Trip"}
                     </Button>
                 </form>
                </CardContent>
            </Card>
        </div>
    )
}