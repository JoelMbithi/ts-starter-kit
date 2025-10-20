"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { route } from "ziggy-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

// ---- ENROLLMENT TYPE ----
export interface Enrollment {
  enrollment_id: number;
  student_name: string;
  course_name: string;
  class_name: string;
  teacher_name: string;
  enrollment_date: string;
  status: string;
}

// ---- COLUMNS DEFINITION ----
export const enrollmentColumns: ColumnDef<Enrollment>[] = [
  { accessorKey: "enrollment_id", header: "Enrollment ID" },
  { accessorKey: "student_name", header: "Student" },
  { accessorKey: "course_name", header: "Course" },
  { accessorKey: "class_name", header: "Class" },
  { accessorKey: "teacher_name", header: "Teacher" },
  {
    accessorKey: "enrollment_date",
    header: "Date",
    cell: ({ getValue }) => {
      const dateValue = getValue<string>();
      const formattedDate = new Date(dateValue).toISOString().split("T")[0];
      return <span>{formattedDate}</span>;
    },
  },
  { accessorKey: "status", header: "Status" },

  // ---- ACTIONS COLUMN ----
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const enrollment = row.original;
      const { delete: destroy, put, processing, data, setData } = useForm({
        student_name: enrollment.student_name,
        course_name: enrollment.course_name,
        class_name: enrollment.class_name,
        teacher_name: enrollment.teacher_name,
        enrollment_date: enrollment.enrollment_date,
        status: enrollment.status,
      });

      const handleDelete = () => {
        if (confirm(`Are you sure you want to delete enrollment #${enrollment.enrollment_id}?`)) {
          destroy(route("enrollments.destroy", enrollment.enrollment_id), {
            onSuccess: () => alert("Enrollment deleted successfully!"),
          });
        }
      };

      const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("enrollments.update", enrollment.enrollment_id), {
          onSuccess: () => alert("Enrollment updated successfully!"),
        });
      };

      return (
        <div className="flex gap-2">
          {/*  EDIT DIALOG */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">Edit</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Enrollment</DialogTitle>
                <DialogDescription>
                  Update enrollment details below and click “Save Changes”.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEdit} className="space-y-3 mt-3">
                <div>
                  <Label>Class</Label>
                  <Input
                    value={data.class_name}
                    onChange={(e) => setData("class_name", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Input
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Enrollment Date</Label>
                  <Input
                    type="date"
                    value={data.enrollment_date.split("T")[0]}
                    onChange={(e) => setData("enrollment_date", e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {processing ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* ❌ DELETE BUTTON */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={processing}
          >
            {processing ? "Deleting..." : "Delete"}
          </Button>
        </div>
      );
    },
  },
];
