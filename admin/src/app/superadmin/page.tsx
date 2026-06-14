"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  primaryColor: string;
  plugins: {
    stripeCheckout: boolean;
    promotionalBillboards: boolean;
    packageComparison: boolean;
    multipleImages: boolean;
  };
}
import { Shield, Power } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { useSuperAdminMetrics } from "@/hooks/useSuperAdminMetrics";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function SuperAdminPage() {
  const router = useRouter();
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
  const { metrics, loading, updateAgencyStatus } = useSuperAdminMetrics();
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [activeTenant, setActiveTenantState] = useState<TenantConfig | null>(null);

  /* Original useEffect commented out to preserve history:
  useEffect(() => {
    setTenants([]);
    setActiveTenantState(null);
  }, []);
  */

  useEffect(() => {
    setTenants([]);
    setActiveTenantState(null);

    const checkSuperAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/b2b/login");
          return;
        }

        const { data: superAdmin, error } = await supabase
          .from("super_admins")
          .select("id")
          .eq("auth_id", session.user.id)
          .single();

        if (error || !superAdmin) {
          router.push("/b2b/login");
          return;
        }

        setLoadingAdminCheck(false);
      } catch (err) {
        router.push("/b2b/login");
      }
    };

    checkSuperAdmin();
  }, [router]);

  const handleTenantSelect = (id: string) => {
    // Live Supabase implementation goes here
  };

  const handleTogglePlugin = (pluginKey: keyof TenantConfig["plugins"]) => {
    // Live Supabase implementation goes here
  };

  if (loadingAdminCheck) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6 text-center">
        <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 shadow-sm max-w-md">
          <div className="mx-auto h-12 w-12 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-bold text-white mb-2">Verifying Administrator Access</h1>
          <p className="text-gray-400 text-sm">Please wait while we authenticate your admin credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
      
      {/* Super Admin Sidebar */}
      <div className="w-full md:w-64 bg-gray-950 p-6 border-r border-gray-800">
        <h2 className="text-xl font-black text-white tracking-wider mb-8">VMX MASTER</h2>
        <nav className="space-y-4">
          <Link href="/superadmin" className="block px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg font-medium border border-blue-900/50">
            System Overview
          </Link>
          <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white transition-colors">Agencies</a>
          <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white transition-colors">All Leads</a>
          <a href="#" className="block px-4 py-2 text-gray-400 hover:text-white transition-colors">Global Settings</a>
        </nav>
        <div className="mt-auto pt-20">
          <Link href="/b2b/login" className="block text-sm text-gray-500 hover:text-white">← Exit to B2B Portal</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">System Overview</h1>
            <p className="text-gray-400 mt-1">Platform-wide statistics and health monitoring.</p>
          </div>
          <div className="flex items-center space-x-3 bg-green-900/20 px-4 py-2 rounded-full border border-green-900/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">All Systems Operational</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
             {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Agencies</p>
                <p className="text-3xl font-bold text-white">{metrics.recentAgencies.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Active Packages</p>
                <p className="text-3xl font-bold text-white">{metrics.totalActivePackages}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-2xl border border-blue-800">
                <p className="text-sm font-medium text-blue-300 mb-1">Total System GMV</p>
                <p className="text-3xl font-bold text-white">Rs {metrics.systemGMV.toLocaleString()}</p>
              </div>
            </div>

            {/* SaaS Multi-Tenant & Plugins Management */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="text-orange-500 w-5 h-5" /> SaaS Tenant & Plugins Configuration (Add-ons Manager)
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Manage active subdomains, client branding, and modular feature plugins.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tenant Selection */}
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-4">Select Active Tenant</h3>
                  <div className="space-y-3">
                    {tenants.map((t) => {
                      const isActive = activeTenant?.id === t.id;
                      return (
                        <div 
                          key={t.id}
                          onClick={() => handleTenantSelect(t.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isActive 
                              ? "bg-orange-500/10 border-orange-500 text-white" 
                              : "bg-gray-850 border-gray-750 text-gray-300 hover:bg-gray-800/80"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">{t.name}</p>
                              <p className="text-xs text-gray-400">Subdomain: {t.subdomain}.vectomatrix.com</p>
                            </div>
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: t.primaryColor }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Plugin Flags */}
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider mb-4">
                    Active Add-ons & Plugins ({activeTenant?.name || "None"})
                  </h3>
                  
                  {activeTenant ? (
                    <div className="space-y-4">
                      {Object.keys(activeTenant.plugins).map((pluginKey) => {
                        const isEnabled = activeTenant.plugins[pluginKey as keyof typeof activeTenant.plugins];
                        return (
                          <div key={pluginKey} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <div>
                              <p className="text-sm font-bold text-white uppercase tracking-wide">
                                {pluginKey.replace(/([A-Z])/g, ' $1')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {pluginKey === 'stripeCheckout' ? 'Enable Stripe payment integrations on B2C checkout.' :
                                 pluginKey === 'promotionalBillboards' ? 'Enable promotional rotating hero billboard system.' :
                                 pluginKey === 'packageComparison' ? 'Enable B2C comparison list and metrics overlay.' :
                                 'Enable B2B package multiple images gallery upload.'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleTogglePlugin(pluginKey as keyof typeof activeTenant.plugins)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isEnabled 
                                  ? "bg-orange-600 hover:bg-orange-700 text-white animate-pulse" 
                                  : "bg-gray-700 hover:bg-gray-650 text-gray-300"
                              }`}
                            >
                              <Power size={12} /> {isEnabled ? "Enabled" : "Disabled"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Please select a tenant to configure plugins.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Agencies List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Agency Applications & Partners</h2>
              
              {/* Legacy DataTable block commented out for safety:
              <DataTable 
                data={metrics.recentAgencies}
                columns={[
                  { accessorKey: 'name', header: 'Agency Name' },
                  { accessorKey: 'joined', header: 'Joined / Applied' },
                  { 
                    accessorKey: 'status', 
                    header: 'Status',
                    cell: (item) => (
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Active' || item.status === 'APPROVED' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 
                        item.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 
                        'bg-red-900/30 text-red-400 border border-red-800/50'
                      }`}>
                        {item.status}
                      </span>
                    )
                  },
                  {
                    header: 'Actions',
                    cell: (item) => (
                      item.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateAgencyStatus(item.id, 'APPROVED')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateAgencyStatus(item.id, 'REJECTED')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No actions</span>
                      )
                    )
                  }
                ]}
                searchKey="name"
              />
              */}
              <DataTable<any> 
                data={metrics.recentAgencies || []}
                columns={[
                  { accessorKey: 'name', header: 'Agency Name' },
                  { accessorKey: 'joined', header: 'Joined / Applied' },
                  { 
                    accessorKey: 'status', 
                    header: 'Status',
                    cell: (item: any) => (
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Active' || item.status === 'APPROVED' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 
                        item.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 
                        'bg-red-900/30 text-red-400 border border-red-800/50'
                      }`}>
                        {item.status}
                      </span>
                    )
                  },
                  {
                    header: 'Actions',
                    cell: (item: any) => (
                      item.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateAgencyStatus(item.id, 'APPROVED')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateAgencyStatus(item.id, 'REJECTED')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No actions</span>
                      )
                    )
                  }
                ]}
                searchPlaceholder="Search agency name..."
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
