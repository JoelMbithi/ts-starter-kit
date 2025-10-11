'use client'
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"


const Cta = ({ id }: { id: string }) => {
  const [loading,setLoading] = useState(false)
  return (
    <section className="cta-section">
     <div className="cta-badge">Start learning your way.</div>
<h2 className="text-3xl font-bold">
  Build and Personalize Your Learning Companion
</h2>
<p className="text-xs">
  Pick a subject that interests you, customize your study plan, and track your
  progress with smart, interactive tools designed to help you stay focused and
  achieve your goals faster.
</p>
<Image
src={"/images/cta.svg"}
alt="cta"
height={232}
width={362}
/>

<button className="btn-primary">
  <Image
  src={"/icons/plus.svg"}
  alt="plus"
  width={12}
  height={12}
  />
  <Link  href="/companion/newCompanion">
{loading ? (
  <div className="flex items-center gap-2">
    <Loader2 className="animate-spin" />
    <span>Loading...</span>
  </div>
) : (
  <p>Build a New Companion</p>
)}

  </Link>
</button>
    </section>
  )
}

export default Cta
