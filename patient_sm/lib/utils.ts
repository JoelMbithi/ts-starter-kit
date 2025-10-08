import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Deep clone helper
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

// Convert file to object URL
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

/**
 * ✅ FORMAT DATE TIME
 * Correctly formats DB date + time without UTC shift.
 * Supports "10:00 AM" or "14:30" time formats.
 */
export const formatDateTime = (dateString: string, timeString?: string) => {
  if (!dateString) return { dateTime: "", dateOnly: "", timeOnly: "" };

  // Extract date components
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);

  let hours = 0;
  let minutes = 0;

  // Parse time string
  if (timeString) {
    const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);

      const period = match[3]?.toUpperCase();
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    }
  }

  // ✅ Construct date/time in LOCAL TIME (no UTC)
  const exactDateTime = new Date(year, month - 1, day, hours, minutes);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return {
    dateTime: exactDateTime.toLocaleString("en-US", options),
    dateOnly: exactDateTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeOnly: exactDateTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
};

/**
 * Simple Base64 encryption/decryption
 */
export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
