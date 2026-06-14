import { supabase } from '@/utils/supabase';

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
  service_type?: string;
  is_active?: boolean;
  flight_included?: boolean;
  meal_plan?: string;
  is_featured?: boolean;
}

export const inventoryService = {
  async getPackages() {

    const { data: supaData, error } = await supabase.from('packages').select('*').eq('is_archived', false).order('created_at', { ascending: false });
    if (error) throw error;
    return supaData || [];
  },

  async createPackage(payload: PackagePayload) {

    const insertPayload = { ...payload, agency_id: payload.agency_id || 'CURRENT_USER_AGENCY_ID' };
    const { data, error } = await supabase.from('packages').insert(insertPayload).select().single();
    if (error) throw error;
    return data;
  },

  async updatePackage(id: string, payload: PackagePayload) {

    const { data, error } = await supabase.from('packages').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePackage(id: string) {

    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
