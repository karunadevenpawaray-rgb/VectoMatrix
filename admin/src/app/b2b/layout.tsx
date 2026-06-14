"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // In a real app, redirect to login page. For this spec, we'll simulate an auth block.
      // router.push("/login");
      setLoading(false);
      return;
    }

    // Fetch the agency name matching the authenticated user
    const { data, error } = await supabase
      .from("agencies")
      .select("name")
      .eq("auth_id", session.user.id)
      .single();

    if (data && !error) {
      setAgencyName(data.name);
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

  // Fallback for UI visualization if user bypasses login in dev mode
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
