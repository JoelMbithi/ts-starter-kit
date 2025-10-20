"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { route } from "ziggy-js";
import { useForm } from "@inertiajs/react";

export interface Course {
  course_id: number;
  course_name: string;
  code: string;
  description: string;
  teacher: string;
  duration: string;
  enrollments_count: number;
}

export const courseColumns: ColumnDef<Course>[] = [
  { accessorKey: "course_id", header: "ID" },
  { accessorKey: "course_name", header: "Course Name" },
  { accessorKey: "code", header: "Course Code" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "teacher", header: "Teacher" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "enrollments_count", header: "Enrollments" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const course = row.original;
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        if (
          confirm(`Are you sure you want to delete the course "${course.course_name}"?`)
        ) {
          destroy(route("courses.destroy", course.course_id));
        }
      };

      return (
        <div className="flex gap-2">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => alert("Edit feature coming soon")}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={processing}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
