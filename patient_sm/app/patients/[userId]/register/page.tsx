"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Registion from "@/components/form/RegisterForm"; // Import the correct component
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserType = {
  id: string
  name: string
  email: string
  phone: string
}

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Get userId from params
      const userId = params.userId as string;
      
      console.log("🔄 Page: Fetching user with userId:", userId);
      
      // Validate userId
      if (!userId || userId === "undefined" || isNaN(Number(userId))) {
        console.error("❌ Page: Invalid userId:", userId);
        setError(`Invalid user ID. Please start over from the registration form.`);
        setLoading(false);
        return;
      }

      try {
        console.log("✅ Valid userId, fetching user data for ID:", userId);
        const res = await fetch(`/api/users?id=${userId}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Page: Failed to fetch user:", errorData.error);
          setError(errorData.error || "Failed to fetch user data");
          setLoading(false);
          return;
        }

        const userData = await res.json();
        console.log("✅ Page: User data fetched successfully:", userData);
        setUser(userData);
      } catch (error) {
        console.error("🔥 Page: Error fetching user:", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <section className="flex-1 overflow-y-auto px-10 py-12">
          <div className="flex flex-col w-full max-w-[480px]">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              className="mb-12 h-10 w-fit"
              height={1000}
              width={1000}
            />
            <div className="text-white">Loading patient information...</div>
          </div>
        </section>
        {/* Right Sticky Image */}
        <div className="hidden md:flex md:w-[690px] relative">
          <Image
            src="/assets/images/register-img.png"
            alt="patient"
            fill
            className="object-cover sticky top-0"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full">
        <section className="flex-1 overflow-y-auto px-10 py-12">
          <div className="flex flex-col w-full max-w-[480px]">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              className="mb-12 h-10 w-fit"
              height={1000}
              width={1000}
            />
            <div className="text-red-400 text-center">
              <h2 className="text-xl font-bold mb-4">Registration Error</h2>
              <p className="mb-6">{error}</p>
              <button 
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go Back to Registration
              </button>
            </div>
          </div>
        </section>
        {/* Right Sticky Image */}
        <div className="hidden md:flex md:w-[690px] relative">
          <Image
            src="/assets/images/register-img.png"
            alt="patient"
            fill
            className="object-cover sticky top-0"
          />
        </div>
      </div>
    );
  }

  // Return the full layout with the Registion component
  return (
    <div className="flex min-h-screen w-full">
      <section className="flex-1 overflow-y-auto px-10 py-12">
        <div className="flex flex-col w-full max-w-[480px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            className="mb-12 h-10 w-fit"
            height={1000}
            width={1000}
          />
          <Registion user={user} />
          <div className="mt-12 flex justify-between text-sm text-dark-600">
            <p>&copy; 2025 CarePulse</p>
          </div>
        </div>
      </section>

      {/* Right Sticky Image */}
      <div className="hidden md:flex md:w-[690px] relative">
        <Image
          src="/assets/images/register-img.png"
          alt="patient"
          fill
          className="object-cover sticky top-0"
        />
      </div>
    </div>
  );
}