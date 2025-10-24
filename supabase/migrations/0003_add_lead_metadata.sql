-- Create table for storing call transcript and summary (unlocked after purchase)
CREATE TABLE IF NOT EXISTS public.lead_metadata (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade unique,
  transcript text,
  call_summary text,
  call_duration integer,
  call_direction text,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.lead_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Only show metadata to clinics that claimed the lead
CREATE POLICY "metadata visible to lead owner"
  ON public.lead_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lead_claims lc
      JOIN public.clinics c ON c.id = lc.clinic_id
      WHERE lc.lead_id = lead_metadata.lead_id
        AND c.clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Allow service role to insert
CREATE POLICY "service role can insert metadata"
  ON public.lead_metadata FOR INSERT
  WITH CHECK (true);

