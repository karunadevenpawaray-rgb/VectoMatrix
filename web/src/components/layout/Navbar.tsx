"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useI18n } from "@/context/I18nContext";
import { useRouter, usePathname } from "next/navigation";
import { LockKeyhole, Heart, Menu, X, Phone, Mail } from "lucide-react";

// Previously imported but removed from UI to reduce clutter:
// import { Globe, Camera, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { selectedPackages } = useCompare();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCompareClick = () => {
    if (selectedPackages.length > 0) {
      const ids = selectedPackages.map((p) => p.id).join(",");
      router.push(`/compare?ids=${ids}`);
    }
  };

  /* Scroll listener — switches navbar from transparent (hero) to white (scrolled) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  const navLinks = [
    { href: "/", label: "Holiday Packages" },
    { href: "/cruises", label: "Cruises" },
    { href: "/transfers", label: "Transfers" },
    { href: "/activities", label: "Activities" },
    { href: "/dashboard", label: t("myTrips") },
  ];

  return (
    <>
      {/* ===== MAIN NAVBAR ===== */}
      <nav
        className={`w-full sticky top-0 z-50 px-4 md:px-8 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent py-5"
            : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── LOGO ── */}
          {/* Old spinning-circle logo commented out:
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-dashed animate-spin-slow flex items-center justify-center mr-2">
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
          </div>
          */}
          <Link href="/" className="flex flex-col">
            <span className={`text-[22px] font-black leading-none tracking-tighter transition-colors ${isTransparent ? "text-white" : "text-slate-900"}`}>
              TRUE<span className={`${isTransparent ? "text-white/60" : "text-slate-400"}`}>MEMORIES</span>
            </span>
            <span className="text-[10px] font-black text-[#ea580c] uppercase tracking-[0.15em] mt-0.5 whitespace-nowrap">
              Travel &amp; Tours
            </span>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className={`hidden lg:flex items-center gap-7 text-sm font-bold transition-colors ${isTransparent ? "text-white/90" : "text-slate-700"}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#ea580c] ${
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-[#ea580c]"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="http://localhost:3001/b2b"
              className="flex items-center gap-1.5 hover:text-[#ea580c] transition-colors"
            >
              Agency Access <LockKeyhole size={13} className="stroke-2" />
            </Link>
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2.5">

            {/* Contact pill — visible on large screens */}
            <a
              href="tel:+23058169420"
              className={`hidden xl:flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all ${
                isTransparent
                  ? "bg-white/15 backdrop-blur-sm text-white border border-white/25 hover:bg-white/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Phone size={13} />
              +230 58 16 94 20
            </a>

            {/* Request a Quote CTA */}
            <button
              onClick={() => router.push("/checkout")}
              className="hidden md:block bg-[#ea580c] text-white font-black px-5 py-2.5 rounded-full hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 text-sm"
            >
              Get a Quote
            </button>

            {/* Compare / Wishlist badge */}
            <button
              onClick={handleCompareClick}
              aria-label="View compare list"
              className={`relative p-2.5 rounded-full transition-all hover:scale-110 ${
                isTransparent
                  ? "bg-white/15 backdrop-blur-sm text-white hover:bg-white/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Heart size={17} fill="currentColor" />
              {selectedPackages.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ea580c] text-[10px] font-black text-white shadow">
                  {selectedPackages.length}
                </span>
              )}
            </button>

            {/* Language selector */}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "fr" | "ar")}
              className={`hidden sm:block border-none outline-none cursor-pointer text-xs font-bold bg-transparent focus:ring-0 transition-colors ${
                isTransparent ? "text-white/80" : "text-slate-500"
              }`}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden p-2.5 rounded-full transition-all ${
                isTransparent
                  ? "bg-white/15 backdrop-blur-sm text-white hover:bg-white/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">
              TRUE<span className="text-slate-400">MEMORIES</span>
            </span>
            <span className="text-[10px] font-black text-[#ea580c] uppercase tracking-[0.15em] mt-0.5">
              Travel &amp; Tours
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-4 py-4 gap-1 flex-grow overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                  ? "bg-orange-50 text-[#ea580c]"
                  : "text-slate-700 hover:bg-slate-50 hover:text-[#ea580c]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="http://localhost:3001/b2b"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 hover:text-[#ea580c] transition-all"
          >
            Agency Access <LockKeyhole size={13} />
          </Link>
        </nav>

        {/* Drawer footer — contact + CTA */}
        <div className="px-6 py-6 border-t border-slate-100 space-y-3">
          <a href="tel:+23058169420" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#ea580c] transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ea580c]">
              <Phone size={14} />
            </div>
            +230 58 16 94 20
          </a>
          <a href="mailto:karunadevenpawaray@gmail.com" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#ea580c] transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ea580c]">
              <Mail size={14} />
            </div>
            <span className="truncate">karunadevenpawaray@gmail.com</span>
          </a>
          <button
            onClick={() => { router.push("/checkout"); setMobileOpen(false); }}
            className="w-full mt-2 bg-[#ea580c] text-white font-black py-3 rounded-xl text-sm hover:bg-orange-600 transition-colors active:scale-95"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </>
  );
}
