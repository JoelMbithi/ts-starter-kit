"use server";

import { SignUpParams, SignInParams } from "@/types";
import { createServerSupabaseClient } from "../supabaseClient";

export const signUp = async ({ email, password, firstName, lastName, ...rest }: SignUpParams) => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName, ...rest },
    },
  });

  if (error) throw error;
  return data; // { user, session }
};

export const signIn = async ({ email, password }: SignInParams) => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data; // { user, session }
};


export async function getLoggedInUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user;
}
