'use client'
import { subjectsColors } from '@/constants';
import { cn, configureAssistant } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import  { useEffect, useRef, useState } from 'react'
import sound from '../../constants/Sound.json'

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED= "FINISHED"
}
const CompanionAI = ({companionId,subject,topic,name,userName,userImage,style,voice}: CompanionAIProps) => {
    const [callStatus,setcallstatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking,setIsSpeaking] = useState(false)
   
    const subjectKey = subject?.toLowerCase() as keyof typeof subjectsColors;
      const backgroundColor =
        subjectsColors[subjectKey] || subject || "#E5E7EB";

          const lottieRef = useRef<LottieRefCurrentProps>(null);
          const [isMuted,setIsMuted] = useState(true)
         useEffect(() => {
          if(lottieRef) {
            if(isSpeaking){
              lottieRef.current?.play()

            }else{
              lottieRef.current?.stop()
            }
          }
         },[isSpeaking, lottieRef])

        useEffect(() => {
          const onCallStart = () => setcallstatus(CallStatus.ACTIVE)
          const onCallEnd = () => setcallstatus(CallStatus.FINISHED)
          const onMessage = () => {}

          const onSpeechStart = () => setIsSpeaking(true)
            const onSpeechEnd = () => setIsSpeaking(false)

          const onError = (error:Error)  => console.log('Error',error)

          vapi.on('call-start', onCallStart)
          vapi.on('call-end', onCallEnd)
          vapi.on('message', onMessage)
          vapi.on('error', onError)
          vapi.on('speech-start', onSpeechStart)
           vapi.on('speech-end', onSpeechEnd)

           return () => {

          vapi.off('call-start', onCallStart)
          vapi.off('call-end', onCallEnd)
          vapi.off('message', onMessage)
          vapi.off('error', onError)
          vapi.off('speech-start', onSpeechStart)
           vapi.off('speech-end', onSpeechEnd)
           }
        },[])
        const toggleMicrophone = () => {
          const isMuted = vapi.isMuted()
          vapi.setMuted(!isMuted)
          setIsMuted(!isMuted)
        }
        
        const handleCall = async () => {
              setcallstatus(CallStatus.CONNECTING)

            const assistantOverrides = {
  variableValues: { subject, topic, style }, 
  clientMessages: ['transcript'],
  serverMessages: [], 
};

              //@ts-expect-error
              vapi.start(configureAssistant(voice, style), assistantOverrides)
        }

        const handleDisconnect = () => {
                setcallstatus(CallStatus.FINISHED)
                vapi.stop()
        }
  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className='companion-section'>
            <div className='companion-avatar'  style={{ backgroundColor }} >
              <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001': 'opacity-0' ,callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse' )}>
                <Image
                  src={`/icons/${subject}.svg`}
                  alt={subject}
                  width={150}
                  height={150}
                  className='max-sm:w-fit'
                />
              </div>
              <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={sound}
                      autoplay={false}
                      className='companion-lottie'
                    />
              </div>
            </div>
            <p className='font-bold text-2xl'>{name}</p>
           
        </div> 
        <div className='user-section'>
           <div className='user-avatar'>
            <Image
            src={userImage}
            alt={userName}
            width={130}
            height={130}
            className='rounded-full'
    
            />
            <p>{userName}</p>
           </div>
           <button className='btn-mic' onClick={toggleMicrophone}>
            <Image
            src={isMuted ? '/icons/mic-off.svg' : 'icons/mic-on.svg'}
            alt='mic'
            width={36}
            height={36}
            />
            <p className='max-sm:hidden'>
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
              </button>
              <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse',
             )}
                onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                    {   callStatus === CallStatus.ACTIVE ? 'End Sessions' : callStatus === CallStatus.CONNECTING ?  'Connecting' : 'Start Session' }
              </button>
              </div>
      </section>

      <section className='transcript '>
        <div className='transcript-message no-scrollbar'>
          Message
        </div>
        <div className='transcript-fade'/>
      </section>
    </section>
  )
}

export default CompanionAI
