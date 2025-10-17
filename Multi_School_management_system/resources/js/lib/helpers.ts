import { route } from "ziggy-js";

export type Resource = "teachers" | "students";

export function getStoreRoute(resource: Resource, Ziggy?: any) {
  switch (resource) {
    case "teachers":
      return route("teachers.store", {}, true, Ziggy);
    case "students":
      return route("students.store", {}, true, Ziggy);
  }
}

export function getSearchRoute(resource: Resource, Ziggy?: any) {
  switch (resource) {
    case "teachers":
      return route("teachers.search", {}, true, Ziggy);
    case "students":
      return route("students.search", {}, true, Ziggy);
  }
}
