"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SubjectFilter = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("subject")

  // List of available subjects
  const subjects = ["coding", "math", "science", "english"]

  const [subject, setSubject] = useState(query || "")

  useEffect(() => {
    if (subject === query) return

    const params = new URLSearchParams(searchParams)

    if (subject) {
      params.set("subject", subject)
    } else {
      // remove subject if search box is empty
      params.delete("subject")
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [subject, router, pathname])

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All subjects</SelectItem>
        {subjects.map((subj) => (
          <SelectItem key={subj} value={subj} className="capitalize">
            {subj}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SubjectFilter
