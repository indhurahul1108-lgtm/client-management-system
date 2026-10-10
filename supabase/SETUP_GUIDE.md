# Supabase Setup Guide — Client Management System

## Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New project"**
4. Fill:
   - **Name**: `client-management-system`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Southeast Asia (Singapore)
5. Click **"Create project"** → Wait ~2 minutes

---

## Step 2: Run the Database Schema

1. In Supabase → Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open file: `supabase/schema.sql` from your project
4. Copy ALL the SQL → Paste into editor → Click **"Run"**
5. You should see: *"Success. No rows returned"*

---

## Step 3: Insert Dummy Data

1. In SQL Editor → Click **"New query"** again
2. Open file: `supabase/seed.sql` from your project
3. Copy ALL the SQL → Paste → Click **"Run"**
4. This will insert all 23 users + attendance + works etc.

---

## Step 4: Get Your API Keys

1. In Supabase → **Settings** (bottom left gear icon)
2. Click **"API"**
3. Copy these 2 values:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **Project API keys → anon public**: long string starting with `eyJ...`

---

## Step 5: Add Keys to Project

Open file: `frontend/.env`

Replace the placeholder values:
```
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_key
```

Save the file.

---

## Step 6: Add Keys to Vercel (for live site)

1. Go to **https://vercel.com** → Your project
2. **Settings** → **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Click **Save** → **Redeploy**

---

## Step 7: Test Login

After setup, login with:

| Role | Mobile | Password |
|---|---|---|
| Admin | 9000000001 | admin123 |
| Manager | 9000000002 | manager123 |
| Staff | 9000000004 | staff123 |
| Client | 9100000001 | client123 |

---

## How the Auto-Switch Works

The `AuthContext.jsx` automatically detects:
- If `.env` has `YOUR_PROJECT_ID` → uses **dummy data** (works without Supabase)
- If `.env` has real Supabase URL → uses **Supabase database**

So the app works NOW with dummy data, and switches to real database once you add the keys!

---

## File Structure Created

```
frontend/src/
├── lib/
│   └── supabase.js          ← Supabase client
├── services/
│   ├── authService.js       ← Login / logout
│   ├── userService.js       ← Users CRUD
│   ├── attendanceService.js ← Punch in/out, 3-month history
│   ├── leaveService.js      ← Leave apply / approve / reject
│   ├── workService.js       ← Works CRUD + overdue calc
│   └── dataService.js       ← Notifications, salary, messages, docs
supabase/
├── schema.sql               ← All 12 tables + RLS + indexes
└── seed.sql                 ← All dummy data
```
