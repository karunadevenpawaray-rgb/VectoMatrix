"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, CarFront, Calendar, Users, Filter } from "lucide-react";
import { packageService } from "@/services/packageService";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [vehicleType, setVehicleType] = useState("all");

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const filters = {
        searchQuery,
        filterDestination: selectedDestination === "all" ? "" : selectedDestination,
        filterMonth: "",
        filterStars: "",
        priceRange: 100000
      };
      const { paginatedData } = await packageService.getFilteredPackages(filters, 1, 50);
      // Filter for transfer-related services (could be packages with transfer components)
      const transferData = paginatedData.filter((pkg: any) => 
        pkg.service_type === 'package' && 
        (pkg.title.toLowerCase().includes('transfer') || 
         pkg.description.toLowerCase().includes('transfer') ||
         pkg.title.toLowerCase().includes('airport') ||
         pkg.description.toLowerCase().includes('pickup'))
      );
      setTransfers(transferData);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [searchQuery, selectedDestination, vehicleType]);

  const destinations = [
    { id: "all", name: "All Destinations" },
    { id: "DUBAI", name: "Dubai" },
    { id: "MALAYSIA", name: "Malaysia" },
    { id: "SOUTH_AFRICA", name: "South Africa" },
    { id: "RODRIGUES", name: "Rodrigues" },
    { id: "REUNION", name: "Réunion" },
    { id: "MALDIVES", name: "Maldives" },
  ];

  const vehicleTypes = [
    { id: "all", name: "Any Vehicle" },
    { id: "standard", name: "Standard Car" },
    { id: "van", name: "Van" },
    { id: "bus", name: "Bus" },
    { id: "luxury", name: "Luxury Vehicle" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">TRANSPORTATION & TRANSFERS</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Reliable and comfortable transportation services for your journey from airport to destination.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transfers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all appearance-none"
              >
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <CarFront className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all appearance-none"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={fetchTransfers}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transfers.map((transfer) => (
              <div key={transfer.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-slate-200 relative">
                  <img 
                    src={transfer.gallery_images?.[0] || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800"} 
                    alt={transfer.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-slate-900">
                    {transfer.destination}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{transfer.title}</h3>
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <CarFront className="w-4 h-4 mr-1" />
                    <span className="mr-4">{transfer.vehicle_type || 'Standard Vehicle'}</span>
                    <Users className="w-4 h-4 mr-1" />
                    <span>Up to {transfer.capacity || 4} passengers</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-black text-slate-900">Rs {transfer.base_price_mur.toLocaleString()}</span>
                      <span className="text-slate-500 ml-2">per transfer</span>
                    </div>
                    <Link 
                      href={`/package/${transfer.id}`} 
                      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transfers.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No transfers found</h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}