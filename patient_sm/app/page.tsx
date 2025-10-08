import PasskeyModel from "@/components/admin/PasskeyModel";
import PatientForm from "@/components/form/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const isAdmin = params.admin === 'true';

  
  return (
   <div className="flex h-screen w-full max-h-screen">
    { isAdmin && <PasskeyModel />}
     <section className="remove-scrollbar flex items-center w-full  justify-center my-auto ">
      <div className="flex w-120 flex-col px-10 "> 
        <Image src="/assets/icons/logo-full.svg" alt="logo"
          className="mb-12 h-10 w-fit"
          height={1000}
          width={1000}
        />
        <PatientForm />

        <div className="text-14-regular mt-20 flex  justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
            &copy; 2025 CarePulse
          </p>
          <Link href={'/?admin=true' } className="text-green-500">Admin</Link>
        </div>
      </div>
     </section>
     <Image
      src="/assets/images/onboarding-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="hidden md:flex side-img max-w-[50%]"
     />
   </div>
  );
}
