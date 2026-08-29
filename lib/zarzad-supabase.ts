import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __dealshareBoardSupabase?: SupabaseClient;
  }
}

export function createZarzadSupabaseClient(): SupabaseClient {
  if (typeof window !== "undefined" && window.__dealshareBoardSupabase) {
    return window.__dealshareBoardSupabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brakuje konfiguracji Supabase dla panelu zarządu.");
  }

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
