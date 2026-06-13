import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "nyayasetu-auth",
  },
});

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  city: string;
  created_at: string;
};

export type Lawyer = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  experience: number;
  phone: string;
  email: string;
  address: string;
  languages: string[];
  bio: string;
  is_sample: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const meta = data.user.user_metadata ?? {};
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    full_name: meta.full_name ?? "",
    phone: meta.phone ?? "",
    city: meta.city ?? "",
    created_at: data.user.created_at ?? new Date().toISOString(),
  };
}

export async function updateUserMetadata(updates: Partial<Pick<AppUser, "full_name" | "phone" | "city">>) {
  const { error } = await supabase.auth.updateUser({ data: updates });
  return error;
}
