import { createClient } from '@supabase/supabase-js'

// TODO: una vez que creemos el proyecto real en Supabase, completar estas
// variables en un archivo .env (ver .env.example). Mientras tanto, el resto
// de la app funciona con datos de ejemplo para poder revisar la interfaz.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
