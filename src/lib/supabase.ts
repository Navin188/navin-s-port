import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://qcciidxwrdknhpswwhcy.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_KHflQEJDistsJT1YKMtonQ_6D9-jcTm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseKey.includes('your-anon-publishable-key')
);

// Instantiate Supabase client with active or fallback credentials
const validUrl = isSupabaseConfigured ? supabaseUrl : DEFAULT_SUPABASE_URL;
const validKey = isSupabaseConfigured ? supabaseKey : DEFAULT_SUPABASE_KEY;

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
