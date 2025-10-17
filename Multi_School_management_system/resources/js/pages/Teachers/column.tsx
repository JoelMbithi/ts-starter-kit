"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { route } from "ziggy-js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export type Teacher = {
  teacher_id: number
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  first_name: string
  last_name: string
  subject: string
}

export const teacherColumns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "teacher_id",
    header: "ID",
    cell: ({ row }) => <span>{row.original.teacher_id}</span>,
  },
  {
    id: "full_name",
    header: "Full Name",
    cell: ({ row }) => (
      <span>
        {row.original.first_name} {row.original.last_name}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span>{row.original.subject}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status || "pending"}</span>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const teacher = row.original;
      const { delete: destroy, put, processing, data, setData } = useForm({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        subject: teacher.subject,
        status: teacher.status,
      });

      const handleDelete = () => {
        if (confirm("Are you sure you want to delete this teacher?")) {
          destroy(route("teachers.destroy", teacher.teacher_id));
        }
      };

      const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("teachers.update", teacher.teacher_id), {
          onSuccess: () => alert("Teacher updated successfully!"),
        });
      };

      return (
        <div className="flex gap-2">
          {/* EDIT DIALOG */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Teacher</DialogTitle>
                <DialogDescription>
                  Update this teacher’s information and click “Save Changes”.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEdit} className="space-y-4 mt-3">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={data.first_name}
                    onChange={(e) => setData("first_name", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={data.last_name}
                    onChange={(e) => setData("last_name", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input
                    value={data.subject}
                    onChange={(e) => setData("subject", e.target.value)}
                  />
                </div>

               {/*  <div>
                  <Label>Status</Label>
                  <Input
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                  />
                </div>
 */}
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

          {/* DELETE BUTTON */}
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
