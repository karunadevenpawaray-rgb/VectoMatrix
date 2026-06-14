import { supabase } from '@/utils/supabase';
import { mockEngine } from '@vectormatrix/mock-engine';

// Legacy mock flag commented out for safety:
// const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true' && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : true);

export interface PackagePayload {
  id?: string;
  agency_id?: string;
  title: string;
  destination: string;
  base_price_mur: number;
  travel_month: string;
  hotel_name: string;
  hotel_stars?: number;
  description: string;
  gallery_images?: string[];
}

export const inventoryService = {
  async getPackages() {
    if (USE_MOCK_DATA) {
      return await mockEngine.getPackages();
    }

    const { data: supaData, error } = await supabase.from('packages').select('*').eq('is_archived', false).order('created_at', { ascending: false });
    if (error) throw error;
    return supaData || [];
  },

  async createPackage(payload: PackagePayload) {
    if (USE_MOCK_DATA) {
      return await mockEngine.createPackage(payload);
    }

    const insertPayload = { ...payload, agency_id: payload.agency_id || 'CURRENT_USER_AGENCY_ID' };
    const { data, error } = await supabase.from('packages').insert(insertPayload).select().single();
    if (error) throw error;
    return data;
  },

  async updatePackage(id: string, payload: PackagePayload) {
    if (USE_MOCK_DATA) {
      return await mockEngine.updatePackage(id, payload);
    }

    const { data, error } = await supabase.from('packages').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePackage(id: string) {
    if (USE_MOCK_DATA) {
      return await mockEngine.deletePackage(id);
    }

    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
