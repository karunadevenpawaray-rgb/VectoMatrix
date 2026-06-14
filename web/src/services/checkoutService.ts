// import { supabase } from "@/lib/supabaseClient";
import { supabase } from "@/utils/supabase";
import { mockEngine } from "@vectormatrix/mock-engine";

// This file encapsulates the checkout logic, including Mock delays and Live Supabase insertions.
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

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
    if (USE_MOCK_DATA) {
      // Simulate payment processing and backend insertion
      await mockEngine.createLead({
        package_id: details.packageId,
        assigned_agency_id: details.agencyId,
        client_name: details.clientName,
        client_email: details.clientEmail,
        client_phone: details.clientPhone,
        calculated_total_mur: details.totalAmount,
        status: "PENDING",
        payment_status: "PAID" // Mock auto-paid
      });
      return { success: true };
    }

    // --- LIVE STRIPE INSERT & CHECKOUT ---
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Redirect to Stripe Checkout Session URL
      if (data.url) {
        window.location.href = data.url;
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
