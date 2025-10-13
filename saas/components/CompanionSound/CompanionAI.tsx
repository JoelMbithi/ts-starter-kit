import { subjectsColors } from '@/constants';
import React, { useState } from 'react'


enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED= "FINISHED"
}
const CompanionAI = ({companionId,subject,topic,name,userName,userImage,style,voice}: CompanionAIProps) => {
    const [callStatus,setcallstatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const subjectKey = subject?.toLowerCase() as keyof typeof subjectsColors;
      const backgroundColor =
        subjectsColors[subjectKey] || subject || "#E5E7EB";
  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm;flex-col'>
        <div className='companion-section'>
            <div className='companion-avatar'  style={{ backgroundColor }} ></div>
        </div>
      </section>
    </section>
  )
}

export default CompanionAI
