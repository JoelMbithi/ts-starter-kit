import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components";



export const metadata: Metadata = {
  title: "Car Hire",
  description: "Discover your perfect ride with our car hire service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="relative"
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
