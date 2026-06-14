import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockEngine } from '@vectormatrix/mock-engine';

const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_ENGINE === 'true';
const engine = new MockEngine(AsyncStorage as any);

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
    if (USE_MOCK_DATA) {
      return await engine.getLeads();
    }
    // Live Supabase fetch here
    return [];
  },

  async submitLead(payload: MobileLeadPayload) {
    if (USE_MOCK_DATA) {
      // Simulate network request
      await new Promise(r => setTimeout(r, 1000));
      return { success: true };
    }

    // --- PREPARED SUPABASE INSERT ---
    /*
    const { error } = await supabase.from('leads').insert({
      package_id: payload.packageId,
      client_name: payload.name,
      client_email: payload.email,
      client_phone: payload.phone,
      status: 'PENDING',
      calculated_total_mur: 45000 // In reality, fetch package price
    });

    if (error) {
      throw error;
    }
    return { success: true };
    */
    
    return { success: true };
  }
};
