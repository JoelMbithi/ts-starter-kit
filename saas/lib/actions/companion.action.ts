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


export const GetAllCompanions = async ({limit = 10, page =1,subject,topic}: GetAllCompanions) => {
    const supabase = await createSupabaseClient()

    let query =  supabase.from('companions').select();

    if(subject && topic){
      query = query .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }else if(subject){
     query = query.ilike("subject", `%${subject}%`);
    }else if(topic){
     query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit -1)

    const {data: companions, error} = await query
    if (error) throw new Error(error.message)

      return companions
    
}

export const getCompanion = async (id:string) => {
  const supabase = await createSupabaseClient()

  const { data,error} = await supabase
  .from('companions')
  .select().eq('id',id)
  .single()

  if(error) return console.log(error)

    return data
}

export const addToSessionHistory = async (companionId: string) => {
  const { userId} = await auth()
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
  .from('session_history')
  .insert({
    companion_id: companionId,
    user_id: userId,
  })

  if (error) throw new Error(error.message)
    return data
}

export const getRecentSessions = async (limit = 10) => {
  const supabase = await createSupabaseClient()
  const { data,error} = await supabase
  .from('session_history')
  .select(`companions:companion_id(*)`)
  .order('created_at', { ascending: false})
  .limit(limit)

  if (error) throw new Error(error.message)

    return data.map(({ companions}) => companions)

}

export const getUserSessions = async (userId: string,limit = 10) => {
  const supabase = await createSupabaseClient()
  const { data,error} = await supabase
  .from('session_history')
  .select(`companions:companion_id(*)`)
  .order('created_at', { ascending: false})
  .eq('user_id',userId)
  .limit(limit)

  if (error) throw new Error(error.message)
console.log(data)
    return data.map(({ companions}) => companions)
    

}

export const getUserCompanions = async (userId: string) => {
  const supabase = await createSupabaseClient()
  const { data,error} = await supabase
  .from('companions')
  .select()
  .eq('author',userId)


  if (error) throw new Error(error.message)

    return data
}

// ---------- Check Companion Permissions ----------
export const newCompanionPermisions = async (): Promise<boolean> => {
  const { userId, has } = await auth();
  const supabase = await createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_active_companions" })) {
    limit = 3;
  } else if (has({ feature: "10_active_companions" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length ?? 0;
  return companionCount < limit;
};