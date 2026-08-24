import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

// Built lazily rather than at module load: createClient() throws when the URL/key
// are missing, and eagerly running that at import time takes down every page that
// (transitively) imports this module — not just the one feature that needed it.
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — check your .env file.');
  }
  if (!client) client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
