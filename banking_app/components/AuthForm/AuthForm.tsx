"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { signIn, signUp } from "@/lib/actions/user.actions"

//  Schema
const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signUpSchema = signInSchema.extend({
  FirstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
  LastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
  Address: z.string().min(3, { message: "Address must be at least 3 characters" }),
  City: z.string().min(3, { message: "City must be at least 3 characters" }),
  Gender: z.string().min(3, { message: "Gender is required" }),
  Code: z.string().min(3, { message: "Postal code must be at least 3 characters" }),
  Date: z.string().min(3, { message: "Date of Birth is required" }),
})

type AuthFormProps = {
  type: "sign-in" | "sign-up"
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof signUpSchema | typeof signInSchema>>({
    resolver: zodResolver(type === "sign-in" ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      FirstName: "",
      LastName: "",
      Address: "",
      City: "",
      Gender: "",
      Code: "",
      Date: "",
    },
  })

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      if (type === "sign-in") {
        const user = await signIn({ email: values.email, password: values.password })
        if (user) router.push("/")
      } else {
        const newUser = await signUp(values)
        if (newUser) router.push("/sign-in")
      }
    } catch (err) {
      console.error("Auth error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen w-full max-w-[520px] flex-col justify-center gap-6 px-6 py-10">
      {/* Header */}
      <header className="flex flex-col gap-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icons/logo.svg" alt="logo" width={34} height={34} />
          <h1 className="text-lg font-bold text-black">Summit Bank</h1>
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h2>
          <p className="text-gray-600">
            {type === "sign-in" ? "Please enter your details" : "Fill in your information to create an account"}
          </p>
        </div>
      </header>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {type === "sign-up" && (
            <>
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="Enter first name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="LastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Enter last name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City */}
              <FormField
                control={form.control}
                name="City"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input placeholder="Enter city" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address & Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="Address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="Enter address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl><Input placeholder="12345" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="Gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl><Input placeholder="Enter gender" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" placeholder="Enter password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit" className="bg-blue-500 w-full text-white hover:bg-blue-400" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Please wait...
              </span>
            ) : type === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <footer className="flex justify-center gap-1 text-sm">
        <p className="text-gray-600">
          {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          className="text-blue-500 hover:underline"
        >
          {type === "sign-in" ? "Sign Up" : "Login"}
        </Link>
      </footer>
    </section>
  )
}
