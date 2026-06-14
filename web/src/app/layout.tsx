import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "True Memories Travel & Tours | A Bridge Between Traveler & Tours and Holidays",
  description: "Mauritius multi-vendor travel marketplace. Hand-picked holiday packages, luxury cruises & unforgettable experiences departing from Mauritius.",
  openGraph: {
    title: "True Memories Travel & Tours",
    description: "Mauritius multi-vendor travel marketplace. Book your dream escape.",
    url: "https://www.truememoriestravel.mu",
    siteName: "True Memories Travel & Tours",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "True Memories Travel & Tours",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "True Memories Travel & Tours",
    description: "Mauritius multi-vendor travel marketplace.",
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-[family-name:var(--font-outfit)] ${outfit.variable} min-h-screen flex flex-col`}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  );
}
