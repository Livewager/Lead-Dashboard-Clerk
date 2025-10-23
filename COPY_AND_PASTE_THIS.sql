-- ========================================
-- CLINIC CONCIERGE - COMPLETE DATABASE SETUP
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "Run" - takes 10 seconds total!
-- ========================================

-- Enums
create type lead_tier as enum ('warm','hot','platinum');
create type lead_status as enum ('available','being_claimed','claimed');

-- Clinics (mapped to Clerk user_id; one clinic per org for now)
create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  clinic_name text not null,
  email text,
  phone text,
  logo_url text,
  location text,
  created_at timestamptz default now()
);

-- Leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tier lead_tier not null,
  status lead_status not null default 'available',
  price_cents integer not null check (price_cents >= 0),
  score numeric(5,2) default 0.00,
  city text,
  region text,
  summary text,
  name text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Lead Photos
create table public.lead_photos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  url text not null,
  is_primary boolean default false
);

-- Lead Claims
create table public.lead_claims (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete restrict,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  amount_cents integer not null,
  tax_cents integer not null default 0,
  fee_cents integer not null default 0,
  total_cents integer not null,
  status text not null default 'succeeded',
  created_at timestamptz default now(),
  unique (lead_id)
);

-- Lead Locks
create table public.lead_locks (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  locked_by uuid not null references public.clinics(id),
  locked_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- Enable Realtime
alter publication supabase_realtime add table public.leads;

-- Enable RLS
alter table public.clinics enable row level security;
alter table public.leads enable row level security;
alter table public.lead_photos enable row level security;
alter table public.lead_claims enable row level security;
alter table public.lead_locks enable row level security;

-- RLS Policies for Clinics
create policy "clinic can read self"
  on public.clinics for select
  using (clerk_user_id = auth.jwt()->>'sub');

create policy "clinic can create self"
  on public.clinics for insert
  with check (clerk_user_id = auth.jwt()->>'sub');

create policy "clinic can update self"
  on public.clinics for update
  using (clerk_user_id = auth.jwt()->>'sub');

-- RLS Policies for Leads
create policy "everyone can read available leads"
  on public.leads for select
  using (true);

create policy "can update lead status on claim"
  on public.leads for update
  using (status = 'available')
  with check (status = 'claimed');

-- RLS Policies for Lead Photos
create policy "everyone can read photos"
  on public.lead_photos for select
  using (true);

-- RLS Policies for Lead Claims
create policy "clinic can create claim"
  on public.lead_claims for insert
  with check (
    exists (
      select 1 from public.clinics
      where clinics.id = lead_claims.clinic_id
        and clinics.clerk_user_id = auth.jwt()->>'sub'
    )
  );

create policy "clinic can read own claims"
  on public.lead_claims for select
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = lead_claims.clinic_id
        and clinics.clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Demo Data (Sample Leads)
INSERT INTO public.leads (tier, status, price_cents, score, city, region, summary, name, email, phone) VALUES
('warm', 'available', 2500, 75.5, 'Vancouver', 'Downtown', 'Seeking comprehensive beauty consultation for special event', 'Sarah Johnson', 'sarah.j@email.com', '(604) 555-0123'),
('hot', 'available', 4500, 88.2, 'Burnaby', 'Metrotown', 'Interested in full facial treatment and skincare routine', 'Emily Chen', 'emily.chen@email.com', '(778) 555-0456'),
('platinum', 'available', 7500, 95.0, 'West Vancouver', 'Ambleside', 'Looking for premium anti-aging treatments and consultation', 'Jessica Williams', 'j.williams@email.com', '(604) 555-0789'),
('warm', 'available', 1800, 68.1, 'Richmond', 'Steveston', 'Basic facial and product recommendations', 'Amanda Lee', 'amanda.lee@email.com', '(778) 555-0234'),
('hot', 'available', 5200, 91.3, 'Surrey', 'South Surrey', 'Advanced laser treatment consultation', 'Michelle Brown', 'mbrown@email.com', '(604) 555-0567'),
('platinum', 'available', 8500, 98.7, 'Coquitlam', 'Burquitlam', 'Full body aesthetic transformation package', 'Jennifer Taylor', 'j.taylor@email.com', '(778) 555-0890');

-- Add photos for leads (primary + additional photos)

-- Vancouver lead - 4 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Vancouver';

-- Burnaby lead - 3 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'Burnaby';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Burnaby';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Burnaby';

-- West Vancouver lead - 4 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'West Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'West Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'West Vancouver';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'West Vancouver';

-- Richmond lead - 2 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'Richmond';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Richmond';

-- Surrey lead - 3 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'Surrey';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Surrey';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Surrey';

-- Coquitlam lead - 4 photos
INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', true
FROM public.leads WHERE city = 'Coquitlam';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Coquitlam';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1532170579297-281918c8ae72?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Coquitlam';

INSERT INTO public.lead_photos (lead_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop&crop=face', false
FROM public.leads WHERE city = 'Coquitlam';

-- Done! Your database is ready.

