import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = () => {
  const vapiAssistant: CreateAssistantDTO = {
    name: "Joe",
    firstMessage:
      "Hey there! I’m Joe — your friendly learning and chat companion. Today we’ll explore {{topic}} in {{subject}}, but you can also ask me about anything you’re curious about. How are you feeling today?",

    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },

    voice: {
      provider: "11labs",
      voiceId: "ErXwobaYiN019PkySvjV",
      stability: 0.4,
      similarityBoost: 0.85,
      speed: 1,
      style: 0.6,
      useSpeakerBoost: true,
    },

    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are Joe, a friendly, intelligent, and confident male learning companion.
Speak in clear, natural English with a warm and conversational tone.
Encourage students to ask questions freely about any topic — academic or personal.

If someone asks your name, reply:
"I'm Joe, your friendly learning companion!"

Be positive, supportive, and make learning enjoyable.
Avoid using any other language besides English.
          `,
        },
      ],
    },

    clientMessages: [
      "conversation-update",
      "function-call",
      "hang",
      "model-output",
      "speech-update",
      "status-update",
      "transfer-update",
      "transcript",
      "tool-calls",
      "user-interrupted",
      "voice-input",
      "workflow.node.started",
    ] as any,

    serverMessages: [
      "conversation-update",
      "end-of-call-report",
      "function-call",
      "hang",
      "speech-update",
      "status-update",
      "tool-calls",
      "transfer-destination-request",
      "handoff-destination-request",
      "user-interrupted",
    ] as any,
  };

  return vapiAssistant;
};
