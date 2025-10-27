"use client";

import { useEffect, useRef, useState } from "react";
import PaymentElementWrapper from "@/components/PaymentElement";

export default function CheckoutLoader({
  slug,                // tour slug
  email = "buyer@example.com",
  partySize = 2,
}: {
  slug: string;
  email?: string;
  partySize?: number;
}) {
  const [clientSecret, setCS] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;           // guard: run exactly once
    ran.current = true;

    (async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, partySize, email }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to create booking");
        }
        const data = await res.json();
        setCS(data.client_secret);
      } catch (e: any) {
        setError(e?.message || "Unknown error");
      }
    })();
  }, [slug, partySize, email]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!clientSecret) return <p className="text-sm text-gray-500">Preparing checkout…</p>;
  return <PaymentElementWrapper clientSecret={clientSecret} />;
}
