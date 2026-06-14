"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { packageService } from "@/services/packageService";
const getMockWeather = (destination: string) => {
  const dest = (destination || "").toLowerCase();
  if (dest.includes("cape") || dest.includes("south")) {
    return { temp: 18, condition: "Sunny with light breeze", icon: "☀️", humidity: "62%", wind: "14 km/h" };
  }
  if (dest.includes("europe") || dest.includes("paris") || dest.includes("london")) {
    return { temp: 15, condition: "Partly Cloudy", icon: "⛅", humidity: "70%", wind: "12 km/h" };
  }
  return { temp: 26, condition: "Tropical & Warm", icon: "🌤️", humidity: "78%", wind: "18 km/h" };
};

const formatPrice = (amountInMur: number, currency: string) => {
  if (currency === 'USD') {
    return `$${Math.round(amountInMur * 0.022).toLocaleString()}`;
  }
  if (currency === 'EUR') {
    return `€${Math.round(amountInMur * 0.020).toLocaleString()}`;
  }
  return `MUR ${Math.round(amountInMur).toLocaleString()}`;
};

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [currency, setCurrency] = useState<'MUR' | 'USD' | 'EUR'>('MUR');
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [weather, setWeather] = useState<any>({ temp: 26, condition: "Tropical & Warm", icon: "🌤️", humidity: "78%", wind: "18 km/h" });

  useEffect(() => {
    if (params.id) {
      loadPackage(params.id as string);
    }
  }, [params.id]);

  const loadPackage = async (id: string) => {
    try {
      const data = await packageService.getPackageById(id);
      if (data) {
        setPkg(data);
        setWeather(getMockWeather(data.destination || data.title));
        const rooms = data.room_types && data.room_types.length > 0 ? data.room_types : [
          { id: "rt-1", name: "Junior Suite", max_occupancy: 3 },
          { id: "rt-2", name: "Royal Suite", max_occupancy: 3 },
          { id: "rt-3", name: "Senior Suite", max_occupancy: 3 },
        ];
        if (rooms[0]) {
          setSelectedRoomId(rooms[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-12 animate-pulse">
        <div className="max-w-5xl mx-auto">
          <div className="h-64 bg-slate-200 rounded-[3rem] mb-8"></div>
          <div className="h-10 bg-slate-200 w-1/2 mb-4 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return <div className="min-h-screen pt-24 px-8 text-center text-2xl font-black text-slate-500 font-['var(--font-outfit)']">PACKAGE NOT FOUND.</div>;
  }

  const roomTypes = pkg.room_types && pkg.room_types.length > 0 ? pkg.room_types : [
    { id: "rt-1", name: "Junior Suite", max_occupancy: 3 },
    { id: "rt-2", name: "Royal Suite", max_occupancy: 3 },
    { id: "rt-3", name: "Senior Suite", max_occupancy: 3 },
  ];

  const galleryImages = pkg.gallery_images && pkg.gallery_images.length > 0 
    ? pkg.gallery_images 
    : [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1582672060628-cbcefa0ee824?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800"
      ];
      
  // To ensure we have 4 images for the multi-image slider
  const multiImages = [...galleryImages, ...galleryImages, ...galleryImages].slice(0, 4);

  const activeRoomId = selectedRoomId || roomTypes[0]?.id;
  const activeRoom = roomTypes.find((r: any) => r.id === activeRoomId) || roomTypes[0];
  const activeRoomIndex = roomTypes.findIndex((r: any) => r.id === activeRoom.id);
  const activeRoomPrice = pkg.base_price_mur + (activeRoomIndex >= 0 ? activeRoomIndex * 2000 : 0);
  const totalCalculatedMUR = activeRoomPrice * (adults * 1.0 + teens * 0.75 + children * 0.5);

  return (
    <div className="bg-slate-50 min-h-screen font-[family-name:var(--font-outfit)] pb-32">
      {/* Hero Header */}
      <div className="relative h-[260px] md:h-[340px] w-full mt-16 md:mt-0 bg-slate-950">
        <img src={galleryImages[0]} alt={pkg.title} className="w-full h-full object-cover opacity-80" />
        {/* Dark overlay that is heavier at the bottom to read title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
        
        {/* Overlaid Title and Info */}
        <div className="absolute bottom-8 md:bottom-12 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-start text-left">
          {/* Overlaid Pills / Breadcrumb on image */}
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-2 flex items-center gap-1.5 flex-wrap drop-shadow-md">
            <span className="cursor-pointer hover:text-red-400 transition-colors" onClick={() => router.push('/')}>HOME</span>
            <span className="text-slate-400">&gt;</span>
            <span className="cursor-pointer hover:text-red-400 transition-colors">{pkg.service_type === 'hotel' ? 'HOTELS' : 'TOURS'}</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-red-500">{pkg.hotel_name || pkg.title}</span>
          </div>

          {/* Rating Pill */}
          <div className="bg-slate-900/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/10 shadow-lg mb-3">
            <span className="text-amber-400">★★★★★</span>
            <span className="text-slate-300">4.8 / 5</span>
          </div>

          {/* Huge Bold Uppercase Title */}
          <h1 className="text-2xl md:text-4xl font-black text-white italic tracking-tight leading-[1.05] uppercase drop-shadow-2xl max-w-4xl">
            {pkg.hotel_name || pkg.title}
          </h1>

          {/* Red dot pill */}
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center mt-3 text-white shadow-md animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-20px] md:mt-[-40px] relative z-20 space-y-4">
        {/* Introduction Card */}
        <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
          {/* Tagline */}
          <p className="text-red-600 font-bold text-sm md:text-base mb-6 leading-relaxed border-l-[3px] border-red-600 pl-3 uppercase tracking-wide">
            {pkg.title} – ocean breezes, quiet beaches, and slow afternoons under the sun.
          </p>

          {/* Bullet highlights list */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-8 text-xs md:text-sm font-semibold text-slate-700 list-disc pl-5">
            <li>Air Ticket With Air Mauritius</li>
            <li>7 Nights Stay At {pkg.hotel_name || 'Premium Hotel'} or Similar</li>
            <li>Daily Breakfast and Dinner Meal Plans</li>
            <li>Return Airport Transfers</li>
            <li>Half Day City Excursion</li>
            <li>Full Day Scenic Landmark Tour</li>
            <li>Seal Island Boat Trip Experience</li>
            <li>All Taxes and Travel Assistance</li>
          </ul>

          {/* Description Paragraph */}
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8">
            {pkg.description} Take in the fresh sea air, walk along sandy shores, and enjoy home-style local meals at friendly seaside diners.
          </p>

          {/* Key Highlights */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-4">KEY HIGHLIGHTS</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-800">
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-lg leading-none">•</span>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block tracking-wider font-semibold mb-0.5">TRAVELLING DATE</span>
                  <span>{pkg.travel_month || 'Dec 2026'} - Custom Dates Available</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-lg leading-none">•</span>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block tracking-wider font-semibold mb-0.5">COST OF PACKAGE</span>
                  <span>Per adult on double sharing basis</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-2.5">
                <span className="text-red-600 text-lg leading-none">{weather.icon}</span>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block tracking-wider font-semibold mb-0.5">DESTINATION WEATHER</span>
                  <span className="text-xs font-black">{weather.temp}°C - {weather.condition}</span>
                  <span className="text-[8px] text-slate-400 block mt-0.5 font-normal">Humidity: {weather.humidity} | Wind: {weather.wind}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost & Group Calculator Card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">INTERACTIVE PRICING</h4>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Plan & Calculate Cost</h2>
            </div>
            {/* Currency Switcher */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 self-start sm:self-auto shadow-inner">
              {(['MUR', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                    currency === curr ? 'bg-[#1a202c] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Select Room (Accommodation nested) */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">STEP 1: SELECT ACCOMMODATION CLASS</span>
                <h3 className="text-sm font-black text-slate-805">Choose Your Room</h3>
              </div>
              <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <div className={`grid ${
              roomTypes.length === 1 ? 'grid-cols-1' : 
              roomTypes.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
              roomTypes.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            } gap-4`}>
              {roomTypes.map((room: any, idx: number) => {
                const priceOffset = idx * 2000;
                const roomPrice = (pkg.base_price_mur + priceOffset);
                const isSelected = room.id === activeRoomId;
                
                if (viewMode === 'list') {
                  const isThreeCol = roomTypes.length >= 3;
                  return (
                    <div 
                      key={room.id} 
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`cursor-pointer flex flex-col ${isThreeCol ? '' : 'md:flex-row'} bg-white border ${isSelected ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-100'} rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all`}
                    >
                      {/* Left Compact Image */}
                      <div className={`relative ${isThreeCol ? 'w-full h-28' : 'md:w-[150px] h-28 md:h-auto'} shrink-0 bg-slate-100`}>
                        <img src={multiImages[idx % multiImages.length]} alt={room.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                          {room.name}
                        </div>
                      </div>
                      
                      {/* Content Pane */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-0.5">
                            <h3 className="text-sm font-black text-slate-900 truncate">{room.name}</h3>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-red-600 leading-none">{formatPrice(roomPrice, currency)}</p>
                              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">/ NIGHT</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                            Comfortable suite with warm lighting and soft sheets.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[7px] font-black text-slate-500 flex items-center gap-0.5 tracking-wide">
                            {room.max_occupancy || 3} ADULTS
                          </span>
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[7px] font-black tracking-widest flex items-center gap-0.5">
                            {pkg.meal_plans?.[0] || 'HALF BOARD'}
                          </span>
                        </div>
                        
                        <div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoomId(room.id);
                            }} 
                            className={`w-full ${isSelected ? 'bg-[#1a202c]' : 'bg-red-600 hover:bg-red-700'} text-white py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1 shadow-sm`}
                          >
                            {isSelected ? '✓ SELECTED' : 'SELECT ROOM →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={room.id} 
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`cursor-pointer flex flex-col bg-white border ${isSelected ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-100'} rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all`}
                    >
                      {/* Compact Image */}
                      <div className="relative w-full h-28 shrink-0 bg-slate-100">
                        <img src={multiImages[idx % multiImages.length]} alt={room.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                          {room.name}
                        </div>
                      </div>
                      
                      {/* Compact Content */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-0.5">
                            <h3 className="text-sm font-black text-slate-900 truncate">{room.name}</h3>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-red-600 leading-none">{formatPrice(roomPrice, currency)}</p>
                              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">/ NIGHT</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                            Cozy room with direct beach access.
                          </p>
                        </div>
                        
                        {/* Badges and Button Stack */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[7px] font-black text-slate-500 flex items-center gap-0.5 tracking-wide">
                              {room.max_occupancy || 3} ADULTS
                            </span>
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[7px] font-black tracking-widest flex items-center gap-0.5">
                              {pkg.meal_plans?.[0] || 'HALF BOARD'}
                            </span>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoomId(room.id);
                            }} 
                            className={`w-full ${isSelected ? 'bg-[#1a202c]' : 'bg-red-600 hover:bg-red-700'} text-white py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1 shadow-sm`}
                          >
                            {isSelected ? '✓ SELECTED' : 'SELECT ROOM →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* STEP 2: Select Guests & Calculate */}
          <div className="border-t border-slate-100 pt-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-3">STEP 2: CHOOSE TRAVELERS & GET PRICING</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="space-y-4 md:col-span-2 flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center relative">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block mb-1">ADULTS (12y+)</span>
                    <div className="flex items-center justify-center gap-2.5">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">-</button>
                      <span className="text-xs font-black text-slate-800">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">+</button>
                    </div>
                    <span className="text-[7px] text-slate-400 block mt-1 font-semibold">100% Rate</span>
                  </div>
                  {/* Teens */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center relative">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block mb-1">TEENS (12-17y)</span>
                    <div className="flex items-center justify-center gap-2.5">
                      <button onClick={() => setTeens(Math.max(0, teens - 1))} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">-</button>
                      <span className="text-xs font-black text-slate-800">{teens}</span>
                      <button onClick={() => setTeens(teens + 1)} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">+</button>
                    </div>
                    <span className="text-[7px] text-slate-400 block mt-1 font-semibold">75% Rate</span>
                  </div>
                  {/* Children */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center relative">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block mb-1">CHILDREN (2-11y)</span>
                    <div className="flex items-center justify-center gap-2.5">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">-</button>
                      <span className="text-xs font-black text-slate-800">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-5 h-5 rounded-full bg-white border border-slate-200 font-bold flex items-center justify-center text-xs hover:bg-slate-100 shadow-sm">+</button>
                    </div>
                    <span className="text-[7px] text-slate-400 block mt-1 font-semibold">50% Rate</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 text-[10px] font-semibold text-slate-600 mt-2">
                  <span className="text-amber-500 font-black">ℹ</span>
                  <span>Currently calculating for: <strong className="text-slate-800 uppercase">{activeRoom.name}</strong>.</span>
                </div>
              </div>

              {/* Calculated Price */}
              <div className="bg-[#1a202c] text-white rounded-3xl p-5 shadow-lg border border-slate-700/30 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">TOTAL ESTIMATED PRICE</span>
                  <p className="text-2xl font-black text-red-500 tracking-tight leading-none">
                    {formatPrice(totalCalculatedMUR, currency)}
                  </p>
                  <div className="mt-4 space-y-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex justify-between">
                      <span>Room Class:</span>
                      <span className="text-white">{activeRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Rate:</span>
                      <span className="text-white">{formatPrice(activeRoomPrice, currency)} / night</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="text-white">{adults}A, {teens}T, {children}C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Route / Itinerary Map diagram */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">VISUAL ROUTE</h4>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Itinerary Highlights Map</h2>
          
          <div className="relative flex flex-col md:flex-row justify-between items-stretch gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 overflow-hidden">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-[2px] bg-slate-200 -translate-y-1/2 z-0"></div>
            
            {/* Itinerary Leg Steps */}
            {(pkg.itinerary_days && pkg.itinerary_days.length > 0 ? pkg.itinerary_days : [
              { day: 1, title: "Arrival & Welcome" },
              { day: 3, title: "Scenic Island Excursion" },
              { day: 5, title: "Cultural Landmarks Tour" },
              { day: 7, title: "Departure Transfer" }
            ]).slice(0, 4).map((day: any, index: number) => (
              <div key={index} className="relative z-10 flex-1 flex flex-col items-center text-center p-3 bg-white md:bg-transparent rounded-xl border border-slate-100 md:border-0 shadow-sm md:shadow-none">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-red-600 flex items-center justify-center text-sm shadow-md">
                  📍
                </div>
                <span className="bg-[#1a202c] text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full mt-2 tracking-widest">
                  DAY {day.day}
                </span>
                <span className="text-[10px] font-black text-slate-800 mt-1.5 line-clamp-1">{day.title}</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5">Leg {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Plan (Itinerary Days) */}
        {pkg.itinerary_days && pkg.itinerary_days.length > 0 && (
          <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
            <div className="mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">EXPERIENCE</h4>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Detailed Plan</h2>
            </div>

            <div className="relative pl-1 md:pl-2 space-y-5 before:absolute before:top-3 before:bottom-3 before:left-[22px] md:before:left-[30px] before:w-[2px] before:bg-slate-200">
              {pkg.itinerary_days.map((day: any) => (
                <div key={day.day} className="flex gap-4 md:gap-6 relative z-10 items-start">
                  {/* Left Circle Dot */}
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-red-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <span className="bg-slate-100 text-slate-500 font-extrabold px-3 py-1 rounded-full text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                        DAY {day.day}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-black text-slate-900 leading-snug">
                          {day.title}
                        </h3>
                        {day.description && (
                          <div className="mt-2">
                            {day.description.includes('\n') || day.description.startsWith('-') || day.description.startsWith('*') ? (
                              <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-slate-500 font-medium">
                                {day.description.split('\n').map((line: string, idx: number) => {
                                  const cleanLine = line.trim().replace(/^[-*•]\s*/, '');
                                  if (!cleanLine) return null;
                                  return (
                                    <li key={idx} className="leading-relaxed">
                                      {cleanLine}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                                {day.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Time to Visit Gauge */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">CLIMATE TRAVEL PLANNING</h4>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Best Time to Visit</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-1 text-center font-black text-[8px] tracking-wider uppercase text-slate-400">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                <div key={m}>{m}</div>
              ))}
            </div>
            
            {/* Color-coded months gauge */}
            <div className="grid grid-cols-12 gap-1 h-3 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              {[
                { status: 'low', color: 'bg-emerald-300' }, // Jan
                { status: 'low', color: 'bg-emerald-300' }, // Feb
                { status: 'shoulder', color: 'bg-amber-300' }, // Mar
                { status: 'shoulder', color: 'bg-amber-300' }, // Apr
                { status: 'peak', color: 'bg-red-500' }, // May
                { status: 'peak', color: 'bg-red-500' }, // Jun
                { status: 'peak', color: 'bg-red-500' }, // Jul
                { status: 'peak', color: 'bg-red-500' }, // Aug
                { status: 'peak', color: 'bg-red-500' }, // Sep
                { status: 'peak', color: 'bg-red-500' }, // Oct
                { status: 'peak', color: 'bg-red-500' }, // Nov
                { status: 'peak', color: 'bg-red-500' }, // Dec
              ].map((item, idx) => (
                <div key={idx} className={`${item.color} h-full`} title={item.status}></div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-between items-center text-[9px] font-bold text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span>PEAK SEASON (Highly Recommended)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 inline-block"></span>
                <span>SHOULDER SEASON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block"></span>
                <span>LOW SEASON (Best Value / Warm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Facts / Terms & Conditions */}
        <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100 mb-2">
          <div className="mb-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">LEGAL NOTICE</h4>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Terms & Conditions</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Conditions apply, subject to availability. Air fares are subject to change without prior notice. Peak season surcharges may apply.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a202c] rounded-[1.5rem] p-5 text-white shadow-md group">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">VALUE INCLUSIONS</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-400 font-medium">
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-black">✓</span> Daily breakfast and dinner</li>
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-black">✓</span> Welcome drink upon arrival</li>
                <li className="flex items-start gap-2.5"><span className="text-red-500 font-black">✓</span> Free access to boathouse</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 shadow-sm group">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">NOT INCLUDED</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-500 font-medium">
                <li className="flex items-start gap-2.5"><span className="text-slate-400 font-black">✕</span> International flights</li>
                <li className="flex items-start gap-2.5"><span className="text-slate-400 font-black">✕</span> Travel insurance</li>
                <li className="flex items-start gap-2.5"><span className="text-slate-400 font-black">✕</span> Personal expenses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1 border-l-[3px] border-red-600 pl-3 leading-tight">GUEST FEEDBACK</h4>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Verified Guest Reviews</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-slate-900">4.8</span>
              <span className="text-slate-400 text-xs font-bold block">out of 5.0</span>
            </div>
          </div>
          
          <div className="space-y-4 divide-y divide-slate-100">
            {[
              { author: "Sarah L.", rating: 5, date: "May 2026", text: "Everything was perfectly coordinated. The transfers were clean and punctual, and the half-day excursion was the highlight of our trip!" },
              { author: "David M.", rating: 4.5, date: "April 2026", text: "Excellent accommodations and excellent tour guide. The itinerary is packed but leaves enough quiet time to relax on the beach." },
              { author: "Elena R.", rating: 5, date: "March 2026", text: "Outstanding value for money. Checking out was seamless, and the customer assistance was available 24/7." }
            ].map((review, idx) => (
              <div key={idx} className="pt-4 first:pt-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center uppercase">
                      {review.author.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{review.author}</h4>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{review.date}</span>
                    </div>
                  </div>
                  <div className="text-xs text-amber-500 font-bold">
                    {"★".repeat(Math.floor(review.rating))}
                    {review.rating % 1 !== 0 && "½"}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium pl-10">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent p-4 z-50 flex justify-center pointer-events-none">
        <div className="bg-[#1a202c] rounded-full pl-6 pr-2 py-2 flex items-center gap-6 max-w-sm w-full justify-between shadow-2xl pointer-events-auto border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="text-white text-sm font-bold tracking-tight">
              <span className="text-slate-400 text-[9px] uppercase block tracking-widest mb-0.5">ESTIMATED COST</span>
              {formatPrice(totalCalculatedMUR, currency)}
            </div>
          </div>
          <button 
            onClick={() => router.push(`/checkout?package=${pkg.id}&adults=${adults}&teens=${teens}&children=${children}&room=${activeRoom.id}&currency=${currency}`)} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            REQUEST A QUOTE &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
