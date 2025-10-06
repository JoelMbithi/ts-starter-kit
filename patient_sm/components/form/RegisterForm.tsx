"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CustomForm from "./CustomForm"
import ButtonCustom from "../ButtonCustom"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { GenderOptions } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

interface RegisterFormProps {
  user?: any // optional, existing patient
}

//  validation schema
const PatientFormValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid Phone number"),
  address: z.string().min(6, { message: "Address must be at least 6 characters." }),
  occupation: z.string(),
  emergencyContactName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  emergencyContactNumber: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid Phone number"),
  primaryPhysician: z.string(),
  insuranceProvider: z.string().min(3, { message: "At least 3 characters" }),
  insurancePolicyNumber: z.string().min(3, { message: "Insurance Policy Number must be at least 3 characters" }),
  allergies: z.string(),
  currentMedication: z.string(),
  familyMedicalHistory: z.string(),
  pastmedicalHistory: z.string(),
  identificationTypeId: z.string().min(1, { message: "Please select an ID type" }),
  identificationNumber: z.string(),
  identificationDocument: z.any(),
  birthDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Invalid date format (YYYY-MM-DD)",
  }),
  gender: z.string().optional(),
  treatementConsent: z.boolean(),
  disclosureConsent: z.boolean(),
  privacyConsent: z.boolean(),
})

const RegisterForm = ({ user }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [identification, setIdentification] = useState<IdentificationType[]>([])

  // 1. Define form
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      occupation: user?.occupation || "",
      emergencyContactName: user?.emergencyContactName || "",
      emergencyContactNumber: user?.emergencyContactNumber || "",
      primaryPhysician: user?.primaryPhysician || "",
      insuranceProvider: user?.insuranceProvider || "",
      insurancePolicyNumber: user?.insurancePolicyNumber || "",
      allergies: user?.allergies || "",
      currentMedication: user?.currentMedication || "",
      familyMedicalHistory: user?.familyMedicalHistory || "",
      pastmedicalHistory: user?.pastmedicalHistory || "",
      identificationTypeId: user?.identificationTypeId || "",
      identificationNumber: user?.identificationNumber || "",
      identificationDocument: user?.identificationDocument || "",
      birthDate: user?.birthDate || undefined,
      gender: user?.gender || "",
      treatementConsent: user?.treatementConsent || false,
      disclosureConsent: user?.disclosureConsent || false,
      privacyConsent: user?.privacyConsent || false,
    },
  })


// 2. Submit handler - FIXED VERSION
const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
  setIsLoading(true);

  try {
    const formData = new FormData();

    // Always include the user ID (it should be available from props)
    if (user?.id) {
      formData.append("userId", String(user.id));
    } else {
      throw new Error("User ID is required");
    }

    // Append all form values
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "identificationDocument" && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Convert and append date properly
    if (values.birthDate) {
      formData.append("birthDate", new Date(values.birthDate).toISOString());
    }

    // Handle file upload
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      formData.append("identificationDocument", values.identificationDocument[0]);
    }

    console.log(" Submitting patient form for user:", user.id);
    
    // FIX: Use the correct API endpoint with capital P
    const response = await fetch("/api/Patient", { // Capital P to match folder name
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(" Error creating patient:", errorText);
      throw new Error(`Failed to create patient: ${response.status}`);
    }

    const result = await response.json();
    console.log(" Patient created successfully:", result);

    // Redirect to appointment page with patient ID
 
if (result.patient?.id) {
  router.push(`/patients/${result.patient.id}/new-appointment`);
} else if (result.id) {
  router.push(`/patients/${result.id}/new-appointment`);
}

  } catch (error) {
    console.error(" Error submitting patient form:", error);
  } finally {
    setIsLoading(false);
  }
};

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/doctors")
      const data = await res.json()
      setDoctors(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch doctors", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchIdentification = async () => {
    try {
      const res = await fetch("/api/identification")
      const data: IdentificationType[] = await res.json()
      setIdentification(data)
    } catch (error) {
      console.error("Failed to fetch identification types", error)
    }
  }

  useEffect(() => {
    fetchDoctors()
    fetchIdentification()
  }, [])
// In RegisterForm component, add this useEffect to fetch user by email if needed
useEffect(() => {
  const fetchUserByEmail = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email && !user) {
      try {
        const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const userData = await res.json();
          // Set form values with user data
          form.reset(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user by email", error);
      }
    }
  };

  fetchUserByEmail();
}, [user, form]);
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
  <section className="space-y-6">
    <div className="mb-9 space-y-1">
      <h2 className="text-xl font-bold text-white"> Medical Information</h2>
    </div>
  </section>

  {/* select docctors */}
        <CustomForm
            control={form.control}
            formField={FormFieldType.SELECT}
            name="primaryPhysician"
            placeholder="Select a physician"
            label="Primary Physician"

          
          >
           {Array.isArray (doctors) && doctors.map((doc) => (
            <SelectItem key={doc.id} value={doc.name}>

            <div className="flex cursor-pointer items-center gap-2">
              <Image
              src={doc.image}
              width={32}
              height={32}
              alt={doc.name}
              className="roundedfull "
              />
              <p>{doc.name}</p>
            </div>
            </SelectItem>
           ))}
          </CustomForm>

          {/* insurance */}
           <div className="flex flex-col gap-6 xl:flex-row">
                <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="insuranceProvider"
            placeholder="ExpressAssuranceCover"
            label="Insurance Provider"
          
          />
           <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            placeholder="A8DU7G556"
            label="Insurance Policy Number"
          
          />
           </div>

           {/* allergies */}
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomForm
            control={form.control}
            formField={FormFieldType.TEXTaREA}
            name="allergies"
            placeholder="Pencillin"
            label="Allergies (if Yes)"
          
          />
           <CustomForm
            control={form.control}
            formField={FormFieldType.TEXTaREA}
            name="currentMedication"
            placeholder="Ibuprofen 500mg"
            label="Current Medication (if Yes)"
          
          />
           </div>
           {/* family medical history */}
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomForm
            control={form.control}
            formField={FormFieldType.TEXTaREA}
            name="familyMedicalHistory"
            placeholder="Type any kind of issue"
            label="Family Medical History"
          
          />
           <CustomForm
            control={form.control}
            formField={FormFieldType.TEXTaREA}
            name="pastmedicalHistory"
            placeholder="past Medical Issue"
            label="Past Medical History"
          
          />
           </div>
            <section className="space-y-6">
    <div className="mb-9 space-y-1">
      <h2 className="text-xl font-bold text-white"> Identification and Verification</h2>
    </div>
  </section>

 <CustomForm
  control={form.control}
  formField={FormFieldType.SELECT}
  name="identificationTypeId"
  placeholder="Select an identification Type"
  label="Identification Type"
>
  {identification.map((type) => (
    <SelectItem key={type.id} value={String(type.id)}>
      {type.name}
    </SelectItem>
  ))}
</CustomForm>

              
               <CustomForm
            control={form.control}
            formField={FormFieldType.INPUT}
            name="identificationNumber"
            placeholder="A8DU7G556"
            label="Identification Number"
          
          />

           <CustomForm
            control={form.control}
            formField={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scanned copy of identification document"
            renderSkeleton={(field) => (
              <FormControl>
              <FileUploader  file={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
          />

            <section className="space-y-6">
    <div className="mb-9 space-y-1">
      <h2 className="text-xl font-bold text-white"> Consent and Privacy</h2>
    </div>
  </section>

  <CustomForm
  formField={FormFieldType.CHECKBOX}
  control={form.control}
  name="treatementConsent"
  label="I consent to treatment for my health condtion"
  />
    <CustomForm
  formField={FormFieldType.CHECKBOX}
  control={form.control}
  name="disclosureConsent"
  label="I consent to the use and disclosure of my healthinformation for treatment purposes"
  />
    <CustomForm
  formField={FormFieldType.CHECKBOX}
  control={form.control}
  name="privacyConsent"
  label="I acknowledge that i have reviewed and agreed to the privacy policy"
  />
            
        {/* Submit Button */}
        <ButtonCustom isLoading={isLoading}>
          Get Started
        </ButtonCustom>
      </form>
    </Form>
  )
}

export default RegisterForm
