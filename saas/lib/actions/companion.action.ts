"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../Supabase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  if (!author) throw new Error("User not authenticated");

  const supabase = await createSupabaseClient(); 

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select("*")
    .single(); 
  console.log("Insert result:", data, error); 

  if (error) throw new Error(error.message);
  return data; 
};
