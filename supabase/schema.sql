-- ==============================================================================
-- SUPABASE DATABASE MIGRATION SCRIPT FOR PORTFOLIO
-- Tables: sticky_notes, testimonials
-- Security: Row Level Security (RLS) & Narrowly Scoped Policies
-- ==============================================================================

-- 1. CREATE TABLE: sticky_notes
-- Note: "top" and "left" are enclosed in double quotes as reserved SQL keywords in Postgres
create table if not exists public.sticky_notes (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(trim(message)) > 0 and char_length(message) <= 280),
  author_name text default 'Visitor',
  badge text default 'COMMUNITY NOTE',
  color_class text default 'note-card-yellow',
  "top" text default '100px',
  "left" text default '100px',
  rotate integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for ordering notes
create index if not exists idx_sticky_notes_created_at on public.sticky_notes (created_at desc);

-- 2. CREATE TABLE: testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0 and char_length(name) <= 100),
  role text default 'Peer / Client',
  company text default '',
  message text not null check (char_length(trim(message)) > 0 and char_length(message) <= 1000),
  avatar_url text default '',
  rating integer default 5 check (rating >= 1 and rating <= 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now()
);

-- Index for querying approved testimonials quickly
create index if not exists idx_testimonials_status_created on public.testimonials (status, created_at desc);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.sticky_notes enable row level security;
alter table public.testimonials enable row level security;

-- 4. RLS POLICIES FOR STICKY NOTES

-- Drop existing policies if re-running
drop policy if exists "Allow public select of sticky notes" on public.sticky_notes;
drop policy if exists "Allow public insert of sticky notes" on public.sticky_notes;

-- Policy A: Anyone can read sticky notes
create policy "Allow public select of sticky notes"
  on public.sticky_notes
  for select
  to public
  using (true);

-- Policy B: Anyone can insert a valid sticky note
create policy "Allow public insert of sticky notes"
  on public.sticky_notes
  for insert
  to public
  with check (
    char_length(trim(message)) > 0 and char_length(message) <= 280
  );

-- 5. RLS POLICIES FOR TESTIMONIALS

-- Drop existing policies if re-running
drop policy if exists "Allow public select of approved testimonials" on public.testimonials;
drop policy if exists "Allow public insert of pending testimonials" on public.testimonials;

-- Policy A: Public visitors can ONLY read APPROVED testimonials
create policy "Allow public select of approved testimonials"
  on public.testimonials
  for select
  to public
  using (status = 'approved');

-- Policy B: Public visitors can insert testimonials with status forced to 'pending'
create policy "Allow public insert of pending testimonials"
  on public.testimonials
  for insert
  to public
  with check (
    status = 'pending' and
    char_length(trim(name)) > 0 and
    char_length(trim(message)) > 0 and
    char_length(message) <= 1000
  );

-- 6. SAMPLE INITIAL SEED DATA (OPTIONAL)

insert into public.sticky_notes (message, author_name, badge, color_class, "top", "left", rotate)
values
  ('💻 "It works on my machine"', 'Navin', 'IT MEME #01', 'note-card-yellow', '50px', '50px', -4),
  ('🔄 "Did you clear the cache?"', 'Dev Team', 'IT MEME #02', 'note-card-pink', '70px', '360px', 3),
  ('📧 "Meeting could have been an email"', 'Tech Lead', 'IT MEME #03', 'note-card-blue', '240px', '110px', -3),
  ('🎨 "CSS is my passion"', 'Designer', 'IT MEME #04', 'note-card-purple', '220px', '450px', 4)
on conflict do nothing;

insert into public.testimonials (name, role, company, message, rating, status)
values
  ('Sarah Jenkins', 'Lead Product Manager', 'FinTech Labs', 'Navin delivers clean, high-performance React frontend architectures with exceptional attention to UX detail.', 5, 'approved'),
  ('Rahul Verma', 'Senior Engineering Manager', 'Shaurya Technosoft', 'An extraordinary frontend engineer. Navin optimized our enterprise dashboard load time by over 60%.', 5, 'approved'),
  ('Amit Sharma', 'Founder & CEO', 'NexGate ERP', 'Pixel-perfect component quality and brilliant micro-interactions. Working with Navin was an absolute delight!', 5, 'approved')
on conflict do nothing;
