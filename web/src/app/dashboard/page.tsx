"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockEngine } from "@vectormatrix/mock-engine";
import { Building2, FileText, Compass, CheckCircle, Clock } from "lucide-react";

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
    const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true' && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : true);
    
    // Default fallback email
    let email = "jean@example.com";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      email = urlParams.get("email") || localStorage.getItem("vmx_customer_email") || "jean@example.com";
      localStorage.setItem("vmx_customer_email", email);
    }

    if (USE_MOCK_DATA) {
      const allLeads = await mockEngine.getLeads();
      const pending = allLeads.filter(l => l.status === 'PENDING');
      const converted = allLeads.filter(l => l.status === 'CONVERTED' || l.status === 'CANCELLED');
      setInquiries(pending);
      setBookings(converted);
      const first = allLeads[0];
      if (first?.client_name) {
        setClientName(first.client_name.split(" ")[0].toUpperCase());
      }
    } else {
      // Live Supabase Fetch
      const { supabase } = await import("@/utils/supabase");
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
      const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true' && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : true);
      if (USE_MOCK_DATA) {
        await mockEngine.updateLeadStatus(id, "CANCELLED");
      } else {
        const { supabase } = await import("@/utils/supabase");
        await supabase.from('leads').update({ status: 'CANCELLED' }).eq('id', id);
      }
      alert("Booking cancelled successfully.");
      fetchDashboardData();
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">ACTIVE INQUIRIES</p>
              <p className="text-5xl font-black text-slate-900">{loading ? "..." : inquiries.length}</p>
            </div>
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
              <Clock size={32} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">CONFIRMED TRIPS</p>
              <p className="text-5xl font-black text-green-600">{loading ? "..." : bookings.length}</p>
            </div>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle size={32} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-rose-500 p-8 rounded-[2rem] shadow-lg text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-100 mb-2">NEXT DESTINATION</p>
              <p className="text-3xl font-black tracking-tight">DUBAI</p>
              <p className="text-sm font-bold text-red-100 mt-1">AUGUST 2026</p>
            </div>
            <Compass size={80} className="absolute -right-4 -bottom-4 text-white opacity-20" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-8 border-b-2 border-slate-200">
          <button 
            onClick={() => setActiveTab("INQUIRIES")}
            className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all -mb-[2px] ${activeTab === "INQUIRIES" ? "border-red-600 text-red-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            ACTIVE INQUIRIES
          </button>
          <button 
            onClick={() => setActiveTab("BOOKINGS")}
            className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all -mb-[2px] ${activeTab === "BOOKINGS" ? "border-red-600 text-red-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            CONFIRMED BOOKINGS
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === "INQUIRIES" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">PACKAGE</th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">AGENCY</th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">SUBMITTED ON</th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center font-black tracking-widest text-slate-400 text-sm">LOADING YOUR DATA...</td></tr>
                  ) : inquiries.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center font-black tracking-widest text-slate-400 text-sm">NO ACTIVE INQUIRIES.</td></tr>
                  ) : inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 text-lg leading-tight">{inq.package?.title || inq.package_id}</p>
                        <p className="text-sm font-bold text-slate-500 mt-1">Rs {inq.calculated_total_mur?.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600 flex items-center mt-3">
                        <Building2 className="mr-2 w-4 h-4 text-slate-400" /> {inq.assigned_agency_id}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] bg-yellow-50 text-yellow-600 border border-yellow-200">
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "BOOKINGS" && (
            <div className="p-8">
              {loading ? (
                 <p className="text-center py-12 font-black tracking-widest text-slate-400 text-sm">LOADING YOUR BOOKINGS...</p>
              ) : bookings.length === 0 ? (
                 <p className="text-center py-12 font-black tracking-widest text-slate-400 text-sm">NO CONFIRMED BOOKINGS YET.</p>
              ) : bookings.map((bk) => (
                <div key={bk.id} className="border border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 last:mb-0 hover:shadow-md transition-shadow bg-slate-50/50">
                  <div className="mb-6 md:mb-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase ${bk.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                        {bk.status}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">REF: {bk.id.substring(0, 8)}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{bk.package?.title || bk.package_id}</h3>
                    <p className="text-xs font-black tracking-widest text-slate-500 mt-2 uppercase">OPERATED BY {bk.assigned_agency_id}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    {bk.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancelBooking(bk.id)} className="text-[10px] tracking-[0.2em] uppercase font-black text-red-600 border-2 border-red-200 bg-red-50 px-6 py-3 rounded-xl hover:bg-red-100 transition-colors active:scale-95 text-center">
                        CANCEL BOOKING
                      </button>
                    )}
                    <button onClick={() => handleViewReceipt(bk.id)} className="text-[10px] tracking-[0.2em] uppercase font-black bg-white border-2 border-slate-200 text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors active:scale-95 text-center">
                      VIEW RECEIPT
                    </button>
                    <button onClick={() => handleDownloadItinerary(bk.id)} className="text-[10px] tracking-[0.2em] uppercase font-black bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-black transition-colors flex items-center justify-center active:scale-95">
                      <FileText className="mr-2 w-4 h-4" /> DOWNLOAD ITINERARY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
