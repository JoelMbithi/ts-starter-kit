"use server";

import { AddFundingSourceParams, CreateFundingSourceOptions, NewDwollaCustomerParams, TransferParams } from "@/types";
import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

// lib/actions/dwolla.action.ts

export const createDwollaCustomer = async (newCustomer: any) => {
  try {
    const customerPayload = {
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      type: "personal",
      address1: newCustomer.address1,
      city: newCustomer.city,
      state: newCustomer.state.toUpperCase().slice(0, 2), // ✅ enforce 2-letter abbreviation
      postalCode: newCustomer.postalCode,
      dateOfBirth: newCustomer.dateOfBirth, // formatted "YYYY-MM-DD"
      ssn: newCustomer.ssn, // if required
    };

    const res = await dwollaClient.post("customers", customerPayload);

    const location = res.headers.get("location");
    if (!location) throw new Error("No location header returned from Dwolla");

    return location;
  } catch (error: any) {
    console.error("Creating a Dwolla Customer Failed:", error);
    throw error;
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

export const reactivateCustomer = async (customerId: string) => {
  const DWOLLA_TOKEN = process.env.DWOLLA_ACCESS_TOKEN; // keep token in .env
  
  if (!DWOLLA_TOKEN) throw new Error("DWOLLA_ACCESS_TOKEN is missing");

  const payload = { status: "verified" };
const res = await fetch(`https://api-sandbox.dwolla.com/customers/${customerId}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${DWOLLA_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.dwolla.v1.hal+json", // Required!
  },
  body: JSON.stringify({ status: "verified" }),
});


  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));

  return data;
};
