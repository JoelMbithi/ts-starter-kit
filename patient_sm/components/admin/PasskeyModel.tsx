"use client"
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const PasskeyModel = () => {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [passKey, setPassKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const validatePassKey = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         /*  email: "joellembithi@gmail.com",  */
          passKey: passKey
        }),
      })

      const data = await response.json()

    if (!response.ok || !data.valid) {
 toast.error(data.message || "Invalid passkey.Please try again.");
 setOpen(true)
 
  throw new Error(data.message || "Invalid passkey. Please try again.");
}

      // Passkey correct
      setOpen(false)

      toast.success("Welcome Admin ");
      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error("Validation error:", err)
      setError(err.message || "Server error, please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const closeModel = () => {
    setOpen(false)
    router.push('/')
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='space-y-5 bg-black/50 border-gray-500 outline-none'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-start justify-between'>
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt='close'
              width={20}
              height={20}
              onClick={closeModel}
              className='cursor-pointer'
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP maxLength={6} value={passKey} onChange={(value) => setPassKey(value)}>
            <InputOTPGroup className='flex justify-between w-full'>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  className='text-3xl font-bold justify-center flex border border-gray-500 rounded-lg size-16 gap-4'
                  index={i}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={validatePassKey}
            disabled={loading || passKey.length !== 6}
          >
            {loading ? "Verifying..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PasskeyModel
