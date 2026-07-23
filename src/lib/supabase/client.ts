import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Shared singleton Supabase browser client
const supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);

export function createClient() {
  return supabaseInstance;
}
