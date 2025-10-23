import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_anon_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key'

// Singleton client instances
let supabaseInstance: ReturnType<typeof createClient> | null = null
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null

// Client-side Supabase client (singleton)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
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
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
})()

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          clerk_user_id: string
          clinic_name: string
          email: string | null
          phone: string | null
          logo_url: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          clinic_name: string
          email?: string | null
          phone?: string | null
          logo_url?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          clinic_name?: string
          email?: string | null
          phone?: string | null
          logo_url?: string | null
          location?: string | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          tier: 'warm' | 'hot' | 'platinum'
          status: 'available' | 'being_claimed' | 'claimed'
          price_cents: number
          score: number
          city: string | null
          region: string | null
          summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tier: 'warm' | 'hot' | 'platinum'
          status?: 'available' | 'being_claimed' | 'claimed'
          price_cents: number
          score?: number
          city?: string | null
          region?: string | null
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tier?: 'warm' | 'hot' | 'platinum'
          status?: 'available' | 'being_claimed' | 'claimed'
          price_cents?: number
          score?: number
          city?: string | null
          region?: string | null
          summary?: string | null
          created_at?: string
        }
      }
      lead_photos: {
        Row: {
          id: string
          lead_id: string
          url: string
          is_primary: boolean
        }
        Insert: {
          id?: string
          lead_id: string
          url: string
          is_primary?: boolean
        }
        Update: {
          id?: string
          lead_id?: string
          url?: string
          is_primary?: boolean
        }
      }
      lead_claims: {
        Row: {
          id: string
          lead_id: string
          clinic_id: string
          amount_cents: number
          tax_cents: number
          fee_cents: number
          total_cents: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          clinic_id: string
          amount_cents: number
          tax_cents?: number
          fee_cents?: number
          total_cents: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          clinic_id?: string
          amount_cents?: number
          tax_cents?: number
          fee_cents?: number
          total_cents?: number
          status?: string
          created_at?: string
        }
      }
      lead_locks: {
        Row: {
          lead_id: string
          locked_by: string
          locked_at: string
          expires_at: string
        }
        Insert: {
          lead_id: string
          locked_by: string
          locked_at?: string
          expires_at: string
        }
        Update: {
          lead_id?: string
          locked_by?: string
          locked_at?: string
          expires_at?: string
        }
      }
    }
  }
}
