"use client";

import React, { useEffect, useState } from "react";
import HeaderBox from "../../components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/Sidebar/RightSidebar";

const Home = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1248.57}
          />
        </header>
        <h1>RECENT TRANSACTIONS</h1>
      </div>

     <RightSidebar
  user={user}   // ✅ add this
  transactions={[]}
  banks={[
    {
      $id: "1",
      accountId: "1",
      bankId: "1",
      accessToken: "",
      fundingSourceUrl: "",
      userId: "",
      sharableId: "",
      currentBalance: 7583.635,
      id: "1",
      availableBalance: 7583.635,
      officialName: "Bank1",
      mask: "****",
      institutionId: "",
      name: "Bank1",
      type: "depository",
      subtype: "checking",
      appwriteItemId: "1",
    },
    {
      $id: "2",
      accountId: "2",
      bankId: "2",
      accessToken: "",
      fundingSourceUrl: "",
      userId: "",
      sharableId: "",
      currentBalance: 253.635,
      id: "2",
      availableBalance: 253.635,
      officialName: "Bank2",
      mask: "****",
      institutionId: "",
      name: "Bank2",
      type: "depository",
      subtype: "checking",
      appwriteItemId: "2",
    },
  ]}
/>

    </div>
  );
};

export default Home;
