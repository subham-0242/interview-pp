import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a proxy to handle missing environment variables gracefully.
// This prevents the app from crashing on startup if Supabase is not yet configured.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: (_, prop) => {
        throw new Error(
          `Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables. Attempted to access: ${String(prop)}`
        );
      }
    }) as ReturnType<typeof createClient>;
