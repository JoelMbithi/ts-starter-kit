"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import PlaidLink from "../plaid/PlaidLink"
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
import { signIn, signUp } from "@/lib/actions/auth.actions"

//  Schema
const signInSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signUpSchema = signInSchema.extend({
  firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
  lastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
  address: z.string().min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(3, { message: "City must be at least 3 characters" }),
  state: z.string().min(2, { message: "State is required (2-letter code)" }),
  code: z.string().min(3, { message: "Postal code must be at least 3 characters" }),
  date: z.string().min(3, { message: "Date of Birth is required" }),
  ssn: z.string().min(4, { message: "SSN (last 4 digits) is required" }),
  gender: z.string().min(3, { message: "Gender is required" }),
})

type AuthFormProps = {
  type: "sign-in" | "sign-up"
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const form = useForm<z.infer<typeof signUpSchema | typeof signInSchema>>({
    resolver: zodResolver(type === "sign-in" ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      code: "",
      date: "",
      ssn: "",
      gender: "",
    },
  })

 const onSubmit = async (values: any) => {
  setLoading(true);
  try {
    if (type === "sign-in") {
      const { user, token } = await signIn(values);

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
        setUser(user);
        router.push("/");
      }
    } else {
      // --- normalize/format fields required by Dwolla/backend ---
      // 1) Format DOB to YYYY-MM-DD
      let formattedDob = "";
      if (values.date) {
        const d = new Date(values.date);
        if (!isNaN(d.getTime())) {
          formattedDob = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
        }
      }

      // 2) Ensure state is uppercase 2-letter (best effort)
      const state = (values.state || "").toString().trim().toUpperCase().slice(0, 2);

      // 3) SSN: keep last 4 digits only (Dwolla sandbox expects last 4)
      const ssnRaw = (values.ssn || "").toString().replace(/\D/g, "");
      const ssn = ssnRaw.length >= 4 ? ssnRaw.slice(-4) : ssnRaw;

      // 4) Postal code normalization (pad/trim to 5 digits if you want)
      const postal = (values.code || "").toString().trim();

      // Build payload matching SignUpParams expected by your server
      const payload = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        address1: values.address,      // map form `address` -> address1
        city: values.city,
        state,                         // 2-letter
        postalCode: postal,
        dateOfBirth: formattedDob,     // YYYY-MM-DD
        ssn,                           // last 4 digits
      };

      // Optional: quick client-side validations
      if (!payload.dateOfBirth) {
        throw new Error("Please provide a valid date of birth.");
      }
      if (!state || state.length !== 2) {
        // Prefer to show friendly UI, but we throw here so server sees nothing invalid
        throw new Error("Please provide a valid 2-letter US state code (e.g. CA).");
      }
      if (!payload.postalCode) {
        throw new Error("Please provide a postal code.");
      }
      if (!payload.ssn || payload.ssn.length !== 4) {
        throw new Error("Please provide the last 4 digits of your SSN (sandbox only).");
      }

      // Call your server action with normalized payload
      const { user: createdUser, token } = await signUp(payload);

      if (token && createdUser) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(createdUser));
        setUser(createdUser);
        router.push("/");
      }
    }
  } catch (err) {
    console.error("Auth error:", err);
    // optionally show a toast or set form error
  } finally {
    setLoading(false);
  }
};



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

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary"/>
        </div>
      ): (
        <>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {type === "sign-up" && (
                <>
                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input placeholder="Enter first name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input placeholder="Enter last name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>

                  {/* Address, City, State & Postal Code */}
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="Enter address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input placeholder="Enter city" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                   <FormField control={form.control} name="state" render={({ field }) => (
  <FormItem>
    <FormLabel>State</FormLabel>
    <FormControl>
      <select
        {...field}
        className="w-full border rounded-md p-2"
        required
      >
        <option value="">Select State</option>
        <option value="AL">AL</option>
        <option value="AK">AK</option>
        <option value="AZ">AZ</option>
        <option value="AR">AR</option>
        <option value="CA">CA</option>
        <option value="CO">CO</option>
        <option value="CT">CT</option>
        <option value="DE">DE</option>
        <option value="FL">FL</option>
        <option value="GA">GA</option>
        <option value="HI">HI</option>
        <option value="ID">ID</option>
        <option value="IL">IL</option>
        <option value="IN">IN</option>
        <option value="IA">IA</option>
        <option value="KS">KS</option>
        <option value="KY">KY</option>
        <option value="LA">LA</option>
        <option value="ME">ME</option>
        <option value="MD">MD</option>
        <option value="MA">MA</option>
        <option value="MI">MI</option>
        <option value="MN">MN</option>
        <option value="MS">MS</option>
        <option value="MO">MO</option>
        <option value="MT">MT</option>
        <option value="NE">NE</option>
        <option value="NV">NV</option>
        <option value="NH">NH</option>
        <option value="NJ">NJ</option>
        <option value="NM">NM</option>
        <option value="NY">NY</option>
        <option value="NC">NC</option>
        <option value="ND">ND</option>
        <option value="OH">OH</option>
        <option value="OK">OK</option>
        <option value="OR">OR</option>
        <option value="PA">PA</option>
        <option value="RI">RI</option>
        <option value="SC">SC</option>
        <option value="SD">SD</option>
        <option value="TN">TN</option>
        <option value="TX">TX</option>
        <option value="UT">UT</option>
        <option value="VT">VT</option>
        <option value="VA">VA</option>
        <option value="WA">WA</option>
        <option value="WV">WV</option>
        <option value="WI">WI</option>
        <option value="WY">WY</option>
      </select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}/>

                    <FormField control={form.control} name="code" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl><Input placeholder="12345" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>

                  {/* Gender, DOB & SSN */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl><Input placeholder="Enter gender" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="ssn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>SSN (Last 4 digits)</FormLabel>
                        <FormControl><Input placeholder="1234" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </>
              )}

              {/* Email */}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>

              {/* Password */}
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Enter password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>

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
        </>
      )}

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
