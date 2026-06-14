import { supabase } from '@/utils/supabase';

// Analytics Service: Fetches metrics for B2B portal and Super Admin

export const analyticsService = {
  async getAgencyMetrics(agencyId: string) {
    const { data, error } = await supabase.rpc('get_agency_metrics', { p_agency_id: agencyId });
    if (error) {
      console.error("Failed to fetch analytics:", error);
      return null;
    }
    return data;
  },

  async getSuperAdminMetrics() {
    // --- LIVE SUPABASE AGGREGATION ---
    const { data, error } = await supabase.rpc('get_superadmin_metrics');
    if (error) {
      console.error("Failed to fetch superadmin metrics:", error);
      return null;
    }
    return data;
  }
};
