"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomButton from "../Custom/CustomButton";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixe top-0 h- z-10 transition-colors duration-300 ${
        scrolled ? " shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1440px] h-12 mx-auto flex justify-between items-center sm:px-16 px-6 py-2">
        {/* Logo */}
        <Link href={"/"} className="flex justify-center items-center">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={118}
            height={18}
            className="object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div
          className={`hidden md:flex gap-8 font-medium ${
            scrolled ? "text-black" : "text-gray-700"
          }`}
        >
        
        </div>

        {/* CTA Button */}
        <CustomButton
          title="Sign In"
          btnType="button"
          containerStyles={`rounded-full p-2 min-w-[130px] ring-1 ring-blue-600  text-blue-600 hover:text-white hover:bg-blue-600`}
        />
      </nav>
    </header>
  );
};

export default Navbar;
