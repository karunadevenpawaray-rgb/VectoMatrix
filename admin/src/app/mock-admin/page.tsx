"use client";

import { useState, useEffect } from "react";
import { mockEngine } from "@vectormatrix/mock-engine";
import Link from "next/link";
import { DataTable, Column } from "../../components/DataTable";
import { alerts } from "../../utils/alerts";

export default function MockAdminPage() {
  const [config, setConfig] = useState({ latencyMs: 0, errorRatePercent: 0, offlineMode: false });
  const [loading, setLoading] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    totalPackages: 0,
    revenue: 0,
    conversionRate: 68 // Mock static
  });
  const [billboards, setBillboards] = useState<any[]>([]);
  const [newBillboard, setNewBillboard] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    cta_text: "Book Now",
    cta_link: "/"
  });
  const [editingBillboardId, setEditingBillboardId] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
    loadDashboardData();
    
    // Poll the offline queue every few seconds for realtime visibility
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const c = await mockEngine.getConfig();
    setConfig(c);
    setLoading(false);
  };

  const loadDashboardData = async () => {
    // 1. Read Offline Queue from shared localStorage
    const queueRaw = localStorage.getItem('vmx_offline_queue');
    if (queueRaw) {
      try {
        setOfflineQueue(JSON.parse(queueRaw));
      } catch (e) {
        setOfflineQueue([]);
      }
    } else {
      setOfflineQueue([]);
    }

    // 2. Read basic mock stats
    const leads = await mockEngine.getLeads();
    const pkgs = await mockEngine.getPackages();
    
    // Read billboards
    try {
      const bList = await (mockEngine as any).getBillboards();
      setBillboards(bList || []);
    } catch (e) {
      console.error(e);
    }
    
    const rev = leads.filter((l: any) => l.status === 'CONVERTED' || l.status === 'PAID')
                     .reduce((sum: number, l: any) => sum + (l.calculated_total_mur || 0), 0);
    
    setAnalytics({
      totalLeads: leads.length,
      totalPackages: pkgs.length,
      revenue: rev,
      conversionRate: leads.length > 0 ? Math.round((leads.filter((l: any) => l.status === 'CONVERTED' || l.status === 'PAID').length / leads.length) * 100) : 0
    });
  };

  const updateConfig = async (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    await mockEngine.updateConfig(newConfig);
  };

  const resetData = async () => {
    if (confirm("Reset all mock data to factory defaults?")) {
      alerts.loading("Resetting Data...");
      await mockEngine.resetData();
      await loadDashboardData();
      alerts.closeLoading();
      alerts.success("Mock Data Reset!", "Factory defaults have been restored.");
    }
  };

  const clearQueue = () => {
    localStorage.removeItem('vmx_offline_queue');
    setOfflineQueue([]);
    alerts.info("Queue Cleared", "The offline synchronization queue has been emptied.");
  };

  const handleCreateBillboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillboard.title || !newBillboard.image_url) {
      alerts.error("Validation Error", "Title and Image URL are required.");
      return;
    }
    if (editingBillboardId) {
      await (mockEngine as any).updateBillboard(editingBillboardId, newBillboard);
      alerts.success("Updated!", "Billboard has been updated.");
      setEditingBillboardId(null);
    } else {
      await (mockEngine as any).createBillboard(newBillboard);
      alerts.success("Created!", "Billboard has been created.");
    }
    setNewBillboard({ title: "", subtitle: "", image_url: "", cta_text: "Book Now", cta_link: "/" });
    loadDashboardData();
  };

  const handleEditBillboard = (b: any) => {
    setEditingBillboardId(b.id);
    setNewBillboard({
      title: b.title,
      subtitle: b.subtitle || "",
      image_url: b.image_url,
      cta_text: b.cta_text || "Book Now",
      cta_link: b.cta_link || "/"
    });
  };

  const handleDeleteBillboard = async (id: string) => {
    if (confirm("Are you sure you want to delete this billboard?")) {
      await (mockEngine as any).deleteBillboard(id);
      alerts.success("Deleted", "Billboard removed.");
      loadDashboardData();
    }
  };

  const columns: Column<any>[] = [
    { header: "Timestamp", accessorKey: "_timestamp", cell: () => <span className="font-mono text-gray-300">{new Date().toLocaleTimeString()}</span> },
    { header: "Target ID", accessorKey: "package_id", cell: (row) => <span className="font-mono text-blue-400">{row.package_id || row.packageId || 'UNKNOWN'}</span> },
    { header: "Client Name", accessorKey: "client_name", cell: (row) => <span>{row.client_name || row.name || 'Anonymous'}</span> },
    { header: "Amount", accessorKey: "calculated_total_mur", cell: (row) => <span className="text-green-400">Rs {row.calculated_total_mur?.toLocaleString() || row.totalAmount?.toLocaleString()}</span> },
    { header: "Status", accessorKey: "status", cell: () => <span className="bg-yellow-900/50 text-yellow-500 text-xs px-2 py-1 rounded font-bold border border-yellow-900">PENDING SYNC</span> }
  ];

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">HIDDEN</span>
              Mock Engine Manager
            </h1>
            <p className="text-gray-400 mt-1">Configure artificial constraints and analyze simulated traffic.</p>
          </div>
          <Link href="/b2b" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
            Exit to B2B
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Network Simulation */}
          <div className="md:col-span-1 bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
            <h2 className="text-xl font-bold text-white mb-4">Network Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>Artificial Latency (ms)</span>
                  <span className="text-blue-400">{config.latencyMs}ms</span>
                </label>
                <input 
                  type="range" min="0" max="3000" step="100" 
                  value={config.latencyMs} 
                  onChange={(e) => updateConfig('latencyMs', parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>Error Rate (%) - Simulates 500s</span>
                  <span className="text-red-400">{config.errorRatePercent}%</span>
                </label>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={config.errorRatePercent} 
                  onChange={(e) => updateConfig('errorRatePercent', parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div>
                  <p className="font-bold text-white">Offline Mode</p>
                  <p className="text-xs text-gray-500">Force Network Errors</p>
                </div>
                <button 
                  onClick={() => updateConfig('offlineMode', !config.offlineMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.offlineMode ? 'bg-red-500' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.offlineMode ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-bold text-gray-400 mb-3">Dev Tools</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      const data = await mockEngine.exportState();
                      const blob = new Blob([data], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `vmx_mock_state_${Date.now()}.json`;
                      a.click();
                      alerts.success("Export Successful", "JSON state file downloaded.");
                    }}
                    className="flex-1 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors text-sm font-bold"
                  >
                    ⬇️ Export
                  </button>
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      input.onchange = async (e: any) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          try {
                            await mockEngine.importState(event.target?.result as string);
                            await loadDashboardData();
                            await loadConfig();
                            alerts.success("Import Successful", "Mock engine state has been restored.");
                          } catch (err) {
                            alerts.error("Import Failed", "Invalid JSON format.");
                          }
                        };
                        reader.readAsText(file);
                      };
                      input.click();
                    }}
                    className="flex-1 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors text-sm font-bold"
                  >
                    ⬆️ Import
                  </button>
                </div>
                
                <button 
                  onClick={resetData}
                  className="w-full py-3 mt-3 bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/80 transition-colors font-bold text-sm"
                >
                  ⚠️ Factory Reset DB
                </button>
              </div>
            </div>
          </div>

          {/* Mock Analytics Dashboard */}
          <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Mock Business Intelligence</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Leads</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{analytics.totalLeads}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold">Active Packages</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{analytics.totalPackages}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{analytics.conversionRate}%</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold">Mock Revenue</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">Rs {analytics.revenue.toLocaleString()}</p>
              </div>
            </div>

            {/* CSS Chart */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-400 mb-4">Simulated Traffic Flow</h3>
              <div className="flex h-40 items-end gap-2 px-2 border-b border-l border-gray-700 pb-2">
                <div className="w-1/6 bg-blue-600/50 hover:bg-blue-500 rounded-t-md transition-all relative group" style={{ height: '40%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-xs py-1 px-2 rounded">Mon</div>
                </div>
                <div className="w-1/6 bg-blue-600/50 hover:bg-blue-500 rounded-t-md transition-all relative group" style={{ height: '60%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-xs py-1 px-2 rounded">Tue</div>
                </div>
                <div className="w-1/6 bg-blue-600/80 hover:bg-blue-500 rounded-t-md transition-all relative group" style={{ height: '85%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-xs py-1 px-2 rounded">Wed</div>
                </div>
                <div className="w-1/6 bg-blue-600/50 hover:bg-blue-500 rounded-t-md transition-all relative group" style={{ height: '50%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-xs py-1 px-2 rounded">Thu</div>
                </div>
                <div className="w-1/6 bg-blue-600/30 hover:bg-blue-500 rounded-t-md transition-all relative group" style={{ height: '30%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-xs py-1 px-2 rounded">Fri</div>
                </div>
                <div className="w-1/6 bg-purple-600/80 hover:bg-purple-500 rounded-t-md transition-all relative group" style={{ height: '100%' }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-purple-900 text-xs py-1 px-2 rounded whitespace-nowrap">Peak (Sat)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billboard Management UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Billboard Form */}
          <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingBillboardId ? "Edit Billboard" : "Create Billboard"}
            </h2>
            <form onSubmit={handleCreateBillboard} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Days Dubai Premium Safari"
                  value={newBillboard.title}
                  onChange={(e) => setNewBillboard({ ...newBillboard, title: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Subtitle</label>
                <textarea
                  placeholder="Short description text"
                  value={newBillboard.subtitle}
                  onChange={(e) => setNewBillboard({ ...newBillboard, subtitle: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newBillboard.image_url}
                  onChange={(e) => setNewBillboard({ ...newBillboard, image_url: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={newBillboard.cta_text}
                    onChange={(e) => setNewBillboard({ ...newBillboard, cta_text: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={newBillboard.cta_link}
                    onChange={(e) => setNewBillboard({ ...newBillboard, cta_link: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
                >
                  {editingBillboardId ? "Save Changes" : "Create"}
                </button>
                {editingBillboardId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBillboardId(null);
                      setNewBillboard({ title: "", subtitle: "", image_url: "", cta_text: "Book Now", cta_link: "/" });
                    }}
                    className="bg-gray-700 hover:bg-gray-650 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Active Billboards List */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🖼️</span> Active Promotional Billboards ({billboards.length})
            </h2>
            
            {billboards.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
                <p className="text-gray-500 font-mono">No billboards configured.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                {billboards.map((b) => (
                  <div key={b.id} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 transition-all flex flex-col justify-between">
                    <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${b.image_url})` }}>
                      <div className="h-full w-full bg-black/60 p-4 flex flex-col justify-end">
                        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded w-fit mb-1">
                          {b.cta_text || 'PROMO'}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate">{b.title}</h3>
                        <p className="text-[10px] text-gray-300 truncate">{b.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900 flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-mono truncate max-w-[120px]">{b.cta_link}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBillboard(b)}
                          className="text-blue-400 hover:text-blue-300 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBillboard(b.id)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Offline Queue UI */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-xl">📡</span>
              Offline Synchronization Queue
            </h2>
            <button onClick={clearQueue} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-gray-300">
              Clear Queue
            </button>
          </div>
          
          {offlineQueue.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
              <p className="text-gray-500 font-mono">No pending items in vmx_offline_queue.</p>
              <p className="text-gray-600 text-xs mt-2">Toggle "Offline Mode" and submit a booking to see it trapped here.</p>
            </div>
          ) : (
            <div className="dark">
              <DataTable 
                columns={columns} 
                data={offlineQueue.map((item, i) => ({ ...item, id: i }))}
                searchPlaceholder="Search queue..."
                itemsPerPageOptions={[5, 10, 25]}
                renderGridCard={(row) => (
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 font-mono">{new Date().toLocaleTimeString()}</span>
                      <span className="bg-yellow-900/50 text-yellow-500 text-xs px-2 py-1 rounded font-bold border border-yellow-900">
                        PENDING
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg">{row.client_name || row.name || 'Anonymous'}</h3>
                    <p className="text-sm text-blue-400 font-mono my-2">{row.package_id || row.packageId || 'UNKNOWN'}</p>
                    <div className="pt-2 border-t border-gray-800 flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">Amount</span>
                      <span className="text-green-400 font-bold">Rs {row.calculated_total_mur?.toLocaleString() || row.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
