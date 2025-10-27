import "./globals.css";
import Link from "next/link";
import FakeModeBanner from "@/components/FakeModeBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FakeModeBanner />
        <header className="border-b">
          <nav className="max-w-5xl mx-auto p-4 flex gap-4">
            <a href="/">Smart Tours</a>
            <a href="/">Tours</a>
            <a href="/admin/bookings" className="ml-auto underline">Admin</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
