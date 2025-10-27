"use client";

import { useEffect, useState } from "react";

export default function ConfirmPaymentOnLoad({ paymentIntentId }: { paymentIntentId?: string }) {
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!paymentIntentId) {
        setMsg("No payment_intent found in URL (that’s OK if you already saw a success message).");
        return;
      }
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!ignore) {
          setMsg(
            res.ok
              ? `Server verification: ${data.status || "ok"}`
              : `Verification failed: ${await res.text()}`
          );
        }
      } catch (e: any) {
        if (!ignore) setMsg(`Error: ${e?.message || "unknown"}`);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [paymentIntentId]);

  return <p className="text-sm text-gray-600">{msg}</p>;
}
