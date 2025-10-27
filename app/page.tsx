import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

const localBySlug: Record<string, string> = {
  "giza-pyramids-day-tour": "/images/giza.jpg",
  "luxor-temples-sunrise": "/images/luxor.jpeg",
  "nile-dinner-cruise": "/images/nile.jpg",
};

export default async function Home() {
  const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Smart Tours</h1>
      <p className="text-sm text-gray-500 mb-6">Day-1 MVP — Egypt highlights</p>

      <div className="grid gap-6 md:grid-cols-3">
        {tours.map((t) => {
          const img = localBySlug[t.slug] ?? "/images/giza.jpg"; // <-- force local
          return (
            <Link key={t.id} href={`/tours/${t.slug}`} className="rounded-2xl border hover:shadow transition-shadow p-4">
              <div className="relative w-full h-36 md:h-40 mb-3">
                <Image src={img} alt={t.title} fill sizes="(min-width:768px) 33vw, 100vw" className="rounded-xl object-cover" />
              </div>
              <h3 className="font-medium">{t.title}</h3>
              <p className="text-sm text-gray-600">{t.city} • {t.durationHours}h</p>
              <p className="text-sm mt-1">${t.priceUSD} per person</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
