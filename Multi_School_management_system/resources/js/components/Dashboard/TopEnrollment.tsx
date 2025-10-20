"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TeacherTable from "../Table/TeacherTable"; 
import StudentTable from "./StudentTable";
import CourseTable from "./CourseTable";
import { Student } from "@/pages/Students/column";

interface TopEnrollmentProps {
  students: Student[];
 /*  teachers: Teacher[];
  courses: Course[]; */
}
const TopEnrollment = ({ students }: TopEnrollmentProps) => {
  const [activeSection, setActiveSection] = useState("teachers");

  const renderContent = () => {
    switch (activeSection) {
      case "teachers":
        return <TeacherTable />;
      case "students":
        return <StudentTable  students={students} />
      case "courses":
        return <CourseTable/>
      default:
        return <div>Select a section above</div>;
    }
  };

  return (
    <div className="bg-white flex flex-col mb-4 px-6 py-5 rounded-lg ">
      {/* Header */}
      <h1 className="text-xl font-bold text-center mb-2">
        Recent Enrollments
      </h1>
      <hr className="mb-4" />

      {/* Section Tabs */}
      <div className="flex gap-4 items-center justify-center mb-4">
        <Button
          onClick={() => setActiveSection("teachers")}
          className={`${
            activeSection === "teachers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Teachers
        </Button>

        <Button
          onClick={() => setActiveSection("students")}
          className={`${
            activeSection === "students"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Students
        </Button>

        <Button
          onClick={() => setActiveSection("courses")}
          className={`${
            activeSection === "courses"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Courses
        </Button>
      </div>

      {/* Dynamic Content */}
      <div className="bg-gray-50 rounded-md p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default TopEnrollment;
