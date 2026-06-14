import { supabase } from '../utils/supabase';
export interface MobileLeadPayload {
  packageId: string;
  agencyId: string;
  name: string;
  email: string;
  phone: string;
  total: number;
}

export const mobileLeadService = {
  async getLeads() {
    // Live Supabase fetch here
    return [];
  },

  async submitLead(payload: MobileLeadPayload) {
    // --- PREPARED SUPABASE INSERT ---
    const { error } = await supabase.from('leads').insert({
      package_id: payload.packageId,
      client_name: payload.name,
      client_email: payload.email,
      client_phone: payload.phone,
      status: 'PENDING',
      calculated_total_mur: payload.total || 45000
    });

    if (error) {
      throw error;
    }
    return { success: true };
    return { success: true };
  }
};
