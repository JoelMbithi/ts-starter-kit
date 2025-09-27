/* "use server";

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


export const getLoggedInUser = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) return null;

  // Map raw_user_meta_data into a typed User object
  const user = {
    id: data.user.id,
    email: data.user.email,
    firstName: data.user.user_metadata?.FirstName || data.user.raw_user_meta_data?.FirstName,
    lastName: data.user.user_metadata?.LastName || data.user.raw_user_meta_data?.LastName,
    city: data.user.user_metadata?.City || data.user.raw_user_meta_data?.City,
    code: data.user.user_metadata?.Code || data.user.raw_user_meta_data?.Code,
    dateOfBirth: data.user.user_metadata?.Date || data.user.raw_user_meta_data?.Date,
    gender: data.user.user_metadata?.Gender || data.user.raw_user_meta_data?.Gender,
    address: data.user.user_metadata?.Address || data.user.raw_user_meta_data?.Address,
    emailVerified: data.user.user_metadata?.email_verified || data.user.raw_user_meta_data?.email_verified,
  };

  return user;
}; */