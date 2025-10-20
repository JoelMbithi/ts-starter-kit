"use client";

import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { GraduationCap } from "lucide-react";
import SearchComponent from "@/components/Search/SearchComponent";
import { DataTable } from "@/components/Table/datatable";
import { enrollmentColumns, type Enrollment } from "./column";
import { useState } from "react";

// ---- PAGE PROPS INTERFACE ----
interface PageProps {
  enrollments: Enrollment[];
  totalEnrollments: number;
}

// ---- BREADCRUMBS ----
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Enrollments",
    href: "/enrollments",
    icon: GraduationCap,
  },
];

// ---- MAIN COMPONENT ----
export default function Enrollments() {
  const { enrollments, totalEnrollments } = usePage<PageProps>().props;
  const [results, setResults] = useState<Enrollment[]>([]);

  const handleResults = (searchResults: Enrollment[]) => {
    setResults(searchResults);
  };

  //  Ensure numeric value to fix NaN issue
  const safeTotal = Number(totalEnrollments) || 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Enrollments" />
      <div className="flex flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <SummaryCard
            value={safeTotal}
            label="Total Enrollments"
            color="text-blue-500"
          />
          <SummaryCard
            value={Math.floor(safeTotal / 3)}
            label="Active Courses"
            color="text-yellow-500"
          />
          <SummaryCard
            value={Math.floor(safeTotal / 5)}
            label="New This Month"
            color="text-green-500"
          />
        </div>

        {/* Enrollments Table */}
        <div className="border rounded-xl p-4">
          <SearchComponent resource="enrollment" onResults={handleResults} />
          <DataTable
            columns={enrollmentColumns}
            data={results.length ? results : enrollments}
          />
        </div>
      </div>
    </AppLayout>
  );
}

// ---- SUMMARY CARD COMPONENT ----
const SummaryCard = ({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) => (
  <div className="flex aspect-video flex-col items-center justify-center border rounded-xl">
    <h2 className={`py-4 text-5xl font-bold ${color}`}>{value}</h2>
    <p className="text-xl font-medium">{label}</p>
  </div>
);
