"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReactTable, flexRender, getCoreRowModel } from "@tanstack/react-table";

import { DataTable } from "../Table/datatable";
import { Student, studentColumns } from "@/pages/Students/column";
import { usePage } from "@inertiajs/react";

interface StudentTableProps {
  students: Student[];
}

interface PageProps {
  students: Student[]; // matches column interface
  totalStudents: number;
}
const StudentTable = ({ students }: StudentTableProps) => {
   console.log("StudentTable props:", students);
  
    console.log('Dashboard props:', students);
  const table = useReactTable({
    data: students,
    columns: studentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Students</h2>
        <p className="text-sm text-gray-500">Overview of enrolled students</p>
      </div>

      <div className="overflow-x-auto">
          <DataTable columns={studentColumns} data={students} />
      </div>
    </div>
  );
};

export default StudentTable;
