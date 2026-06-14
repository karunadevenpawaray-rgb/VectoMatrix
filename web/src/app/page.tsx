"use client";

import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import { useCompare } from "@/context/CompareContext";
import { packageService } from "@/services/packageService";
import { useRouter } from "next/navigation";
import {
  Search, Loader2, Map, LayoutGrid, List, Filter,
  Plane, Hotel, Coffee, CarFront, ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { mockEngine, saasConfigManager } from "@vectormatrix/mock-engine";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  agency: Database["public"]["Tables"]["agencies"]["Row"];
};

export default function Home() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Tenant config state
  const [tenant, setTenant] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  // Billboards State
  const [billboards, setBillboards] = useState<any[]>([]);
  const [currentBillboardIndex, setCurrentBillboardIndex] = useState(0);

  // Minimalist Featured Packages Slider State
  const [featuredPackages, setFeaturedPackages] = useState<any[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDestination, setFilterDestination] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterStars, setFilterStars] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(100000); // Max price

  // Advanced Grid Controls
  const [showFilters, setShowFilters] = useState(false); // collapsed by default — less clutter on load
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Pagination Engine
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedPackages, togglePackage } = useCompare();

  useEffect(() => {
    fetchPackages();
  }, [searchQuery, filterDestination, filterMonth, filterStars, priceRange, currentPage, itemsPerPage, sortBy]);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const list = await (mockEngine as any).getBillboards();
        setBillboards(list || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBillboards();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const list = await mockEngine.getPackages();
        setFeaturedPackages(list || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
  }, []);

  // Load SaaS Active Tenant dynamically & handle window responsive widths
  useEffect(() => {
    setTenant(saasConfigManager.getActiveTenant());
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (billboards.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBillboardIndex((prev) => (prev + 1) % billboards.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [billboards]);

  // Legacy auto-slider logic commented out for safety:
  /*
  useEffect(() => {
    if (featuredPackages.length <= 3) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % (featuredPackages.length - 2));
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPackages]);
  */

  // New responsive auto-slider logic:
  useEffect(() => {
    const maxIndex = Math.max(0, featuredPackages.length - visibleCount);
    if (maxIndex === 0) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % (maxIndex + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPackages, visibleCount]);

  const fetchPackages = async () => {
    setLoading(true);

    const filters = {
      searchQuery,
      filterDestination,
      filterMonth,
      filterStars,
      priceRange,
      sortBy
    };

    const { paginatedData } = await packageService.getFilteredPackages(filters, currentPage, itemsPerPage);

    setPackages(paginatedData as Package[]);
    setLoading(false);
  };

  /* ─── Destination data for the inspiration strip ─── */
  const destinations = [
    { name: "Dubai", emoji: "🏙️", dest: "DUBAI", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600" },
    { name: "Malaysia", emoji: "🌴", dest: "MALAYSIA", img: "https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=600" },
    { name: "South Africa", emoji: "🦁", dest: "SOUTH_AFRICA", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=600" },
    { name: "Rodrigues", emoji: "🏝️", dest: "RODRIGUES", img: "https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=600" },
    { name: "Réunion", emoji: "🌋", dest: "REUNION", img: "https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=600" },
    { name: "Maldives", emoji: "🤿", dest: "MALDIVES", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=600" },
  ];

  /* ─── Per-destination curated image pool (multiple per destination for variety) ─── */
  const destImages: Record<string, string[]> = {
    DUBAI: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800", // Burj Khalifa skyline
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800", // Dubai Marina
      "https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?auto=format&fit=crop&q=80&w=800", // Dubai desert dunes
      "https://images.unsplash.com/photo-1577724893765-2ec9484acfb5?auto=format&fit=crop&q=80&w=800", // Dubai at night
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800", // Luxury resort
      "https://images.unsplash.com/photo-1448901592608-07b1b7ae3640?auto=format&fit=crop&q=80&w=800", // Palm Jumeirah
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // Traditional market
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=800", // Dubai Creek
    ],
    MALAYSIA: [
      "https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800", // KL Petronas towers
      "https://images.unsplash.com/photo-1555400038-063f5f1a5cb3?auto=format&fit=crop&q=80&w=800", // KL skyline dusk
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=800", // Langkawi beach
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", // Malaysian rainforest
      "https://images.unsplash.com/photo-1585079540032-9e02d9d3e74d?auto=format&fit=crop&q=80&w=800", // George Town street art
      "https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800", // Island beach
      "https://images.unsplash.com/photo-1551641142-c8f40c70d730?auto=format&fit=crop&q=80&w=800", // Tea plantation
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // Night market
    ],
    SOUTH_AFRICA: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800", // Cape Town Table Mountain
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800", // African lion safari
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800", // Kruger Park safari
      "https://images.unsplash.com/photo-1531804226-23eb1b1cddbe?auto=format&fit=crop&q=80&w=800", // Cape Town aerial
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // Cape Winelands
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=800", // Boulders Beach penguins
      "https://images.unsplash.com/photo-1448901592608-07b1b7ae3640?auto=format&fit=crop&q=80&w=800", // Garden Route
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800", // Safari lodge
    ],
    RODRIGUES: [
      "https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800", // Rodrigues lagoon
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", // tropical beach
      "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80&w=800", // island paradise
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800", // ocean beach
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // fishing village
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=800", // mountain landscape
      "https://images.unsplash.com/photo-1448901592608-07b1b7ae3640?auto=format&fit=crop&q=80&w=800", // local market
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800", // cliff views
    ],
    REUNION: [
      "https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800", // Réunion volcano
      "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800", // Réunion coast
      "https://images.unsplash.com/photo-1467220369-2081f2a53bc9?auto=format&fit=crop&q=80&w=800", // tropical waterfall
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800", // island aerial
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // mountain trail
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=800", // forest canopy
      "https://images.unsplash.com/photo-1448901592608-07b1b7ae3640?auto=format&fit=crop&q=80&w=800", // coastal road
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800", // volcanic crater
    ],
    MALDIVES: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800", // overwater bungalows
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800", // crystal water
      "https://images.unsplash.com/photo-1540202404-d0f7b90b3028?auto=format&fit=crop&q=80&w=800", // Maldives aerial
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800", // Maldives sunset
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", // underwater marine life
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=800", // beach picnic
      "https://images.unsplash.com/photo-1448901592608-07b1b7ae3640?auto=format&fit=crop&q=80&w=800", // luxury resort
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800", // diving experience
    ],
  };

  /* ─── Robust image resolver — case-insensitive, rotates by pkg.id, never shows plane interior ─── */
  const pkgImage = (pkg: any): string => {
    // 1. Use actual package image if present and looks valid
    const direct = pkg.gallery_images?.[0] || pkg.image_url;
    if (direct && typeof direct === "string" && direct.startsWith("http")) return direct;
    // 2. Destination-based fallback (case-insensitive)
    const key = String(pkg.destination || "").toUpperCase().replace(/\s+/g, "_");
    const imgs = destImages[key];
    if (imgs && imgs.length > 0) {
      // Rotate by id so each card shows a different image for the same destination
      const idx = Math.abs((pkg.id || 0)) % imgs.length;
      return imgs[idx];
    }
    // 3. Generic scenic travel fallback (NOT a plane interior)
    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800";
  };

  /* ─── Per-pkg onError: loads destination-specific image, prevents infinite loops ─── */
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>, pkg: any) => {
    const key = String(pkg.destination || "").toUpperCase().replace(/\s+/g, "_");
    const imgs = destImages[key];
    const fallback = imgs?.[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800";
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback;
    }
    e.currentTarget.onerror = null; // prevent infinite error loop
  };

  /* ────────────────────────────────────────────── */
  /*  RENDER                                        */
  /* ────────────────────────────────────────────── */
  return (
    <div className="w-full bg-white font-[family-name:var(--font-outfit)]">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — CINEMATIC HERO
          Billboard images as full-screen background.
          Navbar sits on top (sticky, transparent).
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {false && (
        <section className="relative h-[92vh] min-h-[600px] max-h-[960px] overflow-hidden -mt-[104px]">

          {/* Background — billboard images */}
          {billboards.length > 0 ? (
            billboards.map((b, idx) => (
              <div
                key={b.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBillboardIndex ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={b.image_url}
                  alt={b.title}
                  className="w-full h-full object-cover object-center pointer-events-none"
                />
              </div>
            ))
          ) : (
            /* Gradient fallback while billboards load */
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-700 to-amber-500" />
          )}

          {/* Overlay — keep it light enough for the white-background feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />

          {/* ── Hero content ── */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">

            <span className="inline-block bg-[#ea580c] text-white text-xs font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full mb-6 shadow-lg shadow-orange-600/30 animate-fadeInUp">
              ✈ Mauritius Trusted Travel Agency Since 1995
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.9] tracking-tight mb-6 max-w-4xl animate-fadeInUp animation-delay-100">
              Discover Your<br />
              <span className="text-[#ea580c]">Perfect Escape</span>
            </h1>

            <p className="text-white/80 text-base md:text-lg font-medium mb-10 max-w-xl leading-relaxed animate-fadeInUp animation-delay-200">
              Hand-picked holiday packages, luxury cruises &amp; unforgettable experiences — all departing from Mauritius
            </p>

            {/* Quick-jump destination pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-fadeInUp animation-delay-300">
              {destinations.map((d) => (
                <button
                  key={d.dest}
                  id={`hero-dest-${d.dest.toLowerCase()}`}
                  onClick={() => {
                    setFilterDestination(d.dest);
                    setCurrentPage(1);
                    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#ea580c] hover:border-[#ea580c] transition-all duration-300 hover:-translate-y-0.5"
                >
                  {d.emoji} {d.name}
                </button>
              ))}
              <button
                onClick={() => router.push("/checkout")}
                className="bg-[#ea580c] text-white font-black text-sm px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-orange-600/40"
              >
                Request a Quote →
              </button>
            </div>

            {/* Billboard navigation dots */}
            {billboards.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {billboards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBillboardIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBillboardIndex ? "w-8 bg-[#ea580c]" : "w-2 bg-white/40 hover:bg-white"
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Billboard left/right arrows */}
            {billboards.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentBillboardIndex((prev) => (prev - 1 + billboards.length) % billboards.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentBillboardIndex((prev) => (prev + 1) % billboards.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Scroll indicator */}
            <div className="absolute bottom-8 right-8 animate-bounce text-white/50">
              <ChevronDown size={22} />
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — DESTINATION INSPIRATION STRIP
          Click any card to jump to filtered packages.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="destinations" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-[#ea580c] text-[11px] font-black uppercase tracking-[0.25em] block mb-3">
              ✦ EXPLORE THE WORLD ✦
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Where Will You Go?
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-lg mx-auto">
              Choose your dream destination and we&apos;ll handle everything from flights to experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {packages.slice(0, 6).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => router.push(`/package/${pkg.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-slate-100/80 text-left flex flex-col"
              >
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img
                    src={pkgImage(pkg)}
                    alt={pkg.title}
                    onError={(e) => handleImgError(e, pkg)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm">
                    {pkg.destination}
                  </div>
                  {(pkg as any).is_featured && (
                    <div className="absolute top-4 right-4 bg-[#ea580c] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-2 leading-snug min-h-[56px]">
                    {pkg.title}
                  </h3>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).flight_included !== false ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                      ✈ Flight
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${pkg.hotel_name ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                      🏨 Hotel
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).meal_plan ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                      🍽 {(pkg as any).meal_plan || "No Meals"}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-0.5">Starting from</p>
                      <p className="text-2xl font-black text-[#ea580c]">
                        Rs {pkg.base_price_mur?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#ea580c] text-white font-black text-sm px-5 py-2.5 rounded-full group-hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
                      Explore →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — FEATURED PACKAGES SLIDER
          Moved below hero (correct UX flow: inspire → browse).
          Minimal cards: photo + title + price + CTA only.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {featuredPackages.length > 0 && (
        <section className="py-20 bg-orange-50/40 px-4">
          <div className="max-w-7xl mx-auto">

            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[#ea580c] text-[11px] font-black uppercase tracking-[0.25em] block mb-3">
                  ✦ HAND-PICKED FOR YOU ✦
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Trending Packages
                </h2>
              </div>

              {/* Slider dot indicators */}
              <div className="flex gap-2 pb-1">
                {Array.from({ length: Math.max(1, featuredPackages.length - visibleCount + 1) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSliderIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === sliderIndex ? "w-8 bg-[#ea580c]" : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Slider viewport */}
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${sliderIndex * (100 / visibleCount)}%)` }}
                >
                  {featuredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      style={{ width: `${100 / visibleCount}%` }}
                      className="shrink-0 px-3"
                    >
                      <div
                        onClick={() => router.push(`/package/${pkg.id}`)}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-slate-100/80"
                      >
                        {/* Image — uses shared pkgImage() resolver */}
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={pkgImage(pkg)}
                            alt={pkg.title}
                            onError={(e) => handleImgError(e, pkg)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          {/* Destination badge */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm">
                            {pkg.destination}
                          </div>
                          {/* Featured ribbon */}
                          {(pkg as any).is_featured && (
                            <div className="absolute top-4 right-4 bg-[#ea580c] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="p-6">
                          <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-2 leading-snug min-h-[56px]">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-400 font-semibold mb-0.5">Starting from</p>
                              <p className="text-2xl font-black text-[#ea580c]">
                                Rs {pkg.base_price_mur?.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-[#ea580c] text-white font-black text-sm px-5 py-2.5 rounded-full group-hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
                              Explore →
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider navigation arrows */}
              {featuredPackages.length > visibleCount && (
                <>
                  <button
                    onClick={() =>
                      setSliderIndex((prev) =>
                        (prev - 1 + (featuredPackages.length - visibleCount + 1)) %
                        (featuredPackages.length - visibleCount + 1)
                      )
                    }
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#ea580c] hover:text-[#ea580c] flex items-center justify-center shadow-md transition-all z-10"
                  >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() =>
                      setSliderIndex((prev) =>
                        (prev + 1) % (featuredPackages.length - visibleCount + 1)
                      )
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#ea580c] hover:text-[#ea580c] flex items-center justify-center shadow-md transition-all z-10"
                  >
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — ALL PACKAGES GRID
          Filters collapsed by default.
          Clean cards — no fake data, readable font sizes.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="packages" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-12">
            <span className="text-[#ea580c] text-[11px] font-black uppercase tracking-[0.25em] block mb-3">
              ✦ ALL PACKAGES ✦
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Find Your Perfect Holiday
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              Filter by destination, budget or hotel class
            </p>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-[60px] z-30">
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${showFilters
                  ? "bg-[#ea580c] text-white shadow-sm shadow-orange-500/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Filter size={15} />
              {showFilters ? "Hide Filters" : "Filter & Search"}
            </button>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
              >
                <option value="recommended">⭐ Recommended</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>

              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  id="view-grid-btn"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-[#ea580c]" : "text-slate-400 hover:text-slate-700"}`}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  id="view-list-btn"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#ea580c]" : "text-slate-400 hover:text-slate-700"}`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Filter Panel (collapsible horizontal) ── */}
          {showFilters && (
            <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Keyword */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    🔍 Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="Safari, Beach, Shopping..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    🌍 Destination
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition cursor-pointer"
                    value={filterDestination}
                    onChange={(e) => { setFilterDestination(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">Any Destination</option>
                    <option value="MALAYSIA">🌴 Malaysia</option>
                    <option value="DUBAI">🏙️ Dubai</option>
                    <option value="SOUTH_AFRICA">🦁 South Africa</option>
                    <option value="RODRIGUES">🏝️ Rodrigues</option>
                    <option value="REUNION">🌋 Réunion</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                      💰 Max Budget
                    </label>
                    <span className="text-sm font-black text-[#ea580c]">Rs {priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="10000" max="200000" step="5000"
                    className="w-full accent-orange-500 mt-3"
                    value={priceRange}
                    onChange={(e) => { setPriceRange(parseInt(e.target.value)); setCurrentPage(1); }}
                  />
                </div>

                {/* Hotel Class — pill buttons */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    ⭐ Hotel Class
                  </label>
                  <div className="flex gap-2">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className="flex-1 cursor-pointer">
                        <input
                          type="radio" name="stars" value={star}
                          checked={filterStars === star.toString()}
                          onChange={(e) => { setFilterStars(e.target.value); setCurrentPage(1); }}
                          className="sr-only"
                        />
                        <span className={`block text-center py-2.5 rounded-xl text-sm font-black border-2 transition-all ${filterStars === star.toString()
                            ? "bg-[#ea580c] text-white border-[#ea580c]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300"
                          }`}>
                          {star}★
                        </span>
                      </label>
                    ))}
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio" name="stars" value=""
                        checked={filterStars === ""}
                        onChange={(e) => { setFilterStars(e.target.value); setCurrentPage(1); }}
                        className="sr-only"
                      />
                      <span className={`block text-center py-2.5 rounded-xl text-sm font-black border-2 transition-all ${filterStars === ""
                          ? "bg-[#ea580c] text-white border-[#ea580c]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300"
                        }`}>
                        All
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Active filter chips ── */}
          {(filterDestination || filterStars || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filterDestination && (
                <span className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-black px-4 py-1.5 rounded-full">
                  🌍 {filterDestination}
                  <button onClick={() => setFilterDestination("")} className="hover:text-orange-800 transition-colors">✕</button>
                </span>
              )}
              {filterStars && (
                <span className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-black px-4 py-1.5 rounded-full">
                  ⭐ {filterStars} Stars
                  <button onClick={() => setFilterStars("")} className="hover:text-orange-800 transition-colors">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-black px-4 py-1.5 rounded-full">
                  🔍 &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} className="hover:text-orange-800 transition-colors">✕</button>
                </span>
              )}
              <button
                onClick={() => { setSearchQuery(""); setFilterDestination(""); setFilterStars(""); setPriceRange(100000); }}
                className="text-xs font-black text-slate-400 hover:text-slate-700 underline transition-colors px-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* ── Results ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#ea580c] animate-spin" />
              <p className="text-slate-500 font-semibold text-sm">Finding your perfect package...</p>
            </div>

          ) : packages.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🗺️</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">No packages found</h3>
              <p className="text-slate-500 mb-8 text-base max-w-xs mx-auto">Try adjusting your filters — we have plenty of great options!</p>
              <button
                onClick={() => { setSearchQuery(""); setFilterDestination(""); setFilterStars(""); setPriceRange(100000); }}
                className="bg-[#ea580c] text-white font-black px-8 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-sm"
              >
                Clear All Filters
              </button>
            </div>

          ) : (
            <div>
              {/* ── GRID VIEW ── */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                    : "flex flex-col gap-4 mb-12"
                }
              >
                {packages.map((pkg) => {
                  const isComparing = selectedPackages.some((p) => p.id === pkg.id);
                  const img = pkgImage(pkg);

                  if (viewMode === "grid") {
                    return (
                      /* ── Grid Card ── */
                      <div
                        key={pkg.id}
                        id={`pkg-card-${pkg.id}`}
                        onClick={() => router.push("/package/" + pkg.id)}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 group cursor-pointer flex flex-col"
                      >
                        {/* Image area */}
                        <div className="relative h-52 overflow-hidden shrink-0">
                          <img
                            src={img}
                            alt={pkg.title}
                            onError={(e) => handleImgError(e, pkg)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-slate-800">
                            {pkg.destination}
                          </div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-slate-800 flex items-center gap-1">
                            <span className="text-amber-400">★</span> {(pkg.hotel_stars || 4)}
                          </div>
                        </div>

                        {/* Card content */}
                        <div className="p-5 flex flex-col flex-grow">
                          <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wider mb-1.5">
                            {pkg.agency?.name || "Local Expert"}
                          </span>
                          <h3 className="font-black text-slate-900 text-base leading-snug mb-4 line-clamp-2 min-h-[48px] flex-grow">
                            {pkg.title}
                          </h3>

                          {/* Inclusions — clean pill strip */}
                          <div className="flex gap-2 mb-4 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).flight_included !== false ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              ✈ Flight
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${pkg.hotel_name ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              🏨 Hotel
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).meal_plan ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              🍽 {(pkg as any).meal_plan || "No Meals"}
                            </span>
                          </div>

                          {/* Price + compare */}
                          <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                            <div>
                              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Starting from</p>
                              <p className="text-xl font-black text-[#ea580c]">Rs {pkg.base_price_mur.toLocaleString()}</p>
                            </div>
                            <label
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-[#ea580c] transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isComparing}
                                onChange={() => togglePackage(pkg)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 accent-orange-500 rounded"
                              />
                              <span className="text-[11px] font-black uppercase tracking-wider">Compare</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* ── List Card ── */
                  return (
                    <div
                      key={pkg.id}
                      id={`pkg-list-${pkg.id}`}
                      onClick={() => router.push("/package/" + pkg.id)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-100 flex flex-col sm:flex-row"
                    >
                      <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
                        <img
                          src={img}
                          alt={pkg.title}
                          onError={(e) => handleImgError(e, pkg)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-slate-800">
                          {pkg.destination}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wider mb-1 block">
                            {pkg.agency?.name || "Local Expert"}
                          </span>
                          <h3 className="font-black text-slate-900 text-lg mb-2 leading-snug">{pkg.title}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                            {(pkg as any).description || "Relax on the beach, taste local street food, and wander through nature trails."}
                          </p>
                          <div className="flex gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).flight_included !== false ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              ✈ Flight
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${pkg.hotel_name ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              🏨 Hotel
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(pkg as any).meal_plan ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-300"}`}>
                              🍽 {(pkg as any).meal_plan || "No Meals"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400 font-semibold">Starting from</p>
                            <p className="text-2xl font-black text-[#ea580c]">Rs {pkg.base_price_mur.toLocaleString()}</p>
                          </div>
                          <button className="bg-[#ea580c] text-white font-black text-sm px-6 py-2.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                            Explore →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Pagination ── */}
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-sm text-slate-700 disabled:opacity-40 hover:border-[#ea580c] hover:text-[#ea580c] transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm font-black text-slate-900 bg-orange-50 border border-orange-100 px-5 py-3 rounded-xl">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={packages.length < itemsPerPage}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-sm text-slate-700 disabled:opacity-40 hover:border-[#ea580c] hover:text-[#ea580c] transition-all shadow-sm active:scale-95"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — TRUST STRIP
          Social proof before footer.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 bg-slate-900 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "30+", label: "Years of Experience" },
            { stat: "5,000+", label: "Happy Travellers" },
            { stat: "50+", label: "Destinations Covered" },
            { stat: "IATA", label: "Accredited Agency" },
          ].map((item) => (
            <div key={item.stat} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-[#ea580c] mb-1">{item.stat}</span>
              <span className="text-sm text-slate-400 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
