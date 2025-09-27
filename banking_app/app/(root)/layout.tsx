"use client";

import Image from "next/image";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileNav from "@/components/MobileNav/MobileNav";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [theme, setTheme] = useState("light");

  // Load user directly from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setLoggedIn(JSON.parse(storedUser));
    }
  }, []);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn || { firstName: "Guest", lastName: "", email: "" }} />

      <div className="flex flex-col flex-1">
        <div className="p-4 shadow flex items-center justify-between">
          <Image src={"/icons/logo.svg"} alt="logo" width={30} height={30} />
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <MobileNav user={loggedIn || { firstName: "Guest", lastName: "", email: "" }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}
