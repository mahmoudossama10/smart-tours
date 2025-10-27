# Smart Tours — Day‑1 MVP

A super-focused MVP you can finish **today**: browse seeded tours, AI chat helper, simple checkout with Stripe (test mode), and operational webhooks (n8n-ready).

## Tech
- **Next.js (App Router)** for web + API
- **Prisma + SQLite** for fast local DB
- **Stripe** (test mode) for payments
- **OpenAI** for AI Concierge (easily swappable later)
- **n8n** flow example (booking alert)
- Optional: add PayPal/Authorize.net & supplier imports on day 2+

## Quick Start

1) Create the app and install deps:
```bash
# Node 18+
npx create-next-app@latest smart-tours --ts --eslint --tailwind --app --src-dir=false --import-alias "@/*"
# When prompted, choose defaults. After it creates the folder, replace its contents with this zip's files
```

2) Copy these files into the generated `smart-tours` folder (overwrite).

3) Install dependencies:
```bash
cd smart-tours
npm i prisma @prisma/client stripe zod openai @upstash/ratelimit ioredis
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

4) Env vars (create `.env.local` based on `.env.example`):
```bash
cp .env.example .env.local
# Fill in keys (OpenAI + Stripe test)
```

5) Seed data:
```bash
npm run seed
```

6) Test flow
- Visit `http://localhost:3000` to see tours
- Open a tour → try **Chat** (mock tools + OpenAI)
- Checkout with Stripe test card: `4242 4242 4242 4242`

## Stripe Webhooks
Create a test webhook and point it to:
```
/api/webhooks/stripe
```
With the relevant signing secret in `.env.local`.

## n8n (Optional, today if time allows)
- Import `n8n/flows/booking_alert.json`
- Set the webhook URL in `app/api/bookings/route.ts` (POST to your n8n endpoint).

## Next Steps (post‑MVP)
- Add WordPress (headless) via WPGraphQL for CMS pages
- Add PayPal / Authorize.net through the same payments interface
- Supplier availability (Viator/GYG/Bókun) read-only import → nightly sync via n8n
- Redis cache + pgvector (when switching DB to Postgres)
