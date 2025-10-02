"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CustomForm from "./CustomForm"
import ButtonCustom from "../ButtonCustom"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { GenderOptions } from "@/constants"

interface RegisterFormProps {
  user?: RegistionProps; // optional
}

// ✅ validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(
    (phone) => /^\+\d{10,15}$/.test(phone),
    "Invalid Phone number"
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  birthDate: z.date().optional(),
  gender: z.string().optional(),
})

const RegisterForm = ({ user }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      birthDate: undefined,
      gender: "",
    },
  })

  // 2. Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const user = await response.json()
      if (user && user.user && user.user.id) {
        router.push(`/patients/${user.user.id}/register`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        {/* Header */}
        <section className="mb-8 space-y-4">
          <h1 className="text-xl font-bold text-white">Welcome 👋</h1>
          <p className="text-sm text-gray-400">Let us know more about yourself.</p>
        </section>

        {/* Section: Personal Info */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="text-xl font-bold">Personal Information</h2>
          </div>
        </section>

        {/* Full name */}
        <CustomForm
          control={form.control}
          formField={FormFieldType.INPUT}
          name="name"
          placeholder="Enter your fullname"
          label="Full Name"
          iconSrc="/assets/icons/user.svg"
        />

        {/* Email + Date of Birth */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="email"
            placeholder="Enter your email"
            label="Email"
            iconSrc="/assets/icons/email.svg"
          />

          <CustomForm
            control={form.control}
            formField={FormFieldType.DATE_PICKER}
            name="birthDate"
            placeholder="Select your birth date"
            label="Date of Birth"
          />
        </div>

        {/* Phone */}
        <CustomForm
          control={form.control}
          formField={FormFieldType.PHONE_INPUT}
          name="phone"
          placeholder="Enter your phone"
          label="Phone Number"
        />

        {/* Gender + Confirm Email */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            control={form.control}
            formField={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex gap-4"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div
                      key={option}
                      className="flex flex-1 items-center gap-2 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3"
                    >
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className="h-4 w-4 border rounded-full border-gray-400 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <Label className="cursor-pointer text-white" htmlFor={option}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          
        </div>
   
        <div className="flex flex-col gap-6 xl:flex-row">
             <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="address"
            placeholder="Nairobi"
            label="Address"
           
          />
           <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="occupation"
            placeholder="Software Engineering"
            label="Occupation"
          
          />
         
        </div>


        <div className="flex flex-col gap-6 xl:flex-row">
           <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="emergencyContactName"
            placeholder="Gudian's name"
            label="Emergency Name"
          
          />
           <div className="w-50">
            <CustomForm
          control={form.control}
          formField={FormFieldType.PHONE_INPUT}
          name="emergencyContactNumber"
          placeholder="Enter your phone"
          label="Emergency Contact Number"
        />
           </div>
        </div>

        {/* Submit Button */}
        <ButtonCustom isLoading={isLoading}>
          Get Started
        </ButtonCustom>
      </form>
    </Form>
  )
}

export default RegisterForm
