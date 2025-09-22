import type { Metadata } from "next";
import { Geist, Geist_Mono,Inter,IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Weight } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: '--font-inter'})
const ibPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
    weight: ["400", "700"],
    variable:'--font-ibm-plex-serif'
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summit Bank",
  description: "Summit Bank is your partner in financial growth. From everyday payments to long-term savings, it provides clarity, control, and confidence.",
  icons:{
    icon:'/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${ibPlexSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
