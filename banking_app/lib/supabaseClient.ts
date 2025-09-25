// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  // await here fixes the Promise issue in all Next.js versions
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // reading works
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        // writing/deleting cookies is not supported from server components in many Next.js setups.
        // Provide no-op functions (supabase won't crash). If you need to actually set cookies,
        // do it from a route handler or middleware where you have a Response to mutate.
        set() {
          /* no-op on server component (use API route for actual cookie set) */
        },
        remove() {
          /* no-op */
        },
      },
    }
  );
}
