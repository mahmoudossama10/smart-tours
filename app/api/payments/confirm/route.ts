import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();
    if (!paymentIntentId) return new Response("paymentIntentId required", { status: 400 });

    // ---- MOCK FLOW ----
    if (paymentIntentId.startsWith("pi_mock_")) {
      const bookingId = paymentIntentId.replace(/^pi_mock_/, "");

      // ensure booking exists and is well-formed
      const existing = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, tourId: true, status: true },
      });
      if (!existing) return new Response("Booking not found", { status: 404 });

      // safety: do not change tourId; only status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" },
      });

      return Response.json({ ok: true, status: "succeeded (mock)" });
    }

    // ---- REAL STRIPE FLOW ----
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status === "succeeded") {
      const bookingId = (pi.metadata as any)?.bookingId;
      if (!bookingId) return new Response("Missing bookingId metadata", { status: 400 });

      const existing = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, tourId: true, status: true },
      });
      if (!existing) return new Response("Booking not found", { status: 404 });

      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" },
      });

      return Response.json({ ok: true, status: pi.status });
    }

    return Response.json({ ok: false, status: pi.status });
  } catch (e: any) {
    console.error("CONFIRM_ERROR", e);
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
