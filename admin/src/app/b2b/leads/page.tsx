"use client";

import { useState, useEffect } from "react";
import { leadService } from "@/services/leadService";
import { DataTable, Column } from "../../../components/DataTable";
import { alerts } from "../../../utils/alerts";

type Lead = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  passenger_count: number;
  selected_insurance: string;
  include_esim: boolean;
  upgrade_private_car: boolean;
  calculated_total_mur: number;
  status: "PENDING" | "CLAIMED" | "CONVERTED" | "LOST";
  created_at: string;
  package: {
    title: string;
  };
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads();
      setLeads(data as Lead[]);
    } catch (error) {
      alerts.error("Failed to load leads", "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      // Optimistic Update
      setLeads((prev) => 
        prev.map((l) => l.id === leadId ? { ...l, status: newStatus as any } : l)
      );
      await leadService.updateLeadStatus(leadId, newStatus);
      alerts.success("Status Updated", `Lead status changed to ${newStatus}`);
    } catch (error) {
      alerts.error("Update Failed", "Failed to update lead status");
      fetchLeads(); // Revert on failure
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CLAIMED": return "bg-blue-100 text-blue-800";
      case "CONVERTED": return "bg-green-100 text-green-800";
      case "LOST": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-gray-500 mt-1">Track and manage incoming customer inquiries.</p>
        </div>
      </div>

      <div className="mb-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading pipeline...</div>
        ) : (
          <DataTable 
            columns={[
              {
                header: "Client Details",
                accessorKey: "client_name",
                cell: (row) => (
                  <div>
                    <p className="font-bold text-gray-900">{row.client_name}</p>
                    <p className="text-xs text-gray-500">{row.client_email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{row.client_phone}</p>
                  </div>
                )
              },
              {
                header: "Package Inquiry",
                accessorKey: "package",
                cell: (row) => (
                  <div>
                    <p className="font-semibold text-gray-800">{row.package?.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Passengers: {row.passenger_count}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(row.created_at).toLocaleDateString()}</p>
                  </div>
                )
              },
              {
                header: "Manifest / Add-ons",
                cell: (row) => (
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>🛡️ {row.selected_insurance}</li>
                    {row.include_esim && <li className="text-blue-600 font-medium">📶 Global eSIM Included</li>}
                    {row.upgrade_private_car && <li className="text-purple-600 font-medium">🚗 Private Sedan Upgrade</li>}
                  </ul>
                )
              },
              {
                header: "Total (MUR)",
                accessorKey: "calculated_total_mur",
                cell: (row) => <span className="font-black text-gray-900">Rs {row.calculated_total_mur.toLocaleString()}</span>
              },
              {
                header: "Status Pipeline",
                accessorKey: "status",
                cell: (row) => (
                  <select 
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className={`text-xs font-bold rounded-full px-3 py-1 outline-none cursor-pointer border-0 shadow-sm ring-1 ring-inset ring-gray-200 ${getStatusColor(row.status)}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CLAIMED">Claimed</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                )
              }
            ]}
            data={leads} 
            searchPlaceholder="Search leads by name, email, or package..."
            renderGridCard={(row) => (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(row.status)}`}>{row.status}</span>
                    <span className="font-black text-gray-900">Rs {row.calculated_total_mur.toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{row.client_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{row.client_email}</p>
                  <p className="text-xs text-blue-600 font-medium mb-3">{row.client_phone}</p>
                  <div className="text-sm bg-gray-50 p-2 rounded-lg mb-2 border border-gray-100">
                    <p className="font-semibold text-gray-800 line-clamp-1" title={row.package?.title}>{row.package?.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Passengers: {row.passenger_count}</p>
                  </div>
                </div>
                <select 
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  className="w-full mt-4 text-sm font-medium rounded-lg px-3 py-2 outline-none cursor-pointer border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CLAIMED">Claimed</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
