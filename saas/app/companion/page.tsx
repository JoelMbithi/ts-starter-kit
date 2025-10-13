import CompanionCard from "@/components/Companion/CompanionCard";
import SearchInput from "@/components/Filter/SearchInput";
import SubjectFilter from "@/components/Filter/SubjectFilter";
import { subjectsColors } from "@/constants";
import { GetAllCompanions } from "@/lib/actions/companion.action";
import React from "react";

// Define SearchParams interface
interface SearchParams {
  subject?: string | string[];
  topic?: string | string[];
}

// Define props interface that includes searchParams
interface SearchParamsProps {
  searchParams: Promise<SearchParams>;
}

const Companion = async ({ searchParams }: SearchParamsProps) => {
  const filters = (await searchParams) ?? {};
  const subject = filters.subject ?? "";
  const topic = filters.topic ?? "";

  const companions = await GetAllCompanions({ subject, topic });
  console.log(companions)

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1 className="text-2xl font-bold">Companion Library</h1>
        <div className="flex gap-4 text-gray-500">
          <SearchInput/>
          <SubjectFilter/>
        </div>
      </section>

      <section className="companions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={
              subjectsColors[
                companion.subject.toLowerCase() as keyof typeof subjectsColors
              ] || "#D1D5DB" 
            }
          />
          
        ))}
      </section>
    </main>
  );
};

export default Companion;
