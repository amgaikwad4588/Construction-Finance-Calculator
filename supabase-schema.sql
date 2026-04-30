-- Run this entire script once in: Supabase Dashboard → SQL Editor → New query → Run
-- It is idempotent (safe to re-run after schema updates).

-- =======================================================
-- 1. profiles table (one per person / project / building)
-- =======================================================
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default '🏠',
  color text not null default '#0f172a',
  created_at timestamptz not null default now()
);

create index if not exists profiles_created_at_idx on profiles (created_at);

alter table profiles enable row level security;

drop policy if exists "Public read"   on profiles;
drop policy if exists "Public insert" on profiles;
drop policy if exists "Public update" on profiles;
drop policy if exists "Public delete" on profiles;

create policy "Public read"   on profiles for select using (true);
create policy "Public insert" on profiles for insert with check (true);
create policy "Public update" on profiles for update using (true);
create policy "Public delete" on profiles for delete using (true);

-- =======================================================
-- 2. expenses table
-- =======================================================
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  category text not null,
  subcategory text,
  description text not null,
  paid_to text,
  amount numeric(12,2) not null check (amount >= 0),
  payment_mode text,
  notes text,
  created_at timestamptz not null default now()
);

-- Add profile_id link (nullable so existing rows don't break)
alter table expenses add column if not exists profile_id uuid references profiles(id) on delete set null;

create index if not exists expenses_date_idx on expenses (date desc);
create index if not exists expenses_category_idx on expenses (category);
create index if not exists expenses_profile_id_idx on expenses (profile_id);

alter table expenses enable row level security;

drop policy if exists "Public read"   on expenses;
drop policy if exists "Public insert" on expenses;
drop policy if exists "Public update" on expenses;
drop policy if exists "Public delete" on expenses;

create policy "Public read"   on expenses for select using (true);
create policy "Public insert" on expenses for insert with check (true);
create policy "Public update" on expenses for update using (true);
create policy "Public delete" on expenses for delete using (true);

-- =======================================================
-- 3. Backfill: assign any orphan expenses to a default profile
-- =======================================================
do $$
declare default_id uuid;
begin
  if exists (select 1 from expenses where profile_id is null) then
    select id into default_id from profiles order by created_at limit 1;
    if default_id is null then
      insert into profiles (name, icon) values ('My House', '🏠') returning id into default_id;
    end if;
    update expenses set profile_id = default_id where profile_id is null;
  end if;
end $$;
