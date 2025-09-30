"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignUpParams, SignInParams } from "@/types";
import { prisma } from "@/lib/prisma";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import type { createBankAccountProps, exchangePublicTokenProps, User } from "@/types";
import { plaidClient } from "../plaid";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { revalidatePath as nextRevalidatePath } from "next/cache";
import crypto from "crypto";
import { createDwollaCustomer, addFundingSource } from "./dwolla.action";

const JWT_SECRET = process.env.JWT_SECRET!;

// Sign up
// lib/actions/auth.actions.ts
// lib/actions/auth.actions.ts (replace existing signUp)
const US_STATE_CODES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
]);

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  address1,
  city,
  state,
  postalCode,
  dateOfBirth,
  ssn,
}: SignUpParams) => {
  // Basic server-side validation & normalization
  // 1) Normalize/validate DOB
  if (!dateOfBirth) throw new Error("dateOfBirth is required.");
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD.");
  const formattedDob = dob.toISOString().split("T")[0]; // YYYY-MM-DD

  // 2) Age check >= 18
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 18) throw new Error("User must be at least 18 years old.");

  // 3) State: must be 2-letter US abbreviation
  if (!state) throw new Error("state is required (2-letter US code).");
  const stateUpper = state.toString().trim().toUpperCase().slice(0, 2);
  if (!US_STATE_CODES.has(stateUpper)) {
    throw new Error("Invalid state. Please provide a valid 2-letter US state code (e.g. CA).");
  }

  // 4) Postal code: basic 5-digit validation
  if (!postalCode) throw new Error("postalCode is required.");
  const zip = postalCode.toString().trim();
  if (!/^\d{5}$/.test(zip)) {
    throw new Error("Invalid postalCode. Please provide a 5-digit US ZIP code.");
  }

  // 5) SSN: keep last 4 digits (sandbox), verify digits
  if (!ssn) throw new Error("ssn (last 4 digits) is required for Dwolla sandbox.");
  const ssnDigits = ssn.toString().replace(/\D/g, "");
  const ssnLast4 = ssnDigits.length >= 4 ? ssnDigits.slice(-4) : "";
  if (ssnLast4.length !== 4) throw new Error("SSN must contain at least 4 digits (last 4).");

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  try {
    // Build payload for Dwolla
    const customerPayload = {
      firstName,
      lastName,
      email,
      type: "personal",
      address1: address1,
      city,
      state: stateUpper,
      postalCode: zip,
      dateOfBirth: formattedDob,
      ssn: ssnLast4,
    };

    // debug log (safe in dev) — remove or redact for production
    console.log("Dwolla customer payload:", customerPayload);

    const dwollaCustomerUrl = await createDwollaCustomer(customerPayload);

    if (!dwollaCustomerUrl) throw new Error("Dwolla returned no customer location");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Persist dwolla id (you can also add a dedicated column instead of metadata)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...(typeof user.metadata === "object" && user.metadata !== null
            ? user.metadata
            : {}),
          dwollaCustomerId,
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { user: { ...user, dwollaCustomerId }, token };
  } catch (err) {
    // rollback: delete the user to avoid orphaned records
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    console.error("Dwolla customer creation failed, user rolled back:", err);
    throw err; // bubble to caller so front-end can show error
  }
};

/* export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  address1,
  city,
  state,
  postalCode,
  dateOfBirth,
  ssn,
}: SignUpParams) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  try {
    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName,
  lastName,
  email,
  type: "personal",
  address1,
  city,
  state,
  postalCode,
  dateOfBirth, // "1990-01-01"
  ssn,         // 
    });

    if (!dwollaCustomerUrl) throw new Error("Dwolla returned no customer location");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Persist dwolla id (you can also add a dedicated column instead of metadata)
    await prisma.user.update({
  where: { id: user.id },
  data: {
    metadata: {
      ...(typeof user.metadata === "object" && user.metadata !== null
        ? user.metadata
        : {}),
      dwollaCustomerId,
    },
  },
});


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { user: { ...user, dwollaCustomerId }, token };
  } catch (err) {
    // rollback: delete the user to avoid orphaned records
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    console.error("Dwolla customer creation failed, user rolled back:", err);
    throw err; // bubble to caller so front-end can show error
  }
}; */



// Sign in
export const signIn = async ({ email, password }: SignInParams) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
};

// Get logged-in user
export const getLoggedInUser = async (token?: string) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error("getLoggedInUser error:", error);
    return null;
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
   shareableId,
}: createBankAccountProps) =>{
  try {
    const bank = await prisma.bank.create({
      data: {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    });
    return parseStringify(bank)
  } catch (error) {
    
  }
}

export const createLinkToken = async (user: User) => {
  if (!user || !user.id) throw new Error("Valid user with id is required");

  const tokenParams = {
    user: {
      client_user_id: String(user.id), // must be string
    },
    client_name: `${user.firstName} ${user.lastName}`, // combine names
    products: ["auth"] as Products[],
    country_codes: ["US"] as CountryCode[],
    language: "en",
  }

  try {
    const response = await plaidClient.linkTokenCreate(tokenParams)
    return parseStringify({ linkToken: response.data.link_token })
  } catch (err: any) {
    console.error("createLinkToken error:", err.response?.data || err.message)
    throw new Error("Failed to create Plaid link token")
  }
}



export const exchangePublicToken = async ({
  publicToken,
  user,
}:  exchangePublicTokenProps) => {
  
  try {
     const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
     })
      const accessToken = response.data.access_token
      const itemId = response.data.item_id

      const accountResponse = await plaidClient.accountsGet({
        access_token: accessToken,
       
      })
       const accountData = accountResponse.data.accounts[0]

       const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
       }

       const processorTokenResponse = await  plaidClient.processorTokenCreate(request)
       const processorToken = processorTokenResponse.data.processor_token
       // Assign a value to fundingSourceUrl (replace with actual logic as needed)
       const fundingSourceUrl =  await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName:accountData.name,
       })

       await createBankAccount({
        userId: user.id,
        bankId: itemId,
        accountId:accountData.account_id,
        accessToken,
        fundingSourceUrl: fundingSourceUrl ?? "", 
         shareableId: encryptId(accountData.account_id),
       })

       revalidatePath("/")

       return parseStringify({
        publicTokenExchange:"complete"
       })
  } catch (error) {
    console.error("exchangePublicToken error:", error);
  }
}
function revalidatePath(path: string) {
  return nextRevalidatePath(path);
}
function encryptId(account_id: string) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_key_32_bytes_long!"; // Must be 32 bytes
  const IV_LENGTH = 16;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(account_id, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

