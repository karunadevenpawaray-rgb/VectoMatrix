"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Users, Clock, Filter } from "lucide-react";
import { packageService } from "@/services/packageService";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const filters = {
        searchQuery,
        filterDestination: selectedDestination === "all" ? "" : selectedDestination,
        filterMonth: "",
        filterStars: "",
        priceRange: priceRange[1]
      };
      const { paginatedData } = await packageService.getFilteredPackages(filters, 1, 50);
      // Filter for activities only
      const activityData = paginatedData.filter((pkg: any) => pkg.service_type === 'activity');
      setActivities(activityData);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [searchQuery, selectedDestination, priceRange]);

  const destinations = [
    { id: "all", name: "All Destinations" },
    { id: "DUBAI", name: "Dubai" },
    { id: "MALAYSIA", name: "Malaysia" },
    { id: "SOUTH_AFRICA", name: "South Africa" },
    { id: "RODRIGUES", name: "Rodrigues" },
    { id: "REUNION", name: "Réunion" },
    { id: "MALDIVES", name: "Maldives" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">EXPERIENCE ACTIVITIES</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover unique experiences and adventures in beautiful destinations around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
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
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all appearance-none"
              >
                <option value="0-100000">Any Price</option>
                <option value="0-10000">Under Rs 10,000</option>
                <option value="10000-25000">Rs 10,000 - 25,000</option>
                <option value="25000-50000">Rs 25,000 - 50,000</option>
                <option value="50000-100000">Over Rs 50,000</option>
              </select>
            </div>
            
            <button 
              onClick={fetchActivities}
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
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-slate-200 relative">
                  <img 
                    src={activity.gallery_images?.[0] || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"} 
                    alt={activity.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-slate-900">
                    {activity.destination}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{activity.title}</h3>
                    <div className="flex items-center bg-amber-100 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="ml-1 text-sm font-bold text-amber-800">{activity.hotel_stars || 4}.0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="mr-4">Up to {activity.max_group_size || 20} people</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{activity.duration_hours || 4} hours</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-black text-slate-900">Rs {activity.base_price_mur.toLocaleString()}</span>
                      <span className="text-slate-500 ml-2">per person</span>
                    </div>
                    <Link 
                      href={`/package/${activity.id}`} 
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

        {activities.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No activities found</h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
