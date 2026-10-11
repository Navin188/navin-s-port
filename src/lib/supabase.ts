import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseKey.includes('your-anon-publishable-key')
);

// Fallback dummy URL/key to instantiate client safely if env variables are pending setup
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const validKey = isSupabaseConfigured ? supabaseKey : 'placeholder-anon-key';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
