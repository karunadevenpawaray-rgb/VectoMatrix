import { sanitizeHTML } from "@/utils/sanitize";
// import { supabase } from '@/lib/supabaseClient';
// const supabase: any = null; // supabase for later
import { supabase } from "@/utils/supabase";
import { mockEngine } from '@vectormatrix/mock-engine';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

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
    if (USE_MOCK_DATA) {
      // Get all packages from the central mock engine
      let data = await mockEngine.getPackages();

      // Security: Sanitize the search query to prevent XSS in URL or logs
      const safeQuery = sanitizeHTML(filters.searchQuery).toLowerCase();

      // Advanced Filtering Algorithms
      if (safeQuery) {
        data = data.filter((d: any) => 
          d.title.toLowerCase().includes(safeQuery) || 
          d.hotel_name.toLowerCase().includes(safeQuery)
        );
      }
      if (filters.filterDestination) data = data.filter((d: any) => d.destination === filters.filterDestination);
      if (filters.filterMonth) data = data.filter((d: any) => d.travel_month === filters.filterMonth);
      if (filters.filterStars) data = data.filter((d: any) => d.hotel_stars === parseInt(filters.filterStars));
      if (filters.priceRange) data = data.filter((d: any) => d.base_price_mur <= filters.priceRange);

      // Sorting Logic
      if (filters.sortBy) {
        if (filters.sortBy === 'price-asc') data.sort((a: any, b: any) => a.base_price_mur - b.base_price_mur);
        else if (filters.sortBy === 'price-desc') data.sort((a: any, b: any) => b.base_price_mur - a.base_price_mur);
        else if (filters.sortBy === 'rating-desc') data.sort((a: any, b: any) => (b.hotel_stars || 0) - (a.hotel_stars || 0));
      }

      // Pagination Logic
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

      return { paginatedData, totalResults: data.length };
    } else {
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
      if (!error && supaData) {
        return { paginatedData: supaData, totalResults: count || 0 };
      }
      return { paginatedData: [], totalResults: 0 };
    }
  }
};
