import { createClient, SupabaseClient } from "@supabase/supabase-js";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl =
  typeof rawUrl === "string" && rawUrl.trim() ? rawUrl.trim() : PLACEHOLDER_URL;
const supabaseAnonKey =
  typeof rawKey === "string" && rawKey.trim() ? rawKey.trim() : PLACEHOLDER_KEY;

export const isSupabaseConfigured =
  supabaseUrl !== PLACEHOLDER_URL && supabaseAnonKey !== PLACEHOLDER_KEY;

function createSupabaseClient(): SupabaseClient {
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    // Fallback when createClient throws (e.g. deploy without env): no-op stub so app doesn't crash
    const err = { message: "Supabase not configured" };
    const noop = () => Promise.resolve({ data: null, error: err });
    const noopUser = () => Promise.resolve({ data: { user: null }, error: err });
    const result = Promise.resolve({ data: null, error: err });
    const chain = (): Promise<{ data: null; error: { message: string } }> & Record<string, () => unknown> => {
      const p = result as Promise<{ data: null; error: { message: string } }> & Record<string, () => unknown>;
      p.eq = () => chain();
      p.select = () => chain();
      p.insert = () => chain();
      p.upsert = () => chain();
      p.delete = () => chain();
      p.single = () => chain();
      return p;
    };
    return {
      auth: {
        getUser: noopUser,
        signInWithPassword: noop,
        signUp: noop,
        signOut: () => Promise.resolve({ error: null }),
        updateUser: noop,
        getSession: noopUser,
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => chain(),
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        unsubscribe: () => {},
      }),
      removeChannel: () => {},
    } as unknown as SupabaseClient;
  }
}

export const supabase = createSupabaseClient();
