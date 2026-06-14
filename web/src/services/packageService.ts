import { sanitizeHTML } from "@/utils/sanitize";
import { supabase } from "@/utils/supabase";

export interface PackageFilters {
  searchQuery: string;
  filterDestination: string;
  filterMonth: string;
  filterStars: string;
  priceRange: number;
  sortBy?: string;
}

export const packageService = {
  async getFilteredPackages(filters: PackageFilters, currentPage: number, itemsPerPage: number) {
    // --- LIVE SUPABASE FETCH ---
      let query = supabase
        .from('packages')
        .select(`*, agency:agencies(name)`, { count: 'exact' })
        .eq('is_active', true)
        .eq('is_archived', false);

      const safeSearchQuery = sanitizeHTML(filters.searchQuery).toLowerCase();
      if (safeSearchQuery) {
        query = query.or(`title.ilike.%${safeSearchQuery}%,hotel_name.ilike.%${safeSearchQuery}%`);
      }
      if (filters.filterDestination) {
        query = query.eq('destination', filters.filterDestination);
      }
      if (filters.filterMonth) {
        query = query.eq('travel_month', filters.filterMonth);
      }
      if (filters.filterStars) {
        query = query.eq('hotel_stars', parseInt(filters.filterStars));
      }
      if (filters.priceRange) {
        query = query.lte('base_price_mur', filters.priceRange);
      }

      // Sorting Logic
      if (filters.sortBy === 'price-asc') {
        query = query.order('base_price_mur', { ascending: true });
      } else if (filters.sortBy === 'price-desc') {
        query = query.order('base_price_mur', { ascending: false });
      } else if (filters.sortBy === 'rating-desc') {
        query = query.order('hotel_stars', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false }); // Default sort
      }

      // Pagination Logic
      const startIndex = (currentPage - 1) * itemsPerPage;
      query = query.range(startIndex, startIndex + itemsPerPage - 1);

      const { data: supaData, count, error } = await query;
      /* Original code:
      if (!error && supaData) {
        return { paginatedData: supaData, totalResults: count || 0 };
      }
      return { paginatedData: [], totalResults: 0 };
      */
      if (error) {
        console.error("Failed to query packages:", error);
        throw error;
      }
      return { paginatedData: supaData || [], totalResults: count || 0 };
    },
    // },

  async getPackageById(id: string) {
      const { data, error } = await supabase
        .from('packages')
        .select(`*, agency:agencies(name)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
  }
};
