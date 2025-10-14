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

export const configureAssistant = (): CreateAssistantDTO => {
  const vapiAssistant: CreateAssistantDTO = {
    name: "Joe",
    firstMessage:
      "Hello, I’m Joe. I’m here to help you learn and grow. Today, we’ll be talking about {{topic}} in {{subject}}. You can also ask me anything else you’d like to understand better. How are you feeling right now?",

    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },

    voice: {
      provider: "11labs",
      voiceId: "ErXwobaYiN019PkySvjV", // replace if using another voice
      stability: 0.4,
      similarityBoost: 0.85,
      speed: 1.0,
      style: 0.5,
      useSpeakerBoost: true,
    },

    model: {
      provider: "openai",
          model: "gpt-4",
      temperature: 0.8, // makes it sound more natural
      messages: [
        {
          role: "system",
          content: `
You are Joe — a friendly, confident, and intelligent learning companion.
You speak naturally, like a helpful tutor and motivator.
Encourage curiosity and make every conversation supportive and engaging.

When someone asks your name, say:
"I'm Joe, your friendly learning companion!"

Avoid switching languages — only use clear English.
Use short, conversational responses rather than long paragraphs.
If you don’t know something, guide the user to learn it together.
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
