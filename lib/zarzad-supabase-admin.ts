import { createClient } from "@supabase/supabase-js";

export type BoardProfile = {
  id: string;
  email: string;
  full_name: string;
  role: "admin";
  is_active: boolean;
};

export function getZarzadSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Brakuje konfiguracji serwerowej Supabase.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function verifyBoardRequest(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";

  if (!token) {
    return null;
  }

  const supabase = getZarzadSupabaseAdmin();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("board_profiles")
    .select("id,email,full_name,role,is_active")
    .eq("id", userData.user.id)
    .eq("is_active", true)
    .single<BoardProfile>();

  if (profileError || !profile) {
    return null;
  }

  return profile;
}
