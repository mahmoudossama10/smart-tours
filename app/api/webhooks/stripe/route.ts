import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature") || "";
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    const bookingId = pi.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: "PAID" } });
    }
  }

  return new Response("ok");
}

export const config = {
  api: { bodyParser: false }
};
