"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
    {label:'Home', href:"/"},
     {label:'Lessons', href:"/companion"},
      {label:'My Journey', href:"/my-journey"}
]

const NavbarItems = () => {
    const pathname = usePathname()
  return (
    <div className="flex items-center gap-4">
      {navItems.map(({label,href}) => (
        <Link href={href} key={label} className={cn( pathname === href && 'text-primary font-bold')}>
            {label}
        </Link>
      ))}
    </div>
  )
}

export default NavbarItems
