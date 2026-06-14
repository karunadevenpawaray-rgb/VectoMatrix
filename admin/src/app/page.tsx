import Link from "next/link";
import { Building2, ShieldAlert, Database, ArrowRight } from "lucide-react";

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">VectoMatrix System Hub</h1>
          <p className="text-slate-500 text-lg">Select an administrative portal to continue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* B2B Portal */}
          <Link 
            href="/b2b"
            className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">B2B Agency Portal</h2>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
              Manage leads, inventory, and analytics for travel agencies.
            </p>
            <div className="flex items-center text-orange-600 font-semibold text-sm">
              Enter Portal <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Superadmin Portal */}
          <Link 
            href="/superadmin"
            className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Superadmin</h2>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
              System-wide oversight, tenant management, and platform configuration.
            </p>
            <div className="flex items-center text-blue-600 font-semibold text-sm">
              Enter Portal <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Mock Engine Control */}
          <Link 
            href="/mock-admin"
            className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Mock Engine</h2>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
              Database controls, latency simulation, and mock data generation.
            </p>
            <div className="flex items-center text-purple-600 font-semibold text-sm">
              Enter Portal <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
