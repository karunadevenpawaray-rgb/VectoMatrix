// Lead Service: Handles data access for incoming customer leads

import { supabase } from '@/utils/supabase';

export const leadService = {
  async getLeads() {
    // --- LIVE SUPABASE FETCH ---
    // RLS ensures agencies only see leads assigned to them.
    const { data: supaData, error } = await supabase
      .from('leads')
      .select('*, package:packages(title)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Fetch Leads Error:", error);
      throw error;
    }
    return supaData || [];
  },

  async updateLeadStatus(leadId: string, newStatus: string) {
    // --- LIVE SUPABASE UPDATE ---
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      console.error("Update Lead Error:", error);
      throw error;
    }

    // If status is CONVERTED, trigger the SMTP Engine via API Route
    if (newStatus === 'CONVERTED') {
      try {
        const leadRes = await supabase.from('leads').select('*, package:packages(title)').eq('id', leadId).single();
        if (leadRes.data) {
          await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agencyId: leadRes.data.assigned_agency_id,
              type: 'LEAD_CONVERTED',
              toEmail: leadRes.data.client_email,
              variables: {
                client_name: leadRes.data.client_name,
                package_title: leadRes.data.package.title,
                total_amount: leadRes.data.calculated_total_mur
              }
            })
          });
        }
      } catch (err) {
        console.error("Failed to trigger conversion email:", err);
      }
    }

    return true;
  }
};
