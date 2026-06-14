"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useI18n } from "@/context/I18nContext";
import { useRouter, usePathname } from "next/navigation";
import { LockKeyhole, Phone, Mail, Globe, Camera, Heart, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { selectedPackages } = useCompare();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const handleCompareClick = () => {
    if (selectedPackages.length > 0) {
      const ids = selectedPackages.map((p) => p.id).join(",");
      router.push(`/compare?ids=${ids}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-[#1a1f2e] text-white py-2 px-4 md:px-6 flex justify-between items-center text-[10px] md:text-xs font-semibold tracking-wide">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span className="hidden md:inline">+230 2124070</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            <span className="hidden md:inline">inbound@travellounge.mu</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Globe size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
          <Camera size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value as any)}
            className="bg-[#1a1f2e] text-white border-none outline-none cursor-pointer focus:ring-0 text-[10px] md:text-xs"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">AR</option>
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-white px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-dashed animate-spin-slow flex items-center justify-center mr-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black leading-none tracking-tighter text-slate-900">TRUE<span className="text-slate-500">MEMORIES</span></span>
              <span className="text-[11px] font-black text-orange-400 uppercase tracking-[0.09em] mt-0.5 whitespace-nowrap">Travel & Tours</span>
            </div>
          </Link>
        </div>

        {/* Desktop Links mapped to Vectomatrix routes */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-900">
          <Link href="/" className={`transition-colors ${pathname === "/" ? "text-red-600" : "hover:text-red-600"}`}>
            Holiday Packages
          </Link>
          <Link href="/cruises" className={`transition-colors ${pathname === "/cruises" ? "text-red-600" : "hover:text-red-600"}`}>
            Cruises
          </Link>
          <Link href="/transfers" className={`transition-colors ${pathname === "/transfers" ? "text-red-600" : "hover:text-red-600"}`}>
            Transfers
          </Link>
          <Link href="/activities" className={`transition-colors ${pathname.startsWith("/activities") ? "text-red-600" : "hover:text-red-600"}`}>
            Activities
          </Link>
          <Link href="/dashboard" className={`transition-colors ${pathname === "/dashboard" ? "text-red-600" : "hover:text-red-600"}`}>
            {t('myTrips')}
          </Link>
          <Link href="http://localhost:3001/b2b" className="flex items-center gap-1 hover:text-red-600 transition-colors group">
            Agency Access <LockKeyhole size={14} className="stroke-2 fill-transparent group-hover:fill-current transition-all" />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => router.push('/checkout')} className="hidden md:block bg-red-600 text-white font-black px-6 py-3 rounded-full hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95 text-sm">
            Request a Quote
          </button>
          
          <button
            onClick={handleCompareClick}
            className="relative bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 transition-colors hover:-translate-y-1 shadow-md active:scale-95"
          >
            <Heart size={18} fill="currentColor" />
            {selectedPackages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow">
                {selectedPackages.length}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
