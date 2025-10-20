"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TeacherTable = () => {
  // Later, you can replace this with real data from Laravel props
  const teachers = [
    { id: 1, name: "Joel Mbithi", subject: "Mathematics", method: "Full-Time" },
    { id: 2, name: "Jane Smith", subject: "English", method: "Part-Time" },
    { id: 3, name: "Mary Ann", subject: "Science", method: "Full-Time" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Teachers</h2>
        <p className="text-sm text-gray-500">Overview of all teaching staff</p>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[150px] font-semibold text-gray-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Subject
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Method
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.map((teacher) => (
              <TableRow
                key={teacher.id}
                className="hover:bg-gray-50 transition-all"
              >
                <TableCell className="font-medium text-gray-800">
                  {teacher.name}
                </TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>{teacher.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherTable;
