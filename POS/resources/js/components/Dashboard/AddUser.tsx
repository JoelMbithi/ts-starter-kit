"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { router } from "@inertiajs/react"


const formSchema = z
  .object({
    fullname: z.string().min(2, { message: "Invalid name." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
    role: z.string(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must match." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

const AddUser = () => {
  const [loading, setLoading] = useState(false)
     const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      role: "1", // default role = Admin
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      console.log("Submitting user:", values) 
      const response = await axios.post("/users", {
        fullname: values.fullname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
        password: values.password,
      })

      console.log("User Created:", response.data)
      alert("User Created Successfully!")
      form.reset() 
     setIsOpen(false)
      router.visit("/users")
    } catch (error: any) {
      console.error("Failed to create user:", error.response?.data || error.message)
      alert(`Failed to create user: ${error.response?.data?.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-slate-900 text-white rounded font-medium shadow hover:ring-1 hover:bg-white hover:text-black hover:ring-slate-400">
            Create User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-lg font-semibold text-gray-800">
              Create A New User
            </DialogTitle>
            <DialogDescription className="text-gray-500 mb-6">
              Fill in the details below to add a new user to the system.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center flex-row gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center flex-row gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm w-50"
                        >
                          <option value="1">Admin</option>
                          <option value="2">Cashier</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save User"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddUser
