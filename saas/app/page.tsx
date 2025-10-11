import CompanionCard from "@/components/Companion/CompanionCard";
import CompanionList from "@/components/Companion/CompanionList";
import Cta from "@/components/Companion/Cta";
import { Button } from "@/components/ui/button";
import { recentSessions } from "@/constants";
import React from "react";

const page = () => {
  return (
    <main className="px-4 py-4">
      <h1 className="text-2xl font-bold">Popular Companions</h1>

      <section className="home-section">
        <CompanionCard
          id="101"
          name="Frontend Fundamentals"
          topic="React, Next.js, Tailwind CSS"
          subject="Frontend Development"
          duration= {40}
          test="test"
          color="bg-blue-500"
        />

        <CompanionCard
          id="102"
          name="Backend Essentials"
          topic="Node.js, Express, PostgreSQL"
          subject="Backend Development"
          duration= {50}
          test="test"
          color="bg-green-500"
        />

        <CompanionCard
          id="103"
          name="API Mastery"
          topic="REST, GraphQL, Authentication"
          subject="API & Integration"
          duration= {30}
          test="test"
          color="bg-yellow-500"
         
        />
      </section>

      <section className="home-section">
        <CompanionList 
        title="Recent completed sessions"
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full"
        name={recentSessions}
        />
        <Cta />
      </section>
    </main>
  );
};

export default page;
