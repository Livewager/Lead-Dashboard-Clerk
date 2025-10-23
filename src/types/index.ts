export type LeadTier = 'warm' | 'hot' | 'platinum';
export type LeadStatus = 'available' | 'being_claimed' | 'claimed';

export interface Clinic {
  id: string;
  clerk_user_id: string;
  clinic_name: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  location?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  tier: LeadTier;
  status: LeadStatus;
  price_cents: number;
  score: number;
  city?: string;
  region?: string;
  summary?: string;
  created_at: string;
  photos?: LeadPhoto[];
  claim?: LeadClaim;
}

export interface LeadPhoto {
  id: string;
  lead_id: string;
  url: string;
  is_primary: boolean;
}

export interface LeadClaim {
  id: string;
  lead_id: string;
  clinic_id: string;
  amount_cents: number;
  tax_cents: number;
  fee_cents: number;
  total_cents: number;
  status: string;
  created_at: string;
}

export interface LeadLock {
  lead_id: string;
  locked_by: string;
  locked_at: string;
  expires_at: string;
}

export interface DashboardStats {
  newLeads24h: number;
  availableNow: number;
  averageScore: number;
  totalRevenue: number;
}

export interface ClaimSummary {
  leadId: string;
  tier: LeadTier;
  location: string;
  price: number;
  tax: number;
  fee: number;
  total: number;
}
