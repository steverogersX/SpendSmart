# Deployment Guide

Two services: **Backend → Railway**, **Frontend → Vercel**

---

## Step 1 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repo
3. Click **Add Service** → pick your repo again if needed
4. In the service settings:
   - **Root Directory**: `/backend`
   - Railway will auto-detect `railway.toml` and use the build/start commands
5. Go to **Variables** tab and add all of these:

```
NODE_ENV=production
CORS_ORIGIN=https://YOUR-APP.vercel.app     ← fill in after Step 2
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=<your supabase db password>
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=SpendSmart <hello@yourdomain.com>
```

6. Deploy → Railway will build and start the server
7. Copy your Railway public URL (e.g. `https://spendsmart-backend.up.railway.app`)

---

## Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. In the project settings:
   - **Root Directory**: `frontend`
   - Framework Preset: Next.js (auto-detected)
3. Add these environment variables:

```
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.up.railway.app   ← from Step 1
NEXT_PUBLIC_BASE_URL=https://YOUR-APP.vercel.app              ← your Vercel URL (set after first deploy)
```

4. Click **Deploy**
5. Copy your Vercel URL

---

## Step 3 — Wire CORS

Go back to Railway → your backend service → **Variables** → update:

```
CORS_ORIGIN=https://YOUR-APP.vercel.app
```

Redeploy the backend (Railway does this automatically on variable change).

---

## CI

GitHub Actions runs on every push/PR to `main`:
- Lints + builds frontend (Next.js)
- Lints + builds backend (TypeScript)
- Runs tests for both

Vercel and Railway both auto-deploy when you push to `main`.
