-- ==============================================================================
-- SUPABASE MIGRATION: PORTFOLIO REELS TABLE & STORAGE POLICIES
-- ==============================================================================

-- 1. CREATE TABLE: portfolio_reels
create table if not exists public.portfolio_reels (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  title text not null check (char_length(trim(title)) > 0 and char_length(title) <= 150),
  description text default '',
  category text not null check (category in ('corporateand-fun', 'poetryand-feeling')),
  video_path text not null,
  thumbnail_path text default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for fast, ordered querying by category and publication status
create index if not exists idx_portfolio_reels_lookup 
  on public.portfolio_reels (category, is_published, sort_order asc);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.portfolio_reels enable row level security;

-- 3. RLS POLICIES FOR REELS
drop policy if exists "Allow public select of published reels" on public.portfolio_reels;
create policy "Allow public select of published reels"
  on public.portfolio_reels
  for select
  to public
  using (is_published = true);

-- 4. STORAGE BUCKET CONFIGURATION (portfolio-reels)
-- Ensure storage bucket exists and is publicly readable
insert into storage.buckets (id, name, public)
values ('portfolio-reels', 'portfolio-reels', true)
on conflict (id) do update set public = true;

-- Storage Policy: Allow public read access to portfolio-reels bucket
drop policy if exists "Public Access to portfolio-reels" on storage.objects;
create policy "Public Access to portfolio-reels"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio-reels');
