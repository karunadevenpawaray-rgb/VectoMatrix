"use client";

import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import { useCompare } from "@/context/CompareContext";
import { packageService } from "@/services/packageService";
import { useRouter } from "next/navigation";
import { Search, Loader2, Map, LayoutGrid, List, Filter, Plane, Hotel, Coffee, CarFront, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(true);
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

  return (
    <div className="w-full bg-slate-50 font-[family-name:var(--font-outfit)] pb-16">
      
      {/* Featured Minimalist Packages Auto-Slider (Moved ABOVE Hero Banner) */}
      {featuredPackages.length > 0 && (
        <div className="container mx-auto px-4 max-w-7xl pt-10 mb-8 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ea580c] block mb-2">★ HAND-PICKED PACKAGES ★</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Trending Holiday Packages</h2>
            </div>
            {/* Custom Dot indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: Math.max(1, featuredPackages.length - visibleCount + 1) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === sliderIndex ? "w-6 bg-[#ea580c]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slider viewport container with arrows on sides */}
          <div className="relative w-full px-1 sm:px-4">
            <div className="relative w-full overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out mx-[-12px]"
                style={{ transform: `translateX(-${sliderIndex * (100 / visibleCount)}%)` }}
              >
                {featuredPackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    onClick={() => router.push(`/package/${pkg.id}`)}
                    className="w-full md:w-1/2 lg:w-1/3 px-3 shrink-0 cursor-pointer flex flex-col group"
                  >
                    <div className="w-full bg-[#fbfbf9] rounded-[1.5rem] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                      {/* Top Image with cutout */}
                      <div className="relative h-60 w-full overflow-hidden bg-slate-100 shrink-0">
                        <img 
                          src={pkg.gallery_images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'} 
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Curved corner price badge */}
                        <div className="absolute bottom-0 right-0 bg-[#fbfbf9] pt-4 pl-4 rounded-tl-[1.5rem] flex items-center justify-center">
                          <span className="bg-[#ea580c] text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                            MUR {pkg.base_price_mur.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#ea580c] mb-2 block">
                            {tenant?.logoText || "BRAND"}
                          </span>
                          
                          <h3 className="text-xl font-bold tracking-tight text-slate-800 leading-snug mb-6 font-serif uppercase min-h-[56px] line-clamp-2">
                            {pkg.title}
                          </h3>

                          {/* Inclusions Grid */}
                          <div className="grid grid-cols-4 gap-2 border-t border-b border-slate-200/50 py-4 mb-6">
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-lg mb-1">✈️</span>
                              <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">Flights</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-lg mb-1">🏨</span>
                              <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">5-Star Hotels</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-lg mb-1">🍽️</span>
                              <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">Daily Meals</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-lg mb-1">🚌</span>
                              <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">Transfers</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="flex justify-between items-end text-slate-500 pt-2">
                          <div className="text-[8px] font-black tracking-widest uppercase space-y-1">
                            <p className="text-slate-800 font-extrabold">Excursions Included</p>
                            <p className="text-[#ea580c]">Limited Availability</p>
                            <p>Booking Deadline: May 17</p>
                          </div>
                          <div className="text-[8px] font-bold text-right space-y-0.5">
                            <p className="underline text-slate-400">www.travelrers.com</p>
                            <p className="font-black text-slate-800">000 398 7800</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            {featuredPackages.length > visibleCount && (
              <>
                <button
                  onClick={() =>
                    setSliderIndex((prev) => (prev - 1 + (featuredPackages.length - visibleCount + 1)) % (featuredPackages.length - visibleCount + 1))
                  }
                  className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#ea580c] text-slate-700 hover:text-[#ea580c] flex items-center justify-center transition-all shadow-md hover:shadow-lg z-20"
                >
                  <ChevronLeft size={20} className="stroke-[3]" />
                </button>
                <button
                  onClick={() =>
                    setSliderIndex((prev) => (prev + 1) % (featuredPackages.length - visibleCount + 1))
                  }
                  className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#ea580c] text-slate-700 hover:text-[#ea580c] flex items-center justify-center transition-all shadow-md hover:shadow-lg z-20"
                >
                  <ChevronRight size={20} className="stroke-[3]" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Promotional Billboard System */}
      {(!tenant || tenant.plugins.promotionalBillboards) && (
        <div className="relative w-full h-[260px] md:h-[340px] bg-slate-900 overflow-hidden group/hero">
          {billboards.length > 0 ? (
            <>
              {/* Slide Images */}
              {billboards.map((b, idx) => (
                <div
                  key={b.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentBillboardIndex ? "opacity-85 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="w-full h-full object-cover object-center select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20"></div>
                  
                  {/* Content Centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
                    <div className="bg-red-600/90 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-3 shadow-md">
                      ★ PROMOTIONAL OFFER ★
                    </div>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md uppercase">
                      {b.title}
                    </h1>
                    <p className="text-[10px] md:text-xs text-slate-200 max-w-lg md:max-w-xl font-medium tracking-wide drop-shadow-sm leading-relaxed mb-4">
                      {b.subtitle}
                    </p>
                    {b.cta_text && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(b.cta_link || "/");
                        }}
                        className="bg-red-600 text-white font-black px-6 py-2.5 rounded-full hover:bg-red-750 hover:shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider"
                      >
                        {b.cta_text}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Navigation Controls */}
              {billboards.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentBillboardIndex((prev) => (prev - 1 + billboards.length) % billboards.length)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentBillboardIndex((prev) => (prev + 1) % billboards.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 z-10"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Slider Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {billboards.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBillboardIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentBillboardIndex ? "w-6 bg-red-600" : "w-1.5 bg-white/50 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* Fallback Loader while billboards load */
            <div className="w-full h-full flex items-center justify-center bg-slate-950">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
        
        {/* ADVANCED SEARCH SIDEBAR */}
        {showFilters && (
          <div className="w-full md:w-72 flex-shrink-0 transition-all duration-300 animate-in slide-in-from-left-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center group cursor-pointer">
                <Search className="mr-2 w-5 h-5 stroke-2 fill-transparent group-hover:fill-current transition-all" /> Advanced Search
              </h2>
              
              <div className="space-y-6">
                {/* Keyword Search */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Keyword</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Safari, Shopping..."
                    className="w-full p-3 bg-slate-50 text-slate-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/50 outline-none text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Destination</label>
                  <select 
                    className="w-full p-3 bg-slate-50 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/50 outline-none text-sm font-medium"
                    value={filterDestination}
                    onChange={(e) => { setFilterDestination(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">Any Destination</option>
                    <option value="MALAYSIA">Malaysia</option>
                    <option value="DUBAI">Dubai</option>
                    <option value="SOUTH_AFRICA">South Africa</option>
                    <option value="RODRIGUES">Rodrigues</option>
                    <option value="REUNION">Reunion</option>
                  </select>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Max Budget</label>
                    <span className="text-xs font-black text-red-600">Rs {priceRange.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="10000" max="200000" step="5000"
                    className="w-full accent-red-600"
                    value={priceRange}
                    onChange={(e) => { setPriceRange(parseInt(e.target.value)); setCurrentPage(1); }}
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Hotel Class</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map(star => (
                      <label key={star} className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="radio" name="stars" value={star}
                          checked={filterStars === star.toString()}
                          onChange={(e) => { setFilterStars(e.target.value); setCurrentPage(1); }}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 accent-red-600"
                        />
                        <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">{star} Stars</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-3 cursor-pointer group pt-2 border-t border-gray-100">
                      <input 
                        type="radio" name="stars" value=""
                        checked={filterStars === ""}
                        onChange={(e) => { setFilterStars(e.target.value); setCurrentPage(1); }}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 accent-red-600"
                      />
                      <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">Any Rating</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* RESULTS AREA */}
        <div className="flex-grow min-w-0">
          
          {/* TOOLBAR */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-[72px] z-30">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${showFilters ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
            >
              <Filter size={16} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-slate-400">Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-slate-400">Sort By</span>
                <select 
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating</option>
                </select>
              </div>

              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* GRID/LIST RENDER */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg font-medium text-gray-500 flex items-center">
                <Loader2 className="mr-3 w-8 h-8 animate-spin stroke-2 text-red-600" /> Searching our global database...
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center group cursor-pointer">
              <Map className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-2 fill-transparent group-hover:fill-red-100 group-hover:text-red-500 transition-all" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-500">Try adjusting your budget or destination filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery(""); setFilterDestination(""); setFilterStars(""); setPriceRange(100000);
                }}
                className="mt-6 text-red-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div>
              <div className={viewMode === 'grid' 
                ? `grid grid-cols-1 ${showFilters ? 'lg:grid-cols-2 xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6 mb-8` 
                : "flex flex-col gap-4 mb-8"
              }>
                {packages.map((pkg) => {
                  const isComparing = selectedPackages.some((p) => p.id === pkg.id);
                  return (
                    <div key={pkg.id} onClick={() => router.push('/package/' + pkg.id)} className={`bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 border border-slate-100 group cursor-pointer ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}>
                                          <div className={`relative bg-gray-200 overflow-hidden ${viewMode === 'list' ? 'sm:w-1/3 h-48 sm:h-auto shrink-0' : 'h-48 w-full shrink-0'}`}>
                        <img 
                          src={(pkg as any).gallery_images?.[0] || (pkg as any).image_url || ({
                            'DUBAI': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
                            'MALAYSIA': 'https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800',
                            'MALDIVES': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
                            'SOUTH_AFRICA': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800',
                            'RODRIGUES': 'https://images.unsplash.com/photo-1589394815804-964ce0ff96b8?auto=format&fit=crop&q=80&w=800',
                            'REUNION': 'https://images.unsplash.com/photo-1552554746-9d33261971dd?auto=format&fit=crop&q=80&w=800',
                          }[pkg.destination] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800')} 
                          alt={pkg.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800';
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] tracking-[0.1em] uppercase font-black text-gray-800 shadow-sm">
                          {pkg.destination}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-black text-slate-800 shadow-sm flex items-center gap-0.5">
                          <span className="text-amber-400">★</span> {(pkg.hotel_stars || 4) + 0.7} <span className="text-slate-400 font-bold">(12)</span>
                        </div>
                      </div>
                      
                      <div className={`p-4 flex-grow flex flex-col justify-between ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
                        <div>
                          <span className="bg-red-50 border border-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider w-fit mb-2 block">
                            {pkg.agency?.name || 'Local Expert'}
                          </span>
                          <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1 leading-[1.1]">{pkg.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-3 mb-2 leading-relaxed">
                            {(pkg as any).description || "Relax on the beach, taste local street food, and wander through nature trails."}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-wider">
                              Best: May–Oct
                            </span>
                            <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-md text-[8px] font-black uppercase tracking-wider">
                              Small Group
                            </span>
                          </div>
                          <div className="flex gap-3 mb-2.5 mt-1 border-t border-slate-100/50 pt-2.5 flex-wrap">
                            <div className={`flex items-center gap-1 text-[9px] font-extrabold tracking-wider ${(pkg as any).flight_included !== false ? "text-emerald-600" : "text-slate-300"}`}>
                              <Plane size={12} /> FLIGHT
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] font-extrabold tracking-wider ${pkg.hotel_name || (pkg as any).service_type === 'hotel' ? "text-emerald-600" : "text-slate-300"}`}>
                              <Hotel size={12} /> HOTEL
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] font-extrabold tracking-wider ${(pkg as any).meal_plans || (pkg as any).service_type === 'hotel' ? "text-emerald-600" : "text-slate-300"}`}>
                              <Coffee size={12} /> MEALS
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] font-extrabold tracking-wider ${pkg.destination === 'SOUTH_AFRICA' || pkg.destination === 'DUBAI' || (pkg as any).service_type === 'package' ? "text-emerald-600" : "text-slate-300"}`}>
                              <CarFront size={12} /> TRANSFERS
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-1 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-0.5 mb-0.5">
                              ✓ Free Cancel
                            </span>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">Starting from</p>
                            <p className="text-xl font-black text-red-600">Rs {pkg.base_price_mur.toLocaleString()}</p>
                          </div>
                          
                          <label className="flex items-center space-x-2 cursor-pointer group/compare bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={isComparing}
                              onChange={() => togglePackage(pkg)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-red-600 focus:ring-red-600/50 cursor-pointer accent-red-600"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-[9px] font-black text-slate-600 group-hover/compare:text-red-600 transition-colors uppercase tracking-widest">
                              Compare
                            </span>
                          </label>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* PAGINATION ENGINE */}
              <div className="flex justify-center items-center space-x-4 border-t border-gray-200 pt-8 mt-8 pb-12">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                >
                  Previous
                </button>
                <span className="text-sm font-black text-gray-900 bg-slate-100 px-4 py-2 rounded-lg">
                  Page {currentPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={packages.length < itemsPerPage}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
   </div>
  );
}
