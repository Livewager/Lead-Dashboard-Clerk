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
          name: string | null
          email: string | null
          phone: string | null
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
          name?: string | null
          email?: string | null
          phone?: string | null
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
          name?: string | null
          email?: string | null
          phone?: string | null
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

