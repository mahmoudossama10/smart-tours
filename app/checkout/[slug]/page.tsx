// app/checkout/[slug]/page.tsx
import { prisma } from "@/lib/db";
import PaymentElementWrapper from "@/components/PaymentElement";
import CheckoutLoader from "@/components/CheckoutLoader";

export const dynamic = "force-dynamic"; // avoid caching the server fetch

function getBaseUrl() {
  // Prefer explicit env; fallback to localhost in dev
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

async function createIntent(tourId: string, email: string, partySize: number) {
  const res = await fetch(`${getBaseUrl()}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tourId, email, partySize }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json() as Promise<{ client_secret: string }>;
}

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  const tour = await prisma.tour.findUnique({ where: { slug: params.slug } });
  if (!tour) return <main className="p-6">Tour not found.</main>;

  // Minimal demo values; swap for your own form if you want
  const { client_secret } = await createIntent(
    tour.id,
    "buyer@example.com",
    2
  );

   return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="text-gray-600">{tour.title} — ${tour.priceUSD} per person</p>

      {/* This creates/loads a booking exactly once from the client */}
      <CheckoutLoader slug={tour.slug} />
    </main>
  );
}
