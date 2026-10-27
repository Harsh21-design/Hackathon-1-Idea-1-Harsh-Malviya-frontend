import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or anon/publishable key. Copy .env.example to .env.local."
    );
  }
  return createBrowserClient(url, key);
}

export function hasSupabaseConfig(): boolean {
  return hasSupabaseEnv();
}
