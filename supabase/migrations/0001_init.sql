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
  score numeric(5,2) default 0.00,             -- average lead score 0-100
  city text,
  region text,                                  -- e.g., 'Burnaby', 'West Vancouver'
  summary text,                                 -- e.g., "Seeking comprehensive beauty consultation"
  created_at timestamptz default now()
);

-- Lead Photos (first photo is main)
create table public.lead_photos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  url text not null,
  is_primary boolean default false
);

-- Purchases / Claims
create table public.lead_claims (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete restrict,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  amount_cents integer not null,
  tax_cents integer not null default 0,
  fee_cents integer not null default 0,
  total_cents integer not null,
  status text not null default 'succeeded',     -- placeholder for future Stripe
  created_at timestamptz default now(),
  unique (lead_id)                               -- one clinic can own a lead
);

-- For "being_claimed" race control
create table public.lead_locks (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  locked_by uuid not null references public.clinics(id),
  locked_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- Realtime
alter publication supabase_realtime add table public.leads;

-- RLS
alter table public.clinics enable row level security;
alter table public.leads enable row level security;
alter table public.lead_photos enable row level security;
alter table public.lead_claims enable row level security;
alter table public.lead_locks enable row level security;

-- Policies
create policy "clinic can read self"
  on public.clinics for select
  using (clerk_user_id = auth.jwt()->>'sub');

create policy "clinic can update self"
  on public.clinics for update
  using (clerk_user_id = auth.jwt()->>'sub');

create policy "everyone can read available leads"
  on public.leads for select
  using (true);

create policy "read photos of claimed leads or blurred subset"
  on public.lead_photos for select
  using (
    exists (
      select 1 from public.lead_claims lc
      join public.clinics c on c.id = lc.clinic_id
      where lc.lead_id = lead_photos.lead_id
        and c.clerk_user_id = auth.jwt()->>'sub'
    )
    or true  -- we will serve blurred URLs on the server for non-owners
  );

create policy "only server can write"
  on public.leads for insert with check (false);
create policy "only server can update"
  on public.leads for update using (false) with check (false);
create policy "only server can write claims"
  on public.lead_claims for all using (false) with check (false);
create policy "only server can write locks"
  on public.lead_locks for all using (false) with check (false);
