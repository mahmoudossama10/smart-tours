"use client";
import { useState } from "react";
import { z } from "zod";

export default function CheckoutForm({ tourId, priceUSD }: { tourId: string; priceUSD: number }) {
  const [email, setEmail] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [status, setStatus] = useState<string | null>(null);

  const inputSchema = z.object({
    email: z.string().email(),
    partySize: z.number().int().min(1).max(10),
  });

  async function onSubmit() {
    const parsed = inputSchema.safeParse({ email, partySize });
    if (!parsed.success) {
      setStatus("Please enter a valid email and party size.");
      return;
    }
    setStatus("Creating booking...");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tourId, partySize, email }),
    });
    const data = await res.json();
    if (data?.client_secret) {
      setStatus("Payment intent created (Stripe test). In a real app, open Payment Element here.");
    } else {
      setStatus("Failed to create booking.");
    }
  }

  return (
    <div className="space-y-3 border p-4 rounded-xl">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Party size</label>
        <input type="number" value={partySize} min={1} max={10} onChange={e => setPartySize(parseInt(e.target.value || "1"))} className="w-full border rounded px-3 py-2" />
      </div>
      <button onClick={onSubmit} className="bg-black text-white px-4 py-2 rounded">Pay ${"{priceUSD}"} per person</button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
