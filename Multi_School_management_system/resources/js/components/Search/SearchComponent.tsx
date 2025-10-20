"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { getSearchRoute, getStoreRoute, Resource } from "@/lib/helpers";

interface SearchComponentProps {
  resource: "teachers" | "students" | "enrollment" | "courses";
  onResults: (results: any[]) => void;
}

const SearchComponent = ({ resource, onResults }: SearchComponentProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { Ziggy, teachers: teacherList, courses: courseList } = usePage().props;

const [teachers] = useState<any[]>(Array.isArray(teacherList) ? teacherList : []);
const [courses] = useState<any[]>(Array.isArray(courseList) ? courseList : []);


  // 🔹 Dynamic form fields for each resource
  const initialFormData =
    resource === "students"
      ? {
          first_name: "",
          last_name: "",
          grade: "",
          class: "",
          age: "",
          registration_number: "",
          course_id: "",
          teacher_id: "",
        }
      : resource === "teachers"
      ? {
          first_name: "",
          last_name: "",
          subject: "",
        }
      : resource === "courses"
      ? {
          name: "",
          code: "",
          description: "",
          teacher: "",
          duration: "",
        }
      : {
          student_name: "",
          course_name: "",
          teacher_name: "",
          class_name: "",
          enrollment_date: "",
          status: "",
        };

  const { data, setData, post, processing, reset } = useForm(initialFormData);

  // 🔹 Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(getStoreRoute(resource as Resource, Ziggy), {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  // 🔹 Live search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      onResults([]);
      return;
    }

    try {
      const response = await axios.get(getSearchRoute(resource as Resource, Ziggy), {
        params: { query: value },
      });
      onResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 🔹 Dynamic placeholders and titles
  const placeholder =
    resource === "teachers"
      ? "Search for a teacher..."
      : resource === "students"
      ? "Search for a student..."
      : resource === "courses"
      ? "Search for a course..."
      : "Search for an enrollment...";

  const createButtonText =
    resource === "teachers"
      ? "Create Teacher"
      : resource === "students"
      ? "Create Student"
      : resource === "courses"
      ? "Create Course"
      : "Create Enrollment";

  const createDialogTitle =
    resource === "teachers"
      ? "Create New Teacher"
      : resource === "students"
      ? "Create New Student"
      : resource === "courses"
      ? "Create New Course"
      : "Create New Enrollment";

  const createDialogDescription =
    resource === "teachers"
      ? "Fill in the details to add a new teacher."
      : resource === "students"
      ? "Fill in the details to add a new student."
      : resource === "courses"
      ? "Fill in the details to add a new course."
      : "Fill in the details to register a new enrollment.";

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4 py-4 px-2">
      {/* 🔍 Search */}
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-neutral-900 dark:text-white"
          onChange={handleSearch}
        />
      </div>

      {/* 🧭 Filter */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="withdrawn">Withdrawn</SelectItem>
        </SelectContent>
      </Select>

      {/* ➕ Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-500 hover:bg-green-700">{createButtonText}</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createDialogTitle}</DialogTitle>
            <DialogDescription>{createDialogDescription}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* 🧩 Conditional Form Fields */}

            {/* Teachers */}
            {resource === "teachers" && (
              <>
                <InputField
                  label="First Name"
                  value={data.first_name}
                  onChange={(e) => setData("first_name", e.target.value)}
                />
                <InputField
                  label="Last Name"
                  value={data.last_name}
                  onChange={(e) => setData("last_name", e.target.value)}
                />
                <InputField
                  label="Subject"
                  value={data.subject}
                  onChange={(e) => setData("subject", e.target.value)}
                />
              </>
            )}

            {/* Students */}
            {resource === "students" && (
              <>
                <InputField
                  label="First Name"
                  value={data.first_name}
                  onChange={(e) => setData("first_name", e.target.value)}
                />
                <InputField
                  label="Last Name"
                  value={data.last_name}
                  onChange={(e) => setData("last_name", e.target.value)}
                />
                <InputField
                  label="Grade"
                  value={data.grade}
                  onChange={(e) => setData("grade", e.target.value)}
                />
                <InputField
                  label="Class"
                  value={data.class}
                  onChange={(e) => setData("class", e.target.value)}
                />
                <InputField
                  label="Age"
                  type="number"
                  value={data.age}
                  onChange={(e) => setData("age", e.target.value)}
                />
                <InputField
                  label="Registration Number"
                  value={data.registration_number}
                  onChange={(e) => setData("registration_number", e.target.value)}
                />

                {/* Select Course */}
                <div>
                  <label>Course</label>
                  <select
                    required
                    value={data.course_id}
                    onChange={(e) => setData("course_id", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course: any) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Teacher */}
                <div>
                  <label>Teacher</label>
                  <select
                    required
                    value={data.teacher_id}
                    onChange={(e) => setData("teacher_id", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher: any) => (
                      <option key={teacher.teacher_id} value={teacher.teacher_id}>
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Courses */}
            {resource === "courses" && (
              <>
                <InputField
                  label="Course Name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputField
                  label="Course Code"
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                />
                <div>
                  <label>Description</label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="w-full border rounded-md p-2 mt-1"
                  />
                </div>
                <InputField
                  label="Teacher"
                  value={data.teacher}
                  onChange={(e) => setData("teacher", e.target.value)}
                />
                <InputField
                  label="Duration"
                  value={data.duration}
                  onChange={(e) => setData("duration", e.target.value)}
                  placeholder="e.g. 3 months"
                />
              </>
            )}

            {/* Enrollment */}
            {resource === "enrollment" && (
              <>
                <InputField
                  label="Student Name"
                  value={data.student_name}
                  onChange={(e) => setData("student_name", e.target.value)}
                />
                <InputField
                  label="Course Name"
                  value={data.course_name}
                  onChange={(e) => setData("course_name", e.target.value)}
                />
                <InputField
                  label="Teacher Name"
                  value={data.teacher_name}
                  onChange={(e) => setData("teacher_name", e.target.value)}
                />
                <InputField
                  label="Class Name"
                  value={data.class_name}
                  onChange={(e) => setData("class_name", e.target.value)}
                />
                <InputField
                  label="Enrollment Date"
                  type="date"
                  value={data.enrollment_date}
                  onChange={(e) => setData("enrollment_date", e.target.value)}
                />
                <InputField
                  label="Status"
                  placeholder="Active / Completed / Withdrawn"
                  value={data.status}
                  onChange={(e) => setData("status", e.target.value)}
                />
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                {processing ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 🧩 Reusable input field component
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-md p-2 mt-1"
    />
  </div>
);

export default SearchComponent;
