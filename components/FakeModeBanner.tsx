export default function FakeModeBanner() {
  if (process.env.NEXT_PUBLIC_FAKE_MODE !== "true" && process.env.ALLOW_FAKE_PAYMENTS !== "true") return null;
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm py-2">
      <div className="max-w-5xl mx-auto px-4">
        ⚠️ Demo mode: payments are simulated (no real charges).
      </div>
    </div>
  );
}
