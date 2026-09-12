-- =========================================================================
-- ClearpathQR Complete Schema Setup (Pages, Workflows, Leads, Realtime)
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor
-- =========================================================================

-- 1. Create Public Pages Table (Stores every QR Tapframe page with public read access)
create table if not exists public.pages (
  id text primary key,
  slug text unique not null,
  user_id uuid,
  channel_id text,
  title text,
  campaign_name text,
  badge_text text,
  headline text,
  subheadline text,
  product_links jsonb default '[]'::jsonb,
  lead_capture_enabled boolean default true,
  lead_capture_fields jsonb default '{"collect_email": true, "collect_name": false, "collect_phone": false}'::jsonb,
  lead_magnet_title text,
  lead_capture_button_text text,
  associated_content jsonb,
  channel_data jsonb,
  total_scans integer default 0,
  total_leads integer default 0,
  total_clicks integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on Pages
alter table public.pages enable row level security;

-- Drop existing policies if any
drop policy if exists "Public can read pages" on public.pages;
drop policy if exists "Anyone can insert pages" on public.pages;
drop policy if exists "Anyone can update pages" on public.pages;

-- Allow anyone (including anonymous mobile scanners) to read pages by slug
create policy "Public can read pages"
on public.pages for select
to anon, authenticated
using (true);

-- Allow inserting and updating pages
create policy "Anyone can insert pages"
on public.pages for insert
to anon, authenticated
with check (true);

create policy "Anyone can update pages"
on public.pages for update
to anon, authenticated
using (true)
with check (true);


-- 2. Create Workflows Table (Stores user channels, settings, and workspace state)
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

alter table public.workflows enable row level security;

drop policy if exists "Users can view their own workflows" on public.workflows;
drop policy if exists "Users can create their own workflows" on public.workflows;
drop policy if exists "Users can update their own workflows" on public.workflows;
drop policy if exists "Users can delete their own workflows" on public.workflows;
drop policy if exists "Public can view workflows for resolution" on public.workflows;

-- Allow creators to manage their own workflows
create policy "Users can view their own workflows"
on public.workflows for select to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own workflows"
on public.workflows for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own workflows"
on public.workflows for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own workflows"
on public.workflows for delete to authenticated
using (auth.uid() = user_id);

-- Also allow anonymous public lookup on workflows as fallback for dynamic QR scans
create policy "Public can view workflows for resolution"
on public.workflows for select to anon
using (true);


-- 3. Create Leads Table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  page_title text not null,
  campaign_name text,
  channel_id text,
  email text not null,
  name text,
  phone text,
  source text default 'Mobile QR Scan',
  referrer text default 'TV Screen',
  device text default 'mobile',
  country text default 'Global Viewer',
  city text,
  created_at timestamptz default now() not null
);

alter table public.leads add column if not exists phone text;

alter table public.leads enable row level security;

drop policy if exists "Public can submit leads via QR code" on public.leads;
drop policy if exists "Authenticated users can read captured leads" on public.leads;

create policy "Public can submit leads via QR code"
on public.leads for insert to anon, authenticated
with check (true);

create policy "Authenticated users can read captured leads"
on public.leads for select to authenticated
using (true);


-- 4. Safely Enable Realtime Replication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pages'
  ) then
    alter publication supabase_realtime add table public.pages;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'workflows'
  ) then
    alter publication supabase_realtime add table public.workflows;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;


-- 5. Auto updated_at triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.workflows;
create trigger set_updated_at
before update on public.workflows
for each row execute function public.handle_updated_at();

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row execute function public.handle_updated_at();
