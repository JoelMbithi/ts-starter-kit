"use client"

import React, { useState } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type FlutterwaveLinkProps = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  variant?: "primary" | "ghost"
}

const FlutterwaveLink = ({ user, variant = "primary" }: FlutterwaveLinkProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleConnectBank = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 1️⃣ Create a recipient (bank account) on backend
      const response = await axios.post("/api/flutterwave/createRecipient", {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })

      const { recipient_code } = response.data

      // 2️⃣ Redirect or confirm success
      console.log("Recipient created:", recipient_code)
      router.push("/") // redirect after bank is connected
    } catch (error) {
      console.error("Flutterwave bank connect error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={variant === "primary" ? "w-full bg-blue-500 text-white hover:bg-blue-600" : ""}
      onClick={handleConnectBank}
      disabled={loading}
    >
      {loading ? "Connecting..." : "Connect Bank"}
    </Button>
  )
}

export default FlutterwaveLink
