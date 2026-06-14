"use client";

import { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { Database } from "@/types/supabase";
import { Ship, Waves, Star, Anchor, Search, MapPin, Building2, Compass, Plane, Hotel, Coffee, CarFront } from "lucide-react";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  agency?: Database["public"]["Tables"]["agencies"]["Row"];
};

const MOCK_CRUISES = [
  {
    id: "cruise-001",
    title: "7-Night Mediterranean Sea Journey",
    destination: "MEDITERRANEAN",
    base_price_mur: 125000,
    hotel_stars: 5,
    travel_month: "July",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-1",
    flight_included: false,
    hotel_name: "Oceanic Symphony",
    number_of_days: 7,
    number_of_nights: 7,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-1", name: "Royal Seas Ltd", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "cruise-002",
    title: "14-Night Caribbean Island Wanderer",
    destination: "CARIBBEAN",
    base_price_mur: 180000,
    hotel_stars: 4,
    travel_month: "December",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-2",
    flight_included: true,
    hotel_name: "Caribbean Princess",
    number_of_days: 14,
    number_of_nights: 14,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-2", name: "Tropical Cruises", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "cruise-003",
    title: "4-Night Indian Ocean Relaxer",
    destination: "INDIAN_OCEAN",
    base_price_mur: 45000,
    hotel_stars: 5,
    travel_month: "October",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-1",
    flight_included: false,
    hotel_name: "Costa Serena",
    number_of_days: 4,
    number_of_nights: 4,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
    agency: { id: "agency-1", name: "Royal Seas Ltd", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  }
];

export default function CruisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedPackages, togglePackage } = useCompare();

  const filteredCruises = MOCK_CRUISES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.destination?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-outfit)] pb-20">
      {/* Premium Header Banner */}
      <div className="relative w-full h-[160px] md:h-[200px] bg-slate-900 overflow-hidden mb-6">
        <img 
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1920" 
          alt="Cruises Ocean Banner" 
          className="w-full h-full object-cover object-center opacity-80 select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-red-600/90 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-2 shadow-md">
            ★ SLOW CRUISES & OCEAN JOURNEYS ★
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none mb-1 uppercase drop-shadow-md">
            Set Sail & Relax
          </h1>
          <p className="text-[10px] md:text-xs text-slate-200 max-w-xl font-medium tracking-wide drop-shadow-sm leading-relaxed">
            Watch the sunset from the deck, feel the ocean breeze, and visit quiet coastal ports on a comfortable voyage.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by destination, ship name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600/50 outline-none text-sm font-semibold"
            />
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">
            {filteredCruises.length} Cruises Available
          </div>
        </div>

        {/* Results */}
        {filteredCruises.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-slate-100 group cursor-pointer">
            <Waves className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-2 fill-transparent group-hover:fill-red-100 group-hover:text-red-500 transition-all" />
            <h3 className="text-xl font-black text-gray-900">No cruises found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try checking your spelling or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCruises.map((pkg) => {
              const isComparing = selectedPackages.some((p) => p.id === pkg.id);
              return (
                <div key={pkg.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col group">
                  <div className="h-44 w-full relative shrink-0 flex items-center justify-center overflow-hidden bg-slate-900">
                    <img 
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[8px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                      {pkg.destination.replace("_", " ")}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {pkg.number_of_nights} Nights
                        </span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: pkg.hotel_stars || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      
                      <span className="bg-red-50 border border-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider w-fit mb-2 block">
                        {pkg.agency.name}
                      </span>
                      <h3 className="text-base font-black text-gray-900 mb-1 leading-snug line-clamp-1">{pkg.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                        Settle in for a peaceful journey on the water. Watch sunsets, breathe the sea air, and visit coastal villages.
                      </p>
                      
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs text-slate-500 flex items-center font-bold">
                          <Anchor className="mr-2 w-4 h-4 text-red-500" /> Ship: {pkg.hotel_name}
                        </p>
                        <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Compass className="w-3.5 h-3.5 text-red-500" /> Sailing Month: {pkg.travel_month}
                        </p>
                      </div>
                      <div className="flex gap-2.5 mb-2.5 mt-1.5 border-t border-slate-100/50 pt-2 flex-wrap">
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold tracking-wider ${pkg.flight_included ? "text-emerald-600" : "text-slate-300"}`}>
                          <Plane size={11} /> FLIGHT
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-emerald-600">
                          <Hotel size={11} /> HOTEL
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-emerald-600">
                          <Coffee size={11} /> MEALS
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <CarFront size={11} /> TRANSFERS
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-1 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fare From</p>
                        <p className="text-2xl font-black text-red-600">Rs {pkg.base_price_mur.toLocaleString()}</p>
                      </div>
                      
                      <label className="flex items-center space-x-2 cursor-pointer group/compare bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={isComparing}
                          onChange={() => togglePackage(pkg as unknown as Package)}
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
