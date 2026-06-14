"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, FileText, Compass, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"INQUIRIES" | "BOOKINGS">("INQUIRIES");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("CUSTOMER");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Default fallback email
    let email = "jean@example.com";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      email = urlParams.get("email") || localStorage.getItem("vmx_customer_email") || "jean@example.com";
      localStorage.setItem("vmx_customer_email", email);
    }

    // Live Supabase Fetch
    const { data, error } = await supabase
      .from('leads')
      .select('*, package:packages(*)')
      .eq('client_email', email)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInquiries(data.filter((l: any) => l.status === 'PENDING'));
      setBookings(data.filter((l: any) => l.status === 'CONVERTED' || l.status === 'CANCELLED'));
      const first = data[0];
      if (first?.client_name) {
        setClientName(first.client_name.split(" ")[0].toUpperCase());
      }
    }
    setLoading(false);
  };

  const handleDownloadItinerary = (id: string) => {
    alert(`Generating PDF Itinerary for booking ${id}...`);
  };

  const handleViewReceipt = (id: string) => {
    alert(`Loading Payment Receipt for booking ${id}...`);
  };

  const handleCancelBooking = async (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const { error } = await supabase.from('leads').update({ status: 'CANCELLED' }).eq('id', id);
      if (error) {
        alert("Error cancelling booking: " + error.message);
      } else {
        alert("Booking cancelled successfully.");
        fetchDashboardData();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-['var(--font-outfit)']">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">WELCOME BACK,<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-400">{clientName}!</span></h1>
            <p className="text-lg text-slate-500 mt-2">Manage your upcoming trips and inquiries.</p>
          </div>
          <Link href="/" className="bg-white border-2 border-slate-200 text-slate-900 font-black text-sm tracking-widest uppercase px-6 py-4 rounded-2xl shadow-sm hover:border-red-600 hover:text-red-600 transition-all active:scale-95">
            BROWSE NEW PACKAGES
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            className={`pb-4 px-6 font-black text-lg ${activeTab === "INQUIRIES" ? "border-b-2 border-red-600 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("INQUIRIES")}
          >
            <div className="flex items-center gap-2">
              <Compass className={`w-5 h-5 ${activeTab === "INQUIRIES" ? "text-red-600" : "text-slate-400"}`} />
              <span>MY INQUIRIES ({inquiries.length})</span>
            </div>
          </button>
          <button
            className={`pb-4 px-6 font-black text-lg ${activeTab === "BOOKINGS" ? "border-b-2 border-red-600 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("BOOKINGS")}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-5 h-5 ${activeTab === "BOOKINGS" ? "text-red-600" : "text-slate-400"}`} />
              <span>MY BOOKINGS ({bookings.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === "INQUIRIES" && (
              <div>
                {inquiries.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
                    <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Active Inquiries</h3>
                    <p className="text-slate-500 max-w-md mx-auto">You don't have any pending inquiries. Start browsing packages to make your next travel plan!</p>
                    <Link href="/" className="inline-block mt-6 bg-red-600 text-white font-black py-3 px-8 rounded-2xl hover:bg-red-700 transition-colors">
                      Browse Packages
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-lg text-slate-900">{inquiry.package?.title || 'Package Inquiry'}</h3>
                            <p className="text-slate-500 text-sm">{inquiry.package?.destination || 'Destination'}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full">PENDING</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-500 mb-6">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Submitted: {new Date(inquiry.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-slate-900 font-black">Rs {(inquiry.calculated_total_mur || 0).toLocaleString()}</p>
                            <p className="text-slate-500 text-sm">Estimated Total</p>
                          </div>
                          <Link 
                            href={`/package/${inquiry.package_id}`} 
                            className="bg-slate-900 text-white font-black py-2 px-6 rounded-2xl hover:bg-slate-800 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "BOOKINGS" && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
                    <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Bookings Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">You haven't made any bookings yet. Explore our packages and book your dream vacation!</p>
                    <Link href="/" className="inline-block mt-6 bg-red-600 text-white font-black py-3 px-8 rounded-2xl hover:bg-red-700 transition-colors">
                      Browse Packages
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-lg text-slate-900">{booking.package?.title || 'Booked Package'}</h3>
                            <p className="text-slate-500 text-sm">{booking.package?.destination || 'Destination'}</p>
                          </div>
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${
                            booking.status === 'CONVERTED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {booking.status === 'CONVERTED' ? 'CONFIRMED' : 'CANCELLED'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-500 mb-6">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Booked: {new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-slate-900 font-black">Rs {(booking.calculated_total_mur || 0).toLocaleString()}</p>
                              <p className="text-slate-500 text-sm">Final Amount</p>
                            </div>
                            
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleDownloadItinerary(booking.id)}
                                className="flex items-center gap-2 bg-slate-100 text-slate-700 font-black py-2 px-4 rounded-2xl hover:bg-slate-200 transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                <span>Itinerary</span>
                              </button>
                              
                              <button 
                                onClick={() => handleViewReceipt(booking.id)}
                                className="flex items-center gap-2 bg-slate-900 text-white font-black py-2 px-4 rounded-2xl hover:bg-slate-800 transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                <span>Receipt</span>
                              </button>
                            </div>
                          </div>
                          
                          {booking.status === 'CONVERTED' && (
                            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-rose-600 hover:text-rose-800 font-black text-sm flex items-center gap-1"
                              >
                                Cancel Booking
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}