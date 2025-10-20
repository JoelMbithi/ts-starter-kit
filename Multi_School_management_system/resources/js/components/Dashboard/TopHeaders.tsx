import React from "react";
import { usePage } from "@inertiajs/react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
}

const TopHeaders = () => {
  const { props } = usePage<{ dashboardStats: DashboardStats }>();
  const { totalStudents = 6, totalTeachers = 4, totalCourses = 10 } =
    props.dashboardStats || {};
    console.log('Dashboard props:', props);


  const statsData = [
    { name: "Students", value: totalStudents, img: "/build/student.jpg" },
    { name: "Teachers", value: totalTeachers, img: "/build/teacher.jpg" },
    { name: "Courses", value: totalCourses, img: "/build/course.jpg" },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {statsData.map((item) => (
        <div
          key={item.name}
          className="relative flex items-center justify-start px-4 py-6 aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 dark:border-sidebar-border shadow-sm"
        >
          <div className="flex gap-4 items-center">
            <img
              src={item.img}
              alt={item.name.toLowerCase()}
              width={55}
              height={55}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {item.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopHeaders;
