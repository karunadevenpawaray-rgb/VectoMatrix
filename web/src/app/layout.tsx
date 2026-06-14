import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "True Memories Travel & Tours | A Bridge Between Traveler & Tours and Holidays",
  description: "Mauritius multi-vendor travel marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-[family-name:var(--font-outfit)] ${outfit.variable} min-h-screen flex flex-col`}>
        <I18nProvider>
          <CompareProvider>
            <Navbar />
            <main className="flex-1 bg-white">
              {children}
            </main>
            <Footer />
            <FloatingActions />
          </CompareProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
