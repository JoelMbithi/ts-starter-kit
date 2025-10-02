"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { json, z } from "zod"
import { Button } from "@/components/ui/button"
import { Form} from "@/components/ui/form"
import CustomForm from "./CustomForm"
import ButtonCustom from "../ButtonCustom"
import { useState } from "react"
import { useRouter } from "next/navigation"



export enum FormFieldType {
   INPUT= 'input',
   TEXTaREA = 'textarea',
   PHONE_INPUT = "phoneInput",
   CHECKBOX = "checkbox",
   DATE_PICKER=" datePicker",
   SELECT = "select",
   SKELETON= "skeleton",
   PASSWORD="password"
}
 
const formSchema = z.object({
   name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email:z.string().email("Invalid email address"),
  phone:z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid Phone number'),
  password:z.string().min(6,{   message: "password must be at least 6 characters.",}),
})
 
const PatientForm =() => {
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      phone:"",
      password:"",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name,email,phone,password}: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
       const response = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, phone, password }),
});

        
        const user = await response.json()

       if (user && user.user && user.user.id) {
  router.push(`/patients/${user.user.id}/register`);
}
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
            <h1 className="text-xl font-bold text-white "> Hi there 👋</h1>
            <p className="text-sm font-gray-700">Schedule your first appointment.</p>
        </section>

         <CustomForm 
        control={form.control}
        formField={FormFieldType.INPUT}
        name="name"
        placeholder="Enter your fullname"
        label= "FullName"
        iconSrc="/assets/icons/user.svg"
        />
        <CustomForm 
        control={form.control}
        formField={FormFieldType.INPUT}
        name="email"
        placeholder="Enter your email"
        label= "Email"
        iconSrc="/assets/icons/email.svg"
        />
         <CustomForm 
        control={form.control}
        formField={FormFieldType.PASSWORD}
        name="password"
        placeholder="Enter your password"
        label= "Password"
     
        />
        <CustomForm 
        control={form.control}
        formField={FormFieldType.PHONE_INPUT}
        name="phone"
        placeholder="Enter your phoneNumber"
        label= "Phone Number"
      
        />
       <ButtonCustom  isLoading={isLoading} >
        Get Started
       </ButtonCustom>
      </form>
    </Form>
  )
}

export default PatientForm
