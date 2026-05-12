# SpendSmart — AI Spend Audit Tool

SpendSmart is a free web app that audits what startup founders and engineering managers are paying for AI tools — surfacing overspend, recommending cheaper alternatives, and quantifying total monthly and annual savings. It's a lead-generation asset for Credex: users who discover significant savings are directed to Credex's discounted AI credits.

**Live:** [https://spendsmart.vercel.app](https://spendsmart.vercel.app) <!-- update with your actual Vercel URL -->

---

## Screenshots

> Add 3+ screenshots or a [30-second Loom/YouTube recording](https://loom.com) here before submitting.
>
> Suggested shots:
> 1. Audit form filled out with a multi-tool stack
> 2. Audit results page showing the savings hero + per-tool breakdown
> 3. Lead capture form / shareable URL preview card

---

## Quick Start

### Prerequisites

- Node.js 20+
- A Supabase project (for lead storage)
- A Resend account (for transactional email)
- A Google Gemini API key (for AI summaries)

### Install & run locally

```bash
# 1. Clone
git clone https://github.com/steverogersX/SpendSmart
cd SpendSmart

# 2. Install all workspaces
cd shared && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Configure backend
cp backend/.env.example backend/.env
# Fill in: DB_HOST, DB_PASSWORD, RESEND_API_KEY, GEMINI_API_KEY, CORS_ORIGIN

# 4. Configure frontend
# backend URL for local dev is already set to http://localhost:5000
# frontend/.env.local is already committed for local use

# 5. Run (two terminals)
cd backend && npm run dev      # Express on :5000
cd frontend && npm run dev     # Next.js on :3000
```

### Run tests

```bash
cd backend && npm test
```

### Deploy

**Frontend → Vercel**

```bash
cd frontend && npx vercel --prod
```

Set these environment variables in Vercel:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel deployment URL |

**Backend → Render**

Push to `main` — CI triggers a Render deploy automatically via webhook (see `.github/workflows/ci.yml`). Or deploy manually:

```bash
# Render reads render.yaml from the repo root
git push origin main
```

Set these environment variables in Render:

| Key | Description |
|---|---|
| `DB_HOST` | Supabase Postgres host |
| `DB_PASSWORD` | Supabase Postgres password |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Sender address (e.g. `SpendSmart <hello@yourdomain.com>`) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CORS_ORIGIN` | Your Vercel URL |

**Database migrations**

```bash
cd backend && npm run db:migrate
```

---

## Decisions

### 1. `useCases` lives at the plan level, not the tool level

Early draft had `useCases` on the vendor object (`"gemini": { "useCases": ["coding", ...] }`). That was wrong — Gemini Plus has no IDE integration, so tagging the whole Gemini tool as supporting coding would cause the engine to recommend Gemini Plus for a developer. Moving `useCases` to each plan entry means the engine only surfaces plans that actually fit the use case.

### 2. One row per subscription, `mixed` use case instead of per-task rows

If a user adds Claude Pro three times — once for writing, once for coding, once for research — the engine would compute savings for each row independently and sum them, implying they could save money by splitting their workload across cheaper tools. But they're paying one $20 subscription that covers all three tasks; moving each to a separate tool would cost more. The fix: instruct users to add each subscription once and select `mixed` if they use it for multiple purposes.

### 3. API recommendations are capability-constrained, not just cheapest

For API users, finding the cheapest model ignores whether it can do the job. A user on Claude Opus 4.7 for coding is there because they need that capability. Recommending a $5/month model that fails on their actual work isn't a recommendation — it's noise. The engine scores each model using benchmark data (SWE-bench for coding, EQ-Bench for writing, MMLU-Pro for research), normalizes to a 0–1 scale, and only surfaces alternatives that are within 5% of the current model's capability score. Then it picks the cheapest one that clears that floor.

### 4. Rate limiting over hCaptcha for abuse protection

hCaptcha adds a visible challenge step — friction right at the moment users have just run an audit and are about to submit their email. At this scale, rate limiting (30 audits / 5 leads per IP per 15 minutes) stops automated abuse without touching the conversion flow for real users. The choice is documented in the backend server config. If this scales to a public launch target, the rate limits can be tightened or hCaptcha added as a second layer.

### 5. Monorepo with a `shared/` package for Zod schemas and TypeScript types

The audit request schema and result types are validated on the backend and consumed on the frontend. Duplicating them would mean two sources of truth that can drift. A local `shared/` workspace package imported by both `frontend` and `backend` keeps the contract in one place. It's a small overhead upfront that eliminates a whole class of type mismatch bugs as the schema evolves.
