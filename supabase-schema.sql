-- Run this entire script once in: Supabase Dashboard → SQL Editor → New query → Run
-- It is idempotent (safe to re-run).

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

create index if not exists expenses_date_idx on expenses (date desc);
create index if not exists expenses_category_idx on expenses (category);

alter table expenses enable row level security;

drop policy if exists "Public read"   on expenses;
drop policy if exists "Public insert" on expenses;
drop policy if exists "Public update" on expenses;
drop policy if exists "Public delete" on expenses;

create policy "Public read"   on expenses for select using (true);
create policy "Public insert" on expenses for insert with check (true);
create policy "Public update" on expenses for update using (true);
create policy "Public delete" on expenses for delete using (true);
