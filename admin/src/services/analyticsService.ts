import { supabase } from '@/utils/supabase';

// Analytics Service: Fetches metrics for B2B portal and Super Admin

// Legacy mock flag commented out for safety:
// const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true' && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : true);

export const analyticsService = {
  async getAgencyMetrics(agencyId: string) {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 800));
      return {
        totalLeads: 124,
        conversionRate: 28,
        revenueGenerated: 1450000,
        activePackages: 15,
        recentActivity: [
          { id: 1, action: "Lead Converted", detail: "Jean Dupont - 5 Days Dubai", time: "2 hours ago", amount: 45000 },
          { id: 2, action: "New Package Published", detail: "Maldives Honeymoon Special", time: "5 hours ago", amount: 0 },
          { id: 3, action: "New Lead Received", detail: "Sarah Lee - Kuala Lumpur", time: "1 day ago", amount: 32000 }
        ]
      };
    }

    // --- LIVE SUPABASE AGGREGATION ---
    const { data, error } = await supabase.rpc('get_agency_metrics', { p_agency_id: agencyId });
    if (error) {
      console.error("Failed to fetch analytics:", error);
      return null;
    }
    return data;
  },

  async getSuperAdminMetrics() {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 800));
      return {
        totalAgencies: 24,
        totalActivePackages: 156,
        systemGMV: 14500000,
        recentAgencies: [
          { id: 1, name: "Shammi Tours", joined: "Oct 2025", status: "Active" },
          { id: 2, name: "BlueSky Travel", joined: "Nov 2025", status: "Active" },
          { id: 3, name: "Silver Wings Travel", joined: "Jan 2026", status: "Pending Verification" }
        ]
      };
    }

    // --- LIVE SUPABASE AGGREGATION ---
    const { data, error } = await supabase.rpc('get_superadmin_metrics');
    if (error) {
      console.error("Failed to fetch superadmin metrics:", error);
      return null;
    }
    return data;
  }
};
