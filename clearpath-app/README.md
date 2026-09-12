# ClearpathQR — Turn Your Viewers into Leads

High-converting dynamic QR code generator and mobile landing page platform built for YouTube creators, podcasters, educators, and high-growth brands.

---

## ⚡ Deployment Guide (Vercel, Netlify, or Cloudflare Pages)

### Step 1: Push Code to GitHub / GitLab / Bitbucket
```bash
git init
git add .
git commit -m "feat: initial ClearpathQR platform"
git branch -M main
git remote add origin https://github.com/your-username/clearpathqr.git
git push -u origin main
```

---

### Step 2: Deploy on Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import your `clearpathqr` repository.
3. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL` = `https://gprpdtqfhxdlomguzuyo.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_6LjfTzIr1-RJZK_gt7nYzg_E0gyG8tQ`
4. Build Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.

---

### Step 3: Configure Supabase Database & Security
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/gprpdtqfhxdlomguzuyo).
2. Go to **SQL Editor** -> **New query**.
3. Copy the contents of `supabase_setup.sql` into the editor and click **Run**.
4. This creates the `workflows` table, `leads` table, and enables strict **Row Level Security (RLS)** so users can only access their own data.

---

### Step 4: Configure Supabase Authentication URLs
1. In your Supabase Dashboard, navigate to:
   **Authentication** → **URL Configuration**
2. Set **Site URL**:
   `https://your-production-domain.vercel.app` (or your custom domain `https://clearpathqr.com`)
3. Under **Redirect URLs**, add:
   - `http://localhost:5173`
   - `http://localhost:5173/**`
   - `https://your-production-domain.vercel.app`
   - `https://your-production-domain.vercel.app/**`
4. If using Google OAuth:
   - In Google Cloud Console, add `https://gprpdtqfhxdlomguzuyo.supabase.co/auth/v1/callback` under **Authorized redirect URIs**.
