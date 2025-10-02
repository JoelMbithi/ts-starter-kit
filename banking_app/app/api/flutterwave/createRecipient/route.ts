import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const { userId, email, firstName, lastName } = req.body

  try {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/beneficiaries",
      {
        account_number: "0123456789", // Placeholder, you can get this from user input
        account_bank: "KCB",          // Bank code
        currency: "KES",
        beneficiary_name: `${firstName} ${lastName}`,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    res.status(200).json({ recipient_code: response.data.data.recipient_code })
  } catch (err) {
    console.error("Flutterwave API error:", err)
    res.status(500).json({ error: "Failed to create recipient" })
  }
}
