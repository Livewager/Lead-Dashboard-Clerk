import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_anon_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key'

// Singleton client instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null
let supabaseAdminInstance: ReturnType<typeof createClient<Database>> | null = null

// Client-side Supabase client (singleton)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'clinic-concierge-auth',
      }
    })
  }
  return supabaseInstance
})()

// Server-side Supabase client with service role key (singleton)
export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
})()
