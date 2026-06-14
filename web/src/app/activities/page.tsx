"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/context/CompareContext";
import { Database } from "@/types/supabase";
import { Map, Ticket, Search, MapPin, Building2, Eye, Compass, Anchor, Wind, Plane, Hotel, Coffee, CarFront, Gauge } from "lucide-react";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  agency?: Database["public"]["Tables"]["agencies"]["Row"];
};

const MOCK_ACTIVITIES = [
  // Land Activities
  {
    id: "act-land-1",
    title: "Full Day Safari & Wildlife Adventure (Casela)",
    destination: "MAURITIUS",
    base_price_mur: 3500,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-act-1",
    flight_included: false,
    hotel_name: "Activity: Casela Nature Parks",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "land",
    duration: "Full Day (8 Hours)",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-act-1", name: "Wild Explorer", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-land-2",
    title: "Chamarel 7 Colored Earths & Quad Biking",
    destination: "MAURITIUS",
    base_price_mur: 4800,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-act-1",
    flight_included: false,
    hotel_name: "Activity: Chamarel Trails",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "land",
    duration: "4 Hours",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-act-1", name: "Wild Explorer", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-land-3",
    title: "Guided Hiking Trek to Le Morne Brabant",
    destination: "MAURITIUS",
    base_price_mur: 2200,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-act-1",
    flight_included: false,
    hotel_name: "Activity: UNESCO Hiking",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "land",
    duration: "3.5 Hours",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-act-1", name: "Wild Explorer", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  
  // Sea Activities
  {
    id: "act-sea-1",
    title: "Catamaran Cruise to Ile aux Cerfs & Dolphin Swim",
    destination: "MAURITIUS",
    base_price_mur: 3200,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-sea-1",
    flight_included: false,
    hotel_name: "Activity: Catamaran & Snorkeling",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "sea",
    duration: "Full Day (7 Hours)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-sea-1", name: "Ocean Breeze Cruises", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-sea-2",
    title: "Sunset Catamaran Cruise with BBQ & Live Sega",
    destination: "MAURITIUS",
    base_price_mur: 2800,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-sea-1",
    flight_included: false,
    hotel_name: "Activity: Dinner Catamaran",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "sea",
    duration: "3 Hours",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-sea-1", name: "Ocean Breeze Cruises", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-sea-3",
    title: "Underwater Sea Walk Adventure",
    destination: "MAURITIUS",
    base_price_mur: 2000,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-sea-2",
    flight_included: false,
    hotel_name: "Activity: Grand Baie Undersea Walk",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "sea",
    duration: "1.5 Hours",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-sea-2", name: "Aqua World", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },

  // Air Activities
  {
    id: "act-air-1",
    title: "Scenic Mauritius Helicopter Flight",
    destination: "MAURITIUS",
    base_price_mur: 18000,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-heli",
    flight_included: false,
    hotel_name: "Activity: Helicopter Tour",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "air",
    duration: "45 Mins Flight",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-heli", name: "HeliTours Mauritius", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-air-2",
    title: "Tandem Skydive over Mauritian Lagoons",
    destination: "MAURITIUS",
    base_price_mur: 15000,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-air-1",
    flight_included: false,
    hotel_name: "Activity: Skydive",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "air",
    duration: "2 Hours Experience",
    image: "https://images.unsplash.com/photo-1521080755838-d221117749e9?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-air-1", name: "Skydive Mauritius", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "act-air-3",
    title: "Parasailing Adventure in Belle Mare",
    destination: "MAURITIUS",
    base_price_mur: 1500,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-sea-2",
    flight_included: false,
    hotel_name: "Activity: Parasailing",
    number_of_days: 1,
    number_of_nights: 0,
    type: "ACTIVITY",
    category: "air",
    duration: "30 Mins",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-sea-2", name: "Aqua World", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  }
];

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedPackages, togglePackage } = useCompare();

  // Sync state with URL params
  useEffect(() => {
    if (initialCategory && ["all", "land", "sea", "air"].includes(initialCategory)) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredItems = MOCK_ACTIVITIES.filter(item => {
    const matchesCategory = activeCategory === "all" ? true : item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-outfit)] pb-20">
      {/* Premium Header Banner */}
      <div className="relative w-full h-[160px] md:h-[200px] bg-slate-900 overflow-hidden mb-6">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920" 
          alt="Luxury Activities Banner" 
          className="w-full h-full object-cover object-center opacity-85 select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-red-600/90 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-2 shadow-md">
            ★ HAND-PICKED HOLIDAY EXPERIENCES ★
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none mb-1 uppercase drop-shadow-md">
            Local Excursions & Activities
          </h1>
          <p className="text-[10px] md:text-xs text-slate-200 max-w-xl font-medium tracking-wide drop-shadow-sm leading-relaxed">
            From safari trails and deep-sea cruises to scenic flights – discover the best activities for your stay.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Bar & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Subcategory tabs */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto overflow-x-auto gap-1">
            {[
              { id: "all", label: "All Activities", icon: Ticket },
              { id: "land", label: "Land", icon: Compass },
              { id: "sea", label: "Sea", icon: Anchor },
              { id: "air", label: "Air", icon: Wind }
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === cat.id 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={13} /> {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600/50 outline-none text-xs font-bold uppercase tracking-wider"
            />
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-slate-100 group cursor-pointer">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-2 fill-transparent group-hover:fill-red-100 group-hover:text-red-500 transition-all" />
            <h3 className="text-xl font-black text-gray-900">No activities found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try another category or adjust your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isComparing = selectedPackages.some((p) => p.id === item.id);
              return (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col group">
                  <div className="h-44 w-full relative shrink-0 flex items-center justify-center overflow-hidden bg-slate-900">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[8px] font-black text-gray-900 uppercase tracking-widest shadow-sm flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-600"></span>
                      {item.category} Activity
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[8px] font-black text-slate-800 shadow-sm flex items-center gap-0.5">
                      <span className="text-amber-400">★</span> 4.7 <span className="text-slate-400 font-bold">(8)</span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="bg-red-50 border border-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider w-fit mb-2 block">
                        {item.agency.name}
                      </span>
                      <h3 className="text-base font-black text-gray-900 mb-1 leading-snug line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-2 leading-relaxed">
                        Explore local scenery, capture beautiful photos, and experience the best local attractions.
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-wider">
                          Best: May–Dec
                        </span>
                        <span className={`px-2 py-0.5 border rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 ${
                          item.category === 'air' ? 'text-red-600 bg-red-50 border-red-100' :
                          item.category === 'land' && item.title.includes('Hiking') ? 'text-amber-600 bg-amber-50 border-amber-100' :
                          'text-emerald-600 bg-emerald-50 border-emerald-100'
                        }`}>
                          <Gauge size={10} /> {
                            item.category === 'air' ? 'ADVENTURE' :
                            item.category === 'land' && item.title.includes('Hiking') ? 'MODERATE' :
                            'EASY'
                          }
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs text-slate-500 flex items-center font-bold">
                          <MapPin className="mr-2 w-4 h-4 text-red-500" /> {item.destination}
                        </p>
                        <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Compass className="w-3.5 h-3.5 text-red-500" /> Duration: {item.duration}
                        </p>
                      </div>
                      <div className="flex gap-2.5 mb-2.5 mt-1.5 border-t border-slate-100/50 pt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <Plane size={11} /> FLIGHT
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <Hotel size={11} /> HOTEL
                        </div>
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold tracking-wider ${item.title.toLowerCase().includes('bbq') || item.title.toLowerCase().includes('cruise') ? "text-emerald-600" : "text-slate-300"}`}>
                          <Coffee size={11} /> MEALS
                        </div>
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold tracking-wider ${item.category === 'land' || item.category === 'sea' ? "text-emerald-600" : "text-slate-300"}`}>
                          <CarFront size={11} /> TRANSFERS
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-1 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-0.5 mb-0.5">
                          ⚡ Instant Conf
                        </span>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Rate</p>
                        <p className="text-2xl font-black text-red-600">Rs {item.base_price_mur.toLocaleString()}</p>
                      </div>
                      
                      <label className="flex items-center space-x-2 cursor-pointer group/compare bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={isComparing}
                          onChange={() => togglePackage(item as unknown as Package)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/50 cursor-pointer accent-red-600"
                        />
                        <span className="text-[9px] font-black text-slate-600 group-hover/compare:text-red-600 transition-colors uppercase tracking-wider">
                          Compare
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm font-black uppercase tracking-widest animate-pulse">Loading Activities...</div>
      </div>
    }>
      <ActivitiesContent />
    </Suspense>
  );
}
