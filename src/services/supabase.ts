import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper to get localized field
export function getLocalizedField(
  item: Record<string, unknown>,
  field: string,
  lang: 'en' | 'he' = 'en'
): string {
  const value = item[`${field}_${lang}`] || item[`${field}_en`] || '';
  return String(value);
}
