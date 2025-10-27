"use client";

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = pubKey ? loadStripe(pubKey) : null;

type WrapperProps = {
  clientSecret: string;
  onPaid?: (paymentIntentId: string) => void;
};

function MockPay({ clientSecret, onPaid }: WrapperProps) {
  // clientSecret looks like: pi_mock_<bookingId>_secret_mock
  const paymentIntentId = clientSecret.startsWith("pi_mock_")
    ? clientSecret.replace(/_secret.*$/i, "") // strip any "_secret_*" suffix safely
    : clientSecret;

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const simulate = async () => {
    setLoading(true);
    try {
      await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      onPaid?.(paymentIntentId);
      setMsg("Payment processed! (mock)");
    } catch (e: any) {
      setMsg(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border p-4 bg-white">
        <p className="text-sm text-gray-700">
          Fake payments enabled — click below to simulate a successful charge.
        </p>
      </div>
      <button
        onClick={simulate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {loading ? "Processing..." : "Simulate payment"}
      </button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}

function RealPay({ clientSecret, onPaid }: WrapperProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMsg(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/checkout/success" },
      redirect: "if_required",
    });

    if (result.error) {
      setMsg(result.error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    let paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId && typeof (elements as any)?._clientSecret === "string") {
      const cs: string = (elements as any)._clientSecret;
      if (cs.startsWith("pi_") && cs.includes("_secret")) {
        paymentIntentId = cs.split("_secret")[0];
      }
    }

    if (paymentIntentId) {
      await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      }).catch(() => {});
      onPaid?.(paymentIntentId);
    }

    setMsg("Payment processed!");
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <button type="submit" disabled={!stripe || loading} className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50">
        {loading ? "Processing..." : "Pay now"}
      </button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </form>
  );
}

export default function PaymentElementWrapper({ clientSecret, onPaid }: WrapperProps) {
  const isMock = clientSecret.startsWith("pi_mock_");

  // If mock OR no publishable key, show the mock flow
  if (isMock || !pubKey || !stripePromise) {
    return <MockPay clientSecret={clientSecret} onPaid={onPaid} />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { variables: { colorPrimary: "#111827", borderRadius: "12px" } },
      }}
    >
      <RealPay clientSecret={clientSecret} onPaid={onPaid} />
    </Elements>
  );
}
