
import { prisma } from "../../lib/prisma";
import { getAccountsProps, getTransactionsProps } from "@/types";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";




export const getAccounts = async ({ userId }: getAccountsProps) => {
    try {
        //get the user linked bank accounts from DB
        const banks = await prisma?.bank.findMany({
           where: { userId},
        })
        if (!banks || banks.length === 0) {
            throw new Error ("No linked Bank found for this User")
        }

        // for each bank fetch accounts details from plaid
        const accountsPromises = banks.map(async (bank)=> {
            const response = await plaidClient.accountsGet({
                access_token: bank.accessToken,
            })

            return response.data.accounts.map((accountData) => ({
                id: accountData.account_id,
                availableBalance: accountData.balances.available!,
                currentBalance: accountData.balances.current!,
                
                name: accountData.name,
                officialName: accountData.official_name,
                mask: accountData.mask!,
                type: accountData.type as string,
                subtype: accountData.subtype! as string,
                appwriteItemId: bank.id,
                sharaebleId: bank.shareableId,
            }))
        })

        // flatten all accounts into a single array
        const accountsNested = await Promise.all(accountsPromises)
        const accounts = accountsNested.flat()
        return accounts
    } catch (error) {
        console.error("getAccounts error",error)
    }
}


export const getAccount = async ({ userId }: getAccountsProps) => {
    try {
        
        //fetch bank 
        const bank = await prisma.bank.findUnique({ where : {id: userId}})

        if(!bank) {
            throw new Error("Bank Account not found")

        }

        // fetch account from plaid
        const response = await plaidClient.accountsGet({ access_token: bank.accessToken });

       const accountDataArray = response.data.accounts.map((account) => ({
  // Bank fields
  accountId: account.account_id,
  bankId: bank.id,
  accessToken: bank.accessToken,
  fundingSourceUrl: "",
  userId: bank.userId,
  shareableId: bank.shareableId ?? "",

  // Account fields
  id: account.account_id,
  availableBalance: account.balances.available ?? 0,
  currentBalance: account.balances.current ?? 0,
  name: account.name,
  officialName: account.official_name ?? "",
  mask: account.mask ?? "",
  type: account.type as string,
  subtype: account.subtype ?? "",
  institutionId: response.data.item.institution_id ?? "",
  transactions: "", // if needed
}));


        return accountDataArray;

        


    } catch (error) {
        console.error("An error occurred while getting the account:", error);
    }
}


export const getTransactions =  async ({ accessToken}: getTransactionsProps) => {
    let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
        
    } catch (error) {
         console.error("An error occurred while getting the accounts:", error);
    }
}