"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const [agencyStatus, setAgencyStatus] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/b2b/login");
      return;
    }

    // Fetch the agency status and name matching the authenticated user
    const { data, error } = await supabase
      .from("agencies")
      .select("name, status")
      .eq("auth_id", session.user.id)
      .single();

    if (data && !error) {
      setAgencyName(data.name);
      setAgencyStatus(data.status);
    } else {
      // If auth user exists but has no agency profile, check if they are superadmin
      const { data: superAdmin } = await supabase
        .from('super_admins')
        .select('id')
        .eq('auth_id', session.user.id)
        .single();
      if (superAdmin) {
        router.push("/superadmin");
        return;
      }
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Vendor Portal...</div>;
  }

  if (agencyStatus && agencyStatus !== 'APPROVED' && agencyStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md">
          <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-3xl">
            ⏳
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Under Review</h1>
          <p className="text-gray-500 mb-6">
            Your agency profile is currently pending verification. You will be able to access the vendor portal once approved by the Super Admin.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-lg font-bold transition-all text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const currentAgency = agencyName || "Demo Agency (Unauthenticated)";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black text-blue-500 tracking-tight">VECTOMATRIX</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Vendor Portal</p>
        </div>
        
        <div className="p-4 flex-grow space-y-2">
          <Link href="/b2b/analytics" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname.includes('analytics') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            📊 Analytics
          </Link>
          <Link href="/b2b/inventory" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname.includes('inventory') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            📦 Package Inventory
          </Link>
          <Link href="/b2b/leads" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname.includes('leads') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            👥 Lead Pipeline
          </Link>
          <div className="pt-4 mt-2 border-t border-gray-800"></div>
          <Link href="/b2b/profile" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname.includes('profile') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            🏢 Agency Profile
          </Link>
          <Link href="/b2b/settings" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${pathname.includes('settings') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            ⚙️ Settings & Add-ons
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              🏢
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 uppercase font-bold">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{currentAgency}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
