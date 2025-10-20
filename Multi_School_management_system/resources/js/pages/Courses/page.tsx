import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import SearchComponent from '../../components/Search/SearchComponent';
import { DataTable } from '../../components/Table/datatable';
import { useState } from 'react';
import { courseColumns } from './column';

interface Enrollment {
  id: number;
  student: { id: number; name: string };
}

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  enrollments_count: number;
  enrollments: Enrollment[];
}

interface PageProps {
  courses: Course[];
  totalCourses: number;
  totalEnrollments: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Courses', href: '/courses', icon: GraduationCap },
];

export default function CoursesPage() {
  const { courses, totalCourses, totalEnrollments } = usePage<PageProps>().props;
  const [results, setResults] = useState<Course[]>([]);

  const handleResults = (searchResults: Course[]) => setResults(searchResults);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Courses" />

      <div className="flex flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <SummaryCard value={totalCourses} label="Total Courses" color="text-blue-500" />
          <SummaryCard value={totalEnrollments} label="Total Enrollments" color="text-yellow-500" />
          <SummaryCard value={Math.floor(totalEnrollments / totalCourses || 0)} label="Avg Enrollments/Course" color="text-green-500" />
        </div>

        {/* Courses Table */}
        {/* Courses Table */}
<div className="border rounded-xl p-4">
<SearchComponent resource="courses" onResults={handleResults} />

  <DataTable
    columns={courseColumns}
    data={results.length ? results : courses}
  />
</div>

      </div>
    </AppLayout>
  );
}

const SummaryCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex aspect-video flex-col items-center justify-center border rounded-xl">
    <h2 className={`py-4 text-5xl font-bold ${color}`}>{value}</h2>
    <p className="text-xl font-medium">{label}</p>
  </div>
);
