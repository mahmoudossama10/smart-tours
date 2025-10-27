import { prisma } from "@/lib/db";
import PaymentElementWrapper from "@/components/PaymentElement";

async function createIntent(tourId: string, email: string, partySize: number) {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tourId, email, partySize }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const tour = await prisma.tour.findUnique({ where: { slug: params.slug } });
  if (!tour) return <div className="p-6">Tour not found.</div>;

  // For demo: a single test email & party size 2; you can keep your form if you prefer
  const { client_secret } = await createIntent(tour.id, "demo@buyer.local", 2);

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="text-gray-600">{tour.title} — ${tour.priceUSD} per person</p>
      <PaymentElementWrapper clientSecret={client_secret} />
    </main>
  );
}
