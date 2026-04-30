# Cost Diary — Home Construction Tracker

Track every rupee spent building your home. Next.js 14 + Tailwind + Supabase. Deploys to Vercel in 2 minutes.

## What you get

- 22 categories covering everything from Bhumi Pujan to interiors (with 100+ subcategories).
- Add an expense in 5 seconds: amount, category, description, who you paid, payment mode.
- Dashboard with **total spent**, **this month**, **per-category breakdown**.
- Full searchable / filterable list, with **CSV export** for backup.
- Mobile-friendly — works great on your phone while at the site.

## Setup (one-time, ~10 minutes)

### 1. Create a Supabase project (free)

1. Go to <https://supabase.com> → **Start your project** → sign in with GitHub.
2. Click **New project**. Name it `cost-diary`, choose a strong DB password (save it somewhere), pick the closest region (Mumbai / Singapore for India).
3. Wait ~2 min for the project to provision.

### 2. Create the table

1. In your Supabase project: left sidebar → **SQL Editor** → **New query**.
2. Open `supabase-schema.sql` from this repo, copy everything, paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."

### 3. Get your API keys

In Supabase: left sidebar → **Project Settings** → **API**. Copy:
- **Project URL** (something like `https://abcdxyz.supabase.co`)
- **publishable** key (starts with `sb_publishable_...`)

### 4. Configure locally

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and paste in your URL and anon key.

### 5. Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Add your first expense.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or use the Vercel CLI).
2. Go to <https://vercel.com> → **Add new** → **Project** → import the repo.
3. **Important:** in the Vercel project setup, expand **Environment Variables** and add the same two variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Click **Deploy**. Done — you'll get a URL like `cost-diary-xxx.vercel.app`.

That URL is **public** by design (you asked for an open site). Anyone with the URL can add/edit/delete entries. Don't share it widely.

## Daily use

- **Dashboard** (`/`): add expense, see totals.
- **All entries** (`/expenses`): filter, search, export to CSV.

## Tech notes

- Data is stored in your Supabase Postgres database. Free tier handles thousands of rows.
- Row-Level Security is on, with public read/write policies (because the site is open).
- If later you want to lock it down with login: add Supabase Auth and tighten the policies. (Not needed now.)
- Backup: hit **Export CSV** every now and then. Or in Supabase: **Database** → **Backups** (paid plans) or just **Table Editor** → **Export to CSV**.
