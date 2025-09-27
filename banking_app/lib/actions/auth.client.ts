"use client";

export const logOut = (): boolean => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};
