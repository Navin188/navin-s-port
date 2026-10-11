# Supabase Setup Guide for Portfolio

Follow these simple steps to link your Supabase account to this portfolio project.

---

## Step 1: Create a Supabase Project

1. Sign up or log in at [https://supabase.com](https://supabase.com).
2. Click **New Project**.
3. Choose your project name (e.g., `navin-portfolio`) and set a secure database password.
4. Select your preferred region and click **Create new project**.

---

## Step 2: Run the SQL Database Migration

1. In your Supabase Dashboard side menu, click **SQL Editor**.
2. Click **New query**.
3. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/acer/OneDrive/Desktop/navin's%20folder/supabase/schema.sql) and paste it into the editor.
4. Click **Run**.
5. This creates the `sticky_notes` and `testimonials` tables, sets up Row Level Security (RLS) policies, and populates initial sample data.

---

## Step 3: Get Your Project URL & Publishable Key

1. In Supabase Dashboard, click **Project Settings** (gear icon) → **API**.
2. Copy the following two values:
   - **Project URL**: `https://<project-ref>.supabase.co`
   - **Publishable Key (Anon Key)**: `eyJhbGciOi...`

---

## Step 4: Configure Local `.env` File

1. Open `.env` in the root folder of your project (or duplicate `.env.example` as `.env`).
2. Replace placeholder credentials with your actual Supabase keys:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-actual-anon-publishable-key>
```

3. Restart your development server (`npm run dev`).

---

## Step 5: Testimonials Moderation

When visitors submit a testimonial on your portfolio, it enters the `testimonials` database table with `status = 'pending'`.

### How to Approve or Moderate Testimonials:

#### Option A: Supabase Table Editor (Easiest)
1. Go to **Table Editor** → `testimonials`.
2. Find the pending testimonial row.
3. Double-click the `status` column cell and change it from `pending` to `approved`.

#### Option B: SQL Editor
To approve all pending testimonials or a specific one by ID:

```sql
-- Approve a specific testimonial by ID
UPDATE public.testimonials
SET status = 'approved'
WHERE id = 'insert-uuid-here';

-- View all pending testimonials
SELECT * FROM public.testimonials WHERE status = 'pending';
```
