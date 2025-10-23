-- Drop restrictive policies
drop policy if exists "only server can write claims" on public.lead_claims;
drop policy if exists "only server can update" on public.leads;

-- Allow clinics to create claims for their own clinic
create policy "clinic can create claim"
  on public.lead_claims for insert
  with check (
    exists (
      select 1 from public.clinics
      where clinics.id = lead_claims.clinic_id
        and clinics.clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Allow clinics to read their own claims
create policy "clinic can read own claims"
  on public.lead_claims for select
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = lead_claims.clinic_id
        and clinics.clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- Allow updating lead status when claiming
create policy "can update lead status on claim"
  on public.leads for update
  using (status = 'available')
  with check (status = 'claimed');

-- Allow clinics to create their own profile
create policy "clinic can create self"
  on public.clinics for insert
  with check (clerk_user_id = auth.jwt()->>'sub');

