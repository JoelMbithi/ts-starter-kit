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

export interface Student {
  student_id: number
  first_name: string
  last_name: string
  class: string
  age: number
}

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.original.student_id}</span>,
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
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => <span>{row.original.class}</span>,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => <span>{row.original.age}</span>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original
      const { delete: destroy, put, processing, data, setData } = useForm({
        first_name: student.first_name,
        last_name: student.last_name,
        class: student.class,
        age: student.age,
      })

      const handleDelete = () => {
        if (confirm("Are you sure you want to delete this student?")) {
          destroy(route("students.destroy", student.student_id))
        }
      }

      const handleEdit = (e: React.FormEvent) => {
        e.preventDefault()
       put(route("students.update",  { student: student.student_id }), {
          onSuccess: () => alert("Student updated successfully!"),
        })
      }

      return (
        <div className="flex gap-2">
          {/* EDIT DIALOG */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>
                  Update this student’s information and click “Save Changes”.
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
                  <Label>Class</Label>
                  <Input
                    value={data.class}
                    onChange={(e) => setData("class", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData("age", Number(e.target.value))}
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

          {/* DELETE BUTTON */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={processing}
          >
            {processing ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )
    },
  },
]
