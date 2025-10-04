"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomForm from "./CustomForm";
import ButtonCustom from "../ButtonCustom";
import { useState } from "react";
import { useRouter } from "next/navigation";

export enum FormFieldType {
  INPUT = "input",
  TEXTaREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PASSWORD = "password",
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid Phone number"),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      console.log("🚀 Creating user:", data);
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // If user already exists (409), use the returned user data
        if (response.status === 409 && result.user) {
          console.log("✅ User exists, redirecting with ID:", result.user.id);
          router.push(`/patients/${result.user.id}/register`);
          return;
        }
        console.error("❌ API Error:", result.error);
        return;
      }

      // New user created - redirect with new user ID
      console.log("✅ New user created, redirecting with ID:", result.user.id);
      router.push(`/patients/${result.user.id}/register`);
    } catch (error) {
      console.error("🔥 Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="text-xl font-bold text-white">Hi there 👋</h1>
          <p className="text-sm text-gray-400">Schedule your first appointment.</p>
        </section>

        <CustomForm 
          control={form.control}
          formField={FormFieldType.INPUT}
          name="name"
          placeholder="Enter your fullname"
          label="Full Name"
          iconSrc="/assets/icons/user.svg"
        />
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
          formField={FormFieldType.PASSWORD}
          name="password"
          placeholder="Enter your password"
          label="Password"
        />
        <CustomForm 
          control={form.control}
          formField={FormFieldType.PHONE_INPUT}
          name="phone"
          placeholder="Enter your phoneNumber"
          label="Phone Number"
        />
        <ButtonCustom isLoading={isLoading}>
          Get Started
        </ButtonCustom>
      </form>
    </Form>
  );
}

export default PatientForm;