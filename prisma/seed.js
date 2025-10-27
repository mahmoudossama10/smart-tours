// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.tourImage.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { email: "demo@smarttours.local", name: "Demo User" }
  });

  await prisma.tour.create({
    data: {
      slug: "giza-pyramids-day-tour",
      title: "Giza Pyramids Day Tour",
      city: "Cairo",
      durationHours: 6,
      priceUSD: 120,
      rating: 4.9,
      summary: "Discover the Great Pyramids and the Sphinx with an expert guide.",
      images: { create: [{ url: "https://source.unsplash.com/800x500/?giza,pyramids,egypt" }] }
    }
  });

  await prisma.tour.create({
    data: {
      slug: "luxor-temples-sunrise",
      title: "Luxor Temples at Sunrise",
      city: "Luxor",
      durationHours: 4,
      priceUSD: 95,
      rating: 4.8,
      summary: "Explore Karnak & Luxor temples in the golden morning light.",
      images: { create: [{ url: "https://source.unsplash.com/800x500/?luxor,temple,egypt" }] }
    }
  });

  await prisma.tour.create({
    data: {
      slug: "nile-dinner-cruise",
      title: "Nile Dinner Cruise",
      city: "Cairo",
      durationHours: 3,
      priceUSD: 80,
      rating: 4.7,
      summary: "Evening cruise with dinner and live entertainment on the Nile.",
      images: { create: [{ url: "https://source.unsplash.com/800x500/?nile,boat,egypt" }] }
    }
  });

  console.log("Seeded user and tours. Demo user:", user.email);
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
