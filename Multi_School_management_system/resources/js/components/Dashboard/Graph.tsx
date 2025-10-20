"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { usePage } from "@inertiajs/react";

interface GraphData {
  name: string;
  count: number;
}

const Graph = () => {
  const { props } = usePage<{ dashboardStats: { students: number; teachers: number; courses: number } }>();
  const stats = props.dashboardStats || { students: 0, teachers: 0, courses: 0 };

  const data: GraphData[] = [
    { name: "Students", count: stats.students },
    { name: "Teachers", count: stats.teachers },
    { name: "Courses", count: stats.courses },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl  p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Overview Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
