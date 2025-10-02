"use client";

import React, { useEffect, useState } from "react";
import HeaderBox from "../../components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/Sidebar/RightSidebar";
import { getAccount } from "@/lib/actions/bank.action";
import type { BankAccount } from "@/types";

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchAccounts = async () => {
      try {
        if (!parsedUser.bankId) return;

        // fetch account using Prisma bank ID
        const accountData = await getAccount({ userId: parsedUser.bankId });
        if (accountData) setAccounts([accountData]); // wrap single account in array
        console.log({accountData})
      } catch (err) {
        console.error("Failed to fetch account:", err);
      }
    };

    fetchAccounts(); 
  }, []);

  const totalBalance = accounts.reduce(
    (acc, curr) => acc + curr.currentBalance,
    0
  );

  return (
    <div className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accounts}
            totalBanks={accounts.length}
            totalCurrentBalance={totalBalance}
          />
        </header>
        <h1>RECENT TRANSACTIONS</h1>
      </div>

      <RightSidebar
        user={user}
        transactions={[]}
  banks={accounts} // Use fetched accounts
      />
    </div>
  );
};

export default Home;
