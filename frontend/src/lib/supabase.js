import { createClient } from '@supabase/supabase-js';

// Fallback to project credentials so it never throws on missing env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkfugilmpgueogleajox.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EwDnKiaeVP0jDGzcOyDpqw_qs8V5jKo';

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_PROJECT'))
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export default supabase;
