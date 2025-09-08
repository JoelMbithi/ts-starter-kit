// components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar(/* { session : { session : Session | null }} */) {
  const { data: session, status } = useSession();

  

  return (
    <nav className="bg-white shadow-md py-2 h-16 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        {/* Logo */}
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo3.png"} alt="logo" width={50} height={50} />
          <span className="text-2xl font-bold text-gray-800 ml-2">Planora</span>
        </Link>

        {/* Links + Auth */}
        <div className="flex items-center space-x-4">
            {session ? (
              <>
          <Link href={"/trips"} className="text-slate-600 hover:text-sky-500">
            My Trips
          </Link>
          <Link href={"/globe"} className="text-slate-600 hover:text-sky-500">
            Globe
          </Link>
     
           

          {/* Auth Button */}
        
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center ring-1 ring-black text-white bg-black hover:bg-white hover:text-black px-3 py-1 shadow-md rounded"
              >
                Sign Out
              </button>
            </div>    
             </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded"
            >
              Sign In
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="28"
                height="28"
                className="ml-2"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.02-4.91C33.64 4.04 29.2 2 24 2 14.82 2 6.93 7.58 3.69 15.28l6.41 4.98C11.44 14.6 17.2 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.59-.14-3.11-.4-4.5H24v8.52h12.7c-.55 2.96-2.23 5.47-4.75 7.16l7.26 5.64C43.83 37.88 46.5 31.74 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.1 20.26l-6.41-4.98C2.45 17.6 1.5 21.16 1.5 25c0 3.84.95 7.4 2.19 9.72l6.41-4.98C9.33 27.2 9 26.12 9 25s.33-2.2 1.1-4.74z"
                />
                <path
                  fill="#34A853"
                  d="M24 46c6.48 0 11.92-2.13 15.9-5.78l-7.26-5.64c-2.02 1.36-4.61 2.2-8.64 2.2-6.8 0-12.56-5.1-13.9-11.76l-6.41 4.98C6.93 40.42 14.82 46 24 46z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
