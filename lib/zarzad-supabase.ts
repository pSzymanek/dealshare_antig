import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __dealshareBoardSupabase?: SupabaseClient;
  }
}

export function isZarzadSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createZarzadSupabaseClient(): SupabaseClient {
  if (typeof window !== "undefined" && window.__dealshareBoardSupabase) {
    return window.__dealshareBoardSupabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-dealshare.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  });

  if (typeof window !== "undefined") {
    window.__dealshareBoardSupabase = supabase;
  }

  return supabase;
}
