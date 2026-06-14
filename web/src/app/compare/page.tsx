"use client";

import { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";
import { calculateTotal, PackageConfig, ESIM_PRICE, PREMIUM_INSURANCE_UPGRADE, PRIVATE_TRANSIT_UPGRADE } from "@/utils/pricing";

const mockGlobalSettings = {
  acceptPayments: true,
};

export default function ComparePage() {
  const { selectedPackages, removePackage } = useCompare();
  const router = useRouter();

  const [config, setConfig] = useState<Record<string, PackageConfig>>({});

  if (selectedPackages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center font-['var(--font-outfit)']">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">NO PACKAGES SELECTED</h2>
        <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto">Select packages from the home page to compare them side-by-side.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xl tracking-wide shadow-lg hover:bg-red-700 hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
        >
          BROWSE PACKAGES
        </button>
      </div>
    );
  }

  const toggleConfig = (pkgId: string, key: keyof PackageConfig) => {
    setConfig(prev => ({
      ...prev,
      [pkgId]: {
        ...(prev[pkgId] || { premiumInsurance: false, esim: false, privateTransit: false }),
        [key]: !prev[pkgId]?.[key]
      }
    }));
  };

  const handleCheckout = (pkg: any, isPaymentEnabled: boolean) => {
    const pkgConfig = config[pkg.id] || { premiumInsurance: false, esim: false, privateTransit: false };
    const total = calculateTotal(pkg.base_price_mur, pkgConfig);
    if (isPaymentEnabled) {
      router.push(`/checkout?pkgId=${pkg.id}&total=${total}`);
    } else {
      alert(`Lead Dispatched! Your inquiry for ${pkg.title} has been sent to ${pkg.agency?.name} via the mock system!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-['var(--font-outfit)']">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">COMPARE<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-400">PACKAGES</span></h1>
          <button onClick={() => router.push("/")} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-700 flex items-center transition-colors">
            <span className="mr-2 text-lg leading-none">&larr;</span> BACK TO SEARCH
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedPackages.map((pkg) => {
            const pkgConfig = config[pkg.id] || { premiumInsurance: false, esim: false, privateTransit: false };
            const currentTotal = calculateTotal(pkg.base_price_mur, pkgConfig); // Quick calculation for demo

            return (
              <div key={pkg.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start relative">
                  <div className="pr-8">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">{pkg.agency?.name || "Premium Partner"}</p>
                    <h3 className="font-black text-slate-900 text-xl leading-[1.1]">{pkg.title}</h3>
                  </div>
                  <button onClick={() => removePackage(pkg.id)} className="absolute top-6 right-6 text-slate-400 hover:text-red-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md">
                    ✕
                  </button>
                </div>

                <div className="p-6 flex-grow space-y-8">
                  {/* Specs */}
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Destination</span>
                      <span className="text-sm font-black text-slate-900">{pkg.destination}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Hotel</span>
                      <span className="text-sm font-black text-slate-900 text-right">{pkg.hotel_name}<br/><span className="text-yellow-400">{"★".repeat(pkg.hotel_stars || 0)}</span></span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Location</span>
                      <span className="text-sm font-black text-slate-900">{pkg.hotel_location || "Central"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Baggage</span>
                      <span className="text-sm font-black text-slate-900">{pkg.baggage_allowance || "23kg Included"}</span>
                    </div>
                  </div>

                  {/* Interactive Add-ons (Dense styling) */}
                  <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customize Trip</h4>
                    
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={pkgConfig.premiumInsurance}
                          onChange={() => toggleConfig(pkg.id, 'premiumInsurance')}
                          className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-600/50 accent-red-600"
                        />
                        <span className="text-sm text-slate-700 font-bold group-hover:text-red-600 transition-colors">Premium Insurance</span>
                      </div>
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">+Rs {PREMIUM_INSURANCE_UPGRADE}</span>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={pkgConfig.esim}
                          onChange={() => toggleConfig(pkg.id, 'esim')}
                          className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-600/50 accent-red-600"
                        />
                        <span className="text-sm text-slate-700 font-bold group-hover:text-red-600 transition-colors">Global eSIM</span>
                      </div>
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">+Rs {ESIM_PRICE}</span>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={pkgConfig.privateTransit}
                          onChange={() => toggleConfig(pkg.id, 'privateTransit')}
                          className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-600/50 accent-red-600"
                        />
                        <span className="text-sm text-slate-700 font-bold group-hover:text-red-600 transition-colors">Private Sedan</span>
                      </div>
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">+Rs {PRIVATE_TRANSIT_UPGRADE}</span>
                    </label>
                  </div>
                </div>

                {/* Price Footer */}
                <div className="bg-slate-900 p-8 text-white mt-auto rounded-b-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Estimated Price</p>
                  <p className="text-4xl font-black mb-6 text-white tracking-tight">Rs {currentTotal.toLocaleString()}</p>
                  
                  {mockGlobalSettings.acceptPayments ? (
                    <button 
                      onClick={() => handleCheckout(pkg, true)}
                      className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm tracking-widest uppercase"
                    >
                      CHECKOUT VIA STRIPE
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleCheckout(pkg, false)}
                      className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm tracking-widest uppercase"
                    >
                      REQUEST BOOKING
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
