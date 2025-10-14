'use client'
import { subjectsColors } from '@/constants';
import { cn, configureAssistant } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import  { useEffect, useRef, useState } from 'react'
import sound from '../../constants/Sound.json'
import { addToSessionHistory } from '@/lib/actions/companion.action';

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED= "FINISHED"
}
interface SavedMessage {
  role: string;
  content: string;
  type: 'transcript' | 'final';
}

const CompanionAI = ({companionId,subject,topic,name,userName,userImage,style,voice}: CompanionAIProps) => {
    const [callStatus,setcallstatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking,setIsSpeaking] = useState(false)
   
    const subjectKey = subject?.toLowerCase() as keyof typeof subjectsColors;
      const backgroundColor =
        subjectsColors[subjectKey] || subject || "#E5E7EB";

          const lottieRef = useRef<LottieRefCurrentProps>(null);
          const [isMuted,setIsMuted] = useState(true)
          const [messages,setMessages] = useState<SavedMessage[]>([])
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
          const onCallEnd = () => {
            setcallstatus(CallStatus.FINISHED)
             addToSessionHistory(companionId)
          }

       const onMessage = (message: any) => {
  if (message.type === 'transcript' && message.transcriptType === 'final') {
    setMessages((prev) => {
      if (prev.length > 0 && prev[0].role === (message.role || 'assistant')) {
        // Merge with last assistant message
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          content: `${updated[0].content} ${message.transcript || ''}`.trim(),
        };
        return updated;
      } else {
        // New message block
        const newMessage: SavedMessage = {
          role: message.role || 'assistant',
          content: message.transcript || '',
          type: 'final',
        };
        return [newMessage, ...prev];
      }
    });
  }
};



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
  if (!vapi || typeof vapi.isMuted !== "function") {
    console.warn("Vapi instance not ready");
    return;
  }

  const isMuted = vapi.isMuted();
  vapi.setMuted(!isMuted);
  setIsMuted(!isMuted);
};

        
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
    <section className="flex flex-col items-center justify-center min-h-[85vh] w-full p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-black"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 w-full max-w-6xl">
        
        {/* HEADER SECTION */}
       {/*  <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            AI Companion
          </h1>
          <p className="text-gray-300 text-lg">Chat with your personalized AI assistant</p>
        </div> */}

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* ASSISTANT SECTION */}
          <div className="flex flex-col items-center space-y-6 flex-1">
            {/* Animated Avatar Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div
                className={cn(
                  "relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm transition-all duration-500",
                  callStatus === CallStatus.ACTIVE && "ring-4 ring-green-400/50 animate-pulse"
                )}
                style={{ backgroundColor }}
              >
                {/* Static Icon */}
                <div
                  className={cn(
                    'absolute transition-all duration-700 transform',
                    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-90',
                    callStatus === CallStatus.CONNECTING && 'opacity-100 scale-100 animate-pulse'
                  )}
                >
                  <Image
                    src={`/icons/${subject}.svg`}
                    alt={subject}
                    width={140}
                    height={140}
                    className="max-sm:w-fit"
                  />
                </div>

                {/* Active Animation */}
                <div
                  className={cn(
                    'absolute transition-all duration-700 transform',
                    callStatus === CallStatus.ACTIVE ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  )}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={sound}
                    autoplay={false}
                    className="companion-lottie w-44"
                  />
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={cn(
                "absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all",
                callStatus === CallStatus.ACTIVE ? "bg-green-500/20 text-green-300 border-green-400/50" :
                callStatus === CallStatus.CONNECTING ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/50" :
                "bg-gray-500/20 text-gray-300 border-gray-400/50"
              )}>
                {callStatus === CallStatus.ACTIVE ? "● Live" : 
                 callStatus === CallStatus.CONNECTING ? "● Connecting" : 
                 "● Ready"}
              </div>
            </div>

            {/* Assistant Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="text-gray-400 capitalize">{subject} Assistant</p>
            </div>

            {/* Conversation Section */}
            <section className="w-full max-w-2xl mt-4 p-6 bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 overflow-y-auto h-[320px] flex flex-col space-y-4">
              <div className="transcript-message whitespace-pre-wrap text-gray-200 leading-relaxed space-y-4 flex-1">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                    <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center">
                      <Image src="/images/joe.jpeg" alt="Chat"  width={52} height={52} className="object-cover rounded-full" />
                    </div>
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm text-center">Click Start Session to begin talking with Joe about {name}</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    if (message.role === 'assistant') {
                      return (
                        <div
                          key={index}
                          className="flex justify-start w-full animate-fadeIn"
                        >
                          <div className="bg-blue-500/20 text-blue-200 px-5 py-3 rounded-2xl rounded-tl-none max-w-[85%] backdrop-blur-sm border border-blue-400/30">
                            <span className="font-semibold text-blue-300">
                              {name.split(' ')[0].replace(/[,.]/g, '')}:
                            </span>{' '}
                            <span className="text-gray-100">{message.content}</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="flex justify-end w-full animate-fadeIn"
                        >
                          <div className="bg-purple-500/20 text-purple-200 px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] backdrop-blur-sm border border-purple-400/30">
                            <span className="font-semibold text-purple-300">{userName}:</span>{' '}
                            <span className="text-gray-100">{message.content}</span>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </section>
          </div>

          {/* USER CONTROLS SECTION */}
          <div className="flex flex-col items-center space-y-6 flex-1 max-w-md">
            
            {/* User Profile */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-md opacity-75"></div>
                <Image
                  src={userImage}
                  alt={userName}
                  width={100}
                  height={100}
                  className="relative rounded-full border-4 border-white/20 shadow-xl backdrop-blur-sm"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">{userName}</h3>
            </div>

            {/* Control Buttons */}
            <div className="w-full space-y-4">
              {/* Microphone Button */}
              <button
                onClick={toggleMicrophone}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 shadow-lg font-semibold group",
                  isMuted 
                    ? "bg-red-500/10 text-red-300 border-red-400/30 hover:bg-red-500/20 hover:border-red-400/50" 
                    : "bg-green-500/10 text-green-300 border-green-400/30 hover:bg-green-500/20 hover:border-green-400/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isMuted ? "bg-red-500/20" : "bg-green-500/20"
                )}>
                  <Image
                    src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
                    alt="mic"
                    width={24}
                    height={24}
                    className={cn(
                      "transition-all duration-300",
                      !isMuted && "animate-pulse"
                    )}
                  />
                </div>
                <span className="max-sm:hidden">
                  {isMuted ? "Turn on microphone" : "Turn off microphone"}
                </span>
                <span className="sm:hidden">
                  {isMuted ? "Mic Off" : "Mic On"}
                </span>
              </button>

              {/* Main Action Button */}
              <button
                onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-2xl transform hover:scale-105 backdrop-blur-sm border",
                  callStatus === CallStatus.CONNECTING
                    ? "bg-yellow-500/20 border-yellow-400/50 animate-pulse hover:bg-yellow-500/30"
                    : callStatus === CallStatus.ACTIVE
                    ? "bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 hover:from-red-600 hover:to-pink-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/50 hover:from-blue-600 hover:to-purple-700"
                )}
              >
                <div className="flex items-center justify-center gap-3">
                  {callStatus === CallStatus.CONNECTING && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {callStatus === CallStatus.CONNECTING
                    ? "Connecting..."
                    : callStatus === CallStatus.ACTIVE
                    ? "End Session"
                    : "Start Session"}
                </div>
              </button>
            </div>

            {/* Status Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Connection:</span>
                <span className={cn(
                  "font-semibold",
                  callStatus === CallStatus.ACTIVE ? "text-green-400" :
                  callStatus === CallStatus.CONNECTING ? "text-yellow-400" :
                  "text-gray-400"
                )}>
                  {callStatus === CallStatus.ACTIVE ? "Connected" :
                   callStatus === CallStatus.CONNECTING ? "Establishing..." :
                   "Disconnected"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Audio:</span>
                <span className={isMuted ? "text-red-400" : "text-green-400"}>
                  {isMuted ? "Muted" : "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Assistant:</span>
                <span className="text-purple-400 font-semibold">{name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanionAI