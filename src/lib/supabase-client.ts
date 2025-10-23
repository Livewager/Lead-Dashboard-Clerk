'use client'

import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Hook to get Supabase client with Clerk JWT
export function useSupabaseClient() {
  const { getToken } = useAuth()
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        const token = await getToken({ template: 'supabase' })
        return token ? { Authorization: `Bearer ${token}` } : {}
      },
    },
  })
  
  return supabase
}

