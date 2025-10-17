"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { getSearchRoute, getStoreRoute, Resource } from "@/lib/helpers";

interface SearchComponentProps {
  resource: "teachers" | "students"; // dynamic resource
  onResults: (results: any[]) => void;
}

const SearchComponent = ({ resource, onResults }: SearchComponentProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { Ziggy } = usePage().props;

  // Define form fields dynamically
  const initialFormData = resource === "students"
    ? { first_name: "", last_name: "", grade: "", class: "", age: "", registration_number: "" }
    : { first_name: "", last_name: "", subject: "" };

  const { data, setData, post, processing, errors, reset } = useForm(initialFormData);

  // Handle create form submit
  /* const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     post(route(`${resource}.store`,{}, true, Ziggy), {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  }; */

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post(getStoreRoute(resource as Resource, Ziggy), {
    onSuccess: () => {
      reset();
      setOpen(false);
    },
  });
};

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

  // Handle search input
/*   const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      onResults([]);
      return;
    }

    try {
      const response = await axios.get(route(`${resource}.search`), {
        params: { query: value },
      });
      onResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };
 */
  const placeholder = `Search for a ${resource === "teachers" ? "teacher" : "student"}...`;
  const createButtonText = `Create a ${resource === "teachers" ? "Teacher" : "Student"}`;
  const createDialogTitle = `Create a New ${resource === "teachers" ? "Teacher" : "Student"}`;
  const createDialogDescription = `Fill in the details below to add a new ${resource === "teachers" ? "teacher" : "student"}.`;

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4 py-4 px-2">
      {/* Search input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-neutral-900 dark:text-white"
          onChange={handleSearch}
        />
      </div>

      {/* Filter (example) */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="leave">On Leave</SelectItem>
          <SelectItem value="new">Newly Hired / Enrolled</SelectItem>
        </SelectContent>
      </Select>

      {/* Create Dialog */}
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
            {/* Common fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
            </div>

            {/* Conditional fields */}
            {resource === "teachers" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  value={data.subject}
                  onChange={(e) => setData("subject", e.target.value)}
                  placeholder="Enter subject"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
              </div>
            )}

            {resource === "students" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <input
                    value={data.grade}
                    onChange={(e) => setData("grade", e.target.value)}
                    placeholder="Enter grade"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <input
                    value={data.class}
                    onChange={(e) => setData("class", e.target.value)}
                    placeholder="Enter class"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData("age", e.target.value)}
                    placeholder="Enter age"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    value={data.registration_number}
                    onChange={(e) => setData("registration_number", e.target.value)}
                    placeholder="Enter registration number"
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" onClick={() => { reset(); setOpen(false); }} className="bg-gray-400 hover:bg-gray-500">
                Cancel
              </Button>
              <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                {processing ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchComponent;
