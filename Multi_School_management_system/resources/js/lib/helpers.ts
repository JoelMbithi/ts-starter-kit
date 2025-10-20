import { route } from "ziggy-js";

export type Resource = "teachers" | "students" | "courses" | "enrollments";

export function getStoreRoute(resource: Resource, Ziggy?: any) {
  switch (resource) {
    case "teachers":
      return route("teachers.store", {}, true, Ziggy);
    case "students":
      return route("students.store", {}, true, Ziggy);
    case "courses":
      return route("courses.store", {}, true, Ziggy);
    case "enrollments":
      return route("enrollments.store", {}, true, Ziggy);
  }
}

export function getSearchRoute(resource: Resource, Ziggy?: any) {
  switch (resource) {
    case "teachers":
      return route("teachers.search", {}, true, Ziggy);
    case "students":
      return route("students.search", {}, true, Ziggy);
    case "courses":
      return route("courses.search", {}, true, Ziggy);
    case "enrollments":
      return route("enrollments.search", {}, true, Ziggy);
  }
}
