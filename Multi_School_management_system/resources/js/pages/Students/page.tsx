"use client";

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import SearchComponent from '../../components/Search/SearchComponent';
import { DataTable } from '../../components/Table/datatable';
import { studentColumns, Student } from "./column";
import { useState } from 'react';

interface PageProps {
  students: Student[]; // matches column interface
  totalStudents: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Students',
    href: '/students',
    icon: GraduationCap,
  },
];

export default function Students() {
  // Local state for search results
  const [results, setResults] = useState<Student[]>([]);
  
  // Props from the server
  const { students = [], totalStudents = 0 } = usePage<PageProps>().props;

  // Form state (for adding/editing if needed)
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: "",
    last_name: "",
    class: "",
    age: "",
    
  });

  // Callback for SearchComponent
  const handleResults = (searchResults: Student[]) => {
    setResults(searchResults);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Students" />

      <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Dashboard Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="relative flex aspect-video justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <div className="flex flex-col items-center justify-center">
              <h2 className="py-4 text-6xl font-bold text-blue-500">{totalStudents}</h2>
              <p className="text-blue text-xl font-medium">Total Students</p>
            </div>
          </div>

          <div className="relative flex aspect-video justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <div className="flex flex-col items-center justify-center">
              <h2 className="py-4 text-6xl font-bold text-yellow-500">3</h2>
              <p className="text-yellow text-xl font-medium">On Leave</p>
            </div>
          </div>

          <div className="relative flex aspect-video justify-center overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <div className="flex flex-col items-center justify-center">
              <h2 className="py-4 text-6xl font-bold text-green-500">5</h2>
              <p className="text-green text-xl font-medium">Newly Enrolled</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="relative flex-1 min-h-[100vh] overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className='flex flex-col gap-2 px-2 py-4 w-full'>
            {/* Search */}
            <SearchComponent resource="students" onResults={handleResults} />

            {/* Table */}
            <DataTable
              columns={studentColumns}
              data={results.length ? results : students}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
