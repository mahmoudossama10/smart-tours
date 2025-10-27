import ConfirmPaymentOnLoad from "@/components/ConfirmPaymentOnLoad";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent?: string | string[]; redirect_status?: string | string[] };
}) {
  const pi = Array.isArray(searchParams.payment_intent)
    ? searchParams.payment_intent[0]
    : searchParams.payment_intent;

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Payment Success</h1>
      <p className="text-gray-600">
        Thanks! If needed, we’ll double-check your payment status below.
      </p>
      <ConfirmPaymentOnLoad paymentIntentId={pi} />
      <a href="/" className="inline-block mt-4 underline">Back to home</a>
    </main>
  );
}
