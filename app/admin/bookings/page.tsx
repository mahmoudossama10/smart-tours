import { prisma } from "@/lib/db";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { tour: true, user: true },
    take: 100,
  });

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Tour</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Party</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">PI</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{fmt(b.createdAt)}</td>
                <td className="p-3">{b.tour?.title || "—"}</td>
                <td className="p-3">{b.user?.email || "—"}</td>
                <td className="p-3">{b.partySize}</td>
                <td className="p-3">${b.totalUSD}</td>
                <td className="p-3">
                  <span
                    className={[
                      "px-2 py-1 rounded text-xs",
                      b.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : b.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : b.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800",
                    ].join(" ")}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">{b.paymentIntentId || "—"}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={7}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
