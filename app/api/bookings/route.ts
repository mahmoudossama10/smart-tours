import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

async function notifyN8n(bookingId: string) {
  const url = process.env.N8N_BOOKING_CREATED_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
      cache: "no-store",
    });
  } catch (e) {
    console.error("N8N_NOTIFY_ERROR", e);
  }
}


export async function POST(req: NextRequest) {
  try {
    const { tourId, slug, partySize, email } = await req.json();

    const tour = tourId
      ? await prisma.tour.findUnique({ where: { id: tourId } })
      : slug
      ? await prisma.tour.findUnique({ where: { slug } })
      : null;

    if (!tour) return new Response("Tour not found", { status: 404 });

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const qty = Math.max(1, Number(partySize || 1));
    const totalUSD = tour.priceUSD * qty;

    // Create a pending booking
    const booking = await prisma.booking.create({
      data: {
        tourId: tour.id,
        userId: user.id,
        startDate: new Date(),
        partySize: qty,
        totalUSD,
        provider: process.env.STRIPE_SECRET_KEY ? "stripe" : "mock",
      },
    });

    await notifyN8n(booking.id);

    // Real Stripe path (only runs if you later add keys)
    if (process.env.STRIPE_SECRET_KEY) {
      const pi = await stripe.paymentIntents.create({
        amount: totalUSD * 100,
        currency: "usd",
        metadata: { bookingId: booking.id, tourId: tour.id },
        automatic_payment_methods: { enabled: true },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentIntentId: pi.id },
      });

      return Response.json({ client_secret: pi.client_secret });
    }

    // Fake mode for local demo
    if (process.env.ALLOW_FAKE_PAYMENTS === "true") {
      const mockPiId = `pi_mock_${booking.id}`;
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentIntentId: mockPiId },
      });
      return Response.json({ client_secret: `${mockPiId}_secret_mock` });
    }

    return new Response(
      "Stripe not configured. Set STRIPE_SECRET_KEY or ALLOW_FAKE_PAYMENTS=true",
      { status: 500 }
    );
  } catch (err: any) {
    console.error("BOOKINGS_ROUTE_ERROR:", err);
    return new Response(err?.message || "Server error", { status: 500 });
  }
}
