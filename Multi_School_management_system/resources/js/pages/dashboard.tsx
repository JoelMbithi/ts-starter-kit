import React from "react";
import { Head, usePage } from '@inertiajs/react';
import Graph from '@/components/Dashboard/Graph';
import TopEnrollment from '@/components/Dashboard/TopEnrollment';
import TopHeaders from '@/components/Dashboard/TopHeaders';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { DashboardStudent } from '@/components/Dashboard/dashboardStudentColumns';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
}

interface Course {
  course_id: number;
  name: string;
}

interface PageProps {
  students: DashboardStudent[];
  teachers: Teacher[];
  courses: Course[];
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
}

export default function Dashboard() {
  // Get props from Inertia with proper typing and defaults
 const pageProps = usePage<any>().props;

const students = pageProps.students ?? [];
const teachers = pageProps.teachers ?? [];
const courses = pageProps.courses ?? [];
const totalStudents = pageProps.totalStudents ?? 0;
const totalTeachers = pageProps.totalTeachers ?? 0;
const totalCourses = pageProps.totalCourses ?? 0;

console.log("Dashboard props:", students, teachers, courses);


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-gray-50 dark:bg-neutral-950">

        {/* === Top Statistic Cards === */}
        <TopHeaders
          totalStudents={totalStudents}
          totalTeachers={totalTeachers}
          totalCourses={totalCourses}
        />

        {/* === Middle Section: Analytics === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Enrollments */}
          <div className="relative min-h-[300px] rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 dark:border-sidebar-border shadow-sm">
            <TopEnrollment 
              students={students}
              teachers={teachers}
              courses={courses}
            />
          </div>

          {/* Analytics Graph */}
          <div className="relative min-h-[300px] rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 dark:border-sidebar-border shadow-sm">
            <Graph />
          </div>
        </div>

        {/* === Bottom Section: Placeholder for More Content === */}
        <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 md:min-h-min dark:border-sidebar-border">
          <h2 className="text-lg font-semibold p-4 text-gray-800 dark:text-gray-200">
            Announcements / Upcoming Events
          </h2>
        
        </div>
      </div>
    </AppLayout>
  );
}