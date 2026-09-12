-- =========================================================
-- ClearpathQR Database Schema & Row Level Security (RLS)
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor
-- =========================================================

-- 1. Create Workflows Table (Stores user channel data, tapframe pages, and CRM leads)
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'ClearpathQR User Workflow',
  current_step integer default 1,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint workflows_user_id_key unique (user_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.workflows enable row level security;

-- 3. Security Policies for Workflows

-- SELECT: Signed-in users can only view their own workflows
create policy "Users can view their own workflows"
on public.workflows
for select
to authenticated
using (auth.uid() = user_id);

-- INSERT: Signed-in users can only insert rows for their own user_id
create policy "Users can create their own workflows"
on public.workflows
for insert
to authenticated
with check (auth.uid() = user_id);

-- UPDATE: Signed-in users can only update their own workflows
create policy "Users can update their own workflows"
on public.workflows
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- DELETE: Signed-in users can only delete their own workflows
create policy "Users can delete their own workflows"
on public.workflows
for delete
to authenticated
using (auth.uid() = user_id);

-- 4. Optional: Create Leads table for direct relational querying
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  page_title text not null,
  campaign_name text,
  channel_id text,
  email text not null,
  name text,
  source text default 'Mobile QR Scan',
  referrer text,
  device text default 'mobile',
  country text default 'United States',
  city text,
  created_at timestamptz default now() not null
);

-- Enable RLS on Leads table
alter table public.leads enable row level security;

-- Public can insert leads when scanning QR code without logging in
create policy "Public can submit leads via QR code"
on public.leads
for insert
to anon, authenticated
with check (true);

-- Authenticated creators can view all leads captured by their pages
create policy "Authenticated users can read captured leads"
on public.leads
for select
to authenticated
using (true);

-- 5. Auto updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at
before update on public.workflows
for each row
execute function public.handle_updated_at();
