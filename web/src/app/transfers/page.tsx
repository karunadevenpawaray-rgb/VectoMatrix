"use client";

import { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { Database } from "@/types/supabase";
import { Map, CarFront, Search, MapPin, Building2, ShieldCheck, Compass, Plane, Hotel, Coffee } from "lucide-react";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  agency?: Database["public"]["Tables"]["agencies"]["Row"];
};

const MOCK_TRANSFERS = [
  {
    id: "trsf-001",
    title: "Private Airport Transfer (SUV)",
    destination: "MAURITIUS",
    base_price_mur: 2500,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-trans-1",
    flight_included: false,
    hotel_name: "SUV Transfer: MRU to Resort",
    number_of_days: 1,
    number_of_nights: 0,
    type: "TRANSFER",
    transfer_type: "SUV",
    capacity: "4 Passengers + 4 Luggage",
    agency: { id: "agency-trans-1", name: "Premium Rides Ltd", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "trsf-002",
    title: "Executive Luxury VIP Transfer (S-Class)",
    destination: "MAURITIUS",
    base_price_mur: 8500,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-trans-1",
    flight_included: false,
    hotel_name: "VIP Transfer: MRU to Resort",
    number_of_days: 1,
    number_of_nights: 0,
    type: "TRANSFER",
    transfer_type: "Luxury Sedan",
    capacity: "3 Passengers + 3 Luggage",
    agency: { id: "agency-trans-1", name: "Premium Rides Ltd", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "trsf-003",
    title: "Private Minivan Airport Transfer",
    destination: "MAURITIUS",
    base_price_mur: 4000,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-trans-1",
    flight_included: false,
    hotel_name: "Minivan Transfer: MRU to Resort",
    number_of_days: 1,
    number_of_nights: 0,
    type: "TRANSFER",
    transfer_type: "Minivan",
    capacity: "8 Passengers + 8 Luggage",
    agency: { id: "agency-trans-1", name: "Premium Rides Ltd", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "trsf-004",
    title: "VIP Helicopter Airport Transfer",
    destination: "MAURITIUS",
    base_price_mur: 25000,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-heli",
    flight_included: false,
    hotel_name: "Helicopter Transfer: MRU to Resort Helipad",
    number_of_days: 1,
    number_of_nights: 0,
    type: "TRANSFER",
    transfer_type: "Helicopter",
    capacity: "4 Passengers + Carry-on Bag Only",
    agency: { id: "agency-heli", name: "HeliTours Mauritius", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  },
  {
    id: "trsf-005",
    title: "Coaster Shared Shuttle Transfer",
    destination: "MAURITIUS",
    base_price_mur: 800,
    hotel_stars: 0,
    travel_month: "Any",
    is_active: true,
    is_archived: false,
    created_at: new Date().toISOString(),
    agency_id: "agency-trans-2",
    flight_included: false,
    hotel_name: "Shuttle Transfer: MRU to Hotel Zones",
    number_of_days: 1,
    number_of_nights: 0,
    type: "TRANSFER",
    transfer_type: "Shared Shuttle",
    capacity: "Per Person + 1 Luggage",
    agency: { id: "agency-trans-2", name: "Island Transit Co.", status: "ACTIVE", created_at: "", contact_email: "", contact_person: "", joined: "", phone: "" }
  }
];

export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedPackages, togglePackage } = useCompare();

  const filteredItems = MOCK_TRANSFERS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.transfer_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-outfit)] pb-20">
      {/* Premium Header Banner */}
      <div className="relative w-full h-[160px] md:h-[200px] bg-slate-900 overflow-hidden mb-6">
        <img 
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1920" 
          alt="Luxury Transfer Banner" 
          className="w-full h-full object-cover object-center opacity-80 select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-red-600/90 text-white text-[9px] md:text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-3 shadow-md">
            ★ PREMIUM LUXURY TRANSFERS ★
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none mb-2 uppercase drop-shadow-md">
            Airport & Inter-Hotel Transfers
          </h1>
          <p className="text-xs md:text-sm text-slate-200 max-w-xl font-medium tracking-wide drop-shadow-sm leading-relaxed">
            Arrive in style with our vetted range of private SUVs, luxury sedans, VIP helicopters, and shared shuttles.
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
              placeholder="Search by vehicle type, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600/50 outline-none text-sm font-semibold"
            />
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">
            {filteredItems.length} Transfers Available
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-slate-100 group cursor-pointer">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-2 fill-transparent group-hover:fill-red-100 group-hover:text-red-500 transition-all duration-300" />
            <h3 className="text-xl font-black text-gray-900">No transfers found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try checking your spelling or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isComparing = selectedPackages.some((p) => p.id === item.id);
              return (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col group">
                  <div className="h-44 w-full relative shrink-0 flex items-center justify-center overflow-hidden bg-slate-900">
                    <img 
                      src={
                        item.transfer_type === 'Helicopter' 
                        ? 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800'
                        : item.transfer_type === 'Luxury Sedan'
                        ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
                        : item.transfer_type === 'Minivan'
                        ? 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800'
                        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                      {item.transfer_type}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="bg-red-50 border border-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider w-fit mb-2 block">
                        {item.agency.name}
                      </span>
                      <h3 className="text-base font-black text-gray-900 mb-1 leading-snug line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                        Reliable point-to-point and airport transfer. Enjoy a stress-free ride in a comfortable, clean vehicle with a professional local driver.
                      </p>
                      
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs text-slate-500 flex items-center font-bold">
                          <MapPin className="mr-2 w-4 h-4 text-red-500" /> {item.destination}
                        </p>
                        <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {item.capacity}
                        </p>
                      </div>
                      <div className="flex gap-2.5 mb-2.5 mt-1.5 border-t border-slate-100/50 pt-2 flex-wrap">
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <Plane size={11} /> FLIGHT
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <Hotel size={11} /> HOTEL
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-slate-300">
                          <Coffee size={11} /> MEALS
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-emerald-600">
                          <CarFront size={11} /> TRANSFERS
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-1 pt-2 border-t border-slate-100">
                      <div>
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
