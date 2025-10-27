# Smart Tours — Web & AI Developer MVP

AI-powered tours marketplace for Egypt (Giza, Luxor, Nile), built with **Next.js**, **Prisma**, and **(mockable) Stripe**.  
Includes an **AI concierge API**, **n8n automation hook**, supplier API **sync stubs**, and an **admin bookings** view.

---

## ✨ Features (mapped to the job requirements)

- **Next.js (App Router) + Tailwind v4** UI (WordPress not used; modern Next.js chosen).
- **Prisma + SQLite** schema: `Tour`, `TourImage`, `User`, `Booking`.
- **Checkout flow**: creates **PENDING** booking → (mock) **Simulate payment** → **PAID**.
- **Payments**: Stripe-ready; runs fully **without Stripe** via `ALLOW_FAKE_PAYMENTS=true`.
- **AI Concierge**: `/api/ai/chat` (OpenAI with safe **mock fallback**).
- **Automations (n8n)**: app POSTs `{ bookingId }` to Webhook on booking creation.
- **Supplier integrations (stubs)**: Viator / GetYourGuide / Bokun adapters + `/api/suppliers/sync`.
- **SEO/UX**: dynamic metadata, `sitemap.xml`, `robots.txt`.
- **Security basics**: password-gated `/admin`, simple API rate-limit example.
- **Developer-friendly**: seed data, fake mode banner, clean modules.

---

## 🧱 Tech Stack

- **Next.js 14**, **React**, **Tailwind CSS v4**
- **Prisma** ORM + **SQLite** (dev)
- **Stripe** (optional; mockable)
- **n8n** (webhook automation)
- **OpenAI** (optional; mockable)

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v20+**
- npm
- (Optional) n8n running locally (`http://localhost:5678`) for webhook testing

### 1) Install & env
```bash
npm i
cp .env.example .env.local   # then edit .env.local as needed

### 2) Database & seed
```bash
npx prisma migrate dev --name init
npm run seed

### 3) Run the app
```bash
npm run dev
# http://localhost:3000

---

## ⚙️ Environment

# Base
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin password (for /admin and admin read API)
ADMIN_PASSWORD=letmein

# --- Payments ---
# Enable fully local fake checkout (no Stripe account required)
ALLOW_FAKE_PAYMENTS=true
# Optional UI banner:
NEXT_PUBLIC_FAKE_MODE=true

# Stripe (optional, for real payments later)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# STRIPE_SECRET_KEY=sk_test_xxx
# STRIPE_WEBHOOK_SECRET=whsec_xxx

# --- AI Concierge ---
# Force mock replies (no external calls)
AI_FORCE_MOCK=true
# Real provider (optional; if set and AI_FORCE_MOCK=false)
# OPENAI_API_KEY=sk-xxx

# --- n8n Webhook (optional) ---
# N8N_BOOKING_CREATED_WEBHOOK=http://localhost:5678/webhook/booking.created
