"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CourseTable = () => {
  // Later, replace with real data from Laravel props
  const courses = [
    { id: 1, name: "Mathematics", teacher: "Jane Doe", duration: "3 Months" },
    { id: 2, name: "English", teacher: "John Smith", duration: "4 Months" },
    { id: 3, name: "Biology", teacher: "Mary Ann", duration: "2 Months" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Courses</h2>
        <p className="text-sm text-gray-500">Overview of available courses</p>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[150px] font-semibold text-gray-700">
                Course Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Teacher
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                className="hover:bg-gray-50 transition-all"
              >
                <TableCell className="font-medium text-gray-800">
                  {course.name}
                </TableCell>
                <TableCell>{course.teacher}</TableCell>
                <TableCell>{course.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
