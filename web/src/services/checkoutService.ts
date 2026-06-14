// import { supabase } from "@/lib/supabaseClient";
import { supabase } from "@/utils/supabase";

export interface CheckoutDetails {
  packageId: string;
  agencyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalAmount: number;
}

export const checkoutService = {
  async processCheckout(details: CheckoutDetails): Promise<{ success: boolean; error?: string }> {
    // --- LIVE SUPABASE INSERT ---
    try {
      const { error } = await supabase.from('leads').insert({
        package_id: details.packageId,
        assigned_agency_id: details.agencyId,
        client_name: details.clientName,
        client_email: details.clientEmail,
        client_phone: details.clientPhone,
        calculated_total_mur: details.totalAmount,
        status: "PENDING",
        payment_status: "UNPAID"
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
