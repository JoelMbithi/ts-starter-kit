import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = Twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return message;
  } catch (err) {
    console.error("Twilio error:", err);
    throw err;
  }
}
