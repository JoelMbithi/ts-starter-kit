import CompanionCard from "@/components/Companion/CompanionCard";
import CompanionList from "@/components/Companion/CompanionList";
import Cta from "@/components/Companion/Cta";
import { Button } from "@/components/ui/button";
import { recentSessions, subjectsColors } from "@/constants";
import { GetAllCompanions, getRecentSessions } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";
import React from "react";

const page = async () => {
  const companions = await GetAllCompanions({ limit: 3})
  const recentSessionsCompanions = await getRecentSessions( 10)
/* 
   const subjectKey = companions.subject?.toLowerCase() as keyof typeof subjectsColors;
    const backgroundColor =
      subjectsColors[subjectKey] || companions.color || "#E5E7EB";
   style={{ backgroundColor }} */
  return (
    <main className="px-4 py-4">
      <h1 className="text-2xl font-bold">Popular Sessions</h1>

      <section className="home-section">
        {companions.map((companion) => (
          <CompanionCard
           key={companion.id}
           {...companion}
           color={getSubjectColor(companion.subject)}
         
        />

        ))}
       
      </section>

      <section className="home-section">
        <CompanionList 
        title="Recent completed sessions"
        companions={recentSessionsCompanions}
        classNames="w-2/3 max-lg:w-full"
        name={recentSessions}
       
        />
        <Cta />
      </section>
    </main>
  );
};

export default page;
