const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_ENGINE === 'true';

const MOCK_PACKAGES = [
  { id: '1', title: '5 Days Dubai Premium Desert Safari', destination: 'DUBAI', price: 'Rs 45,000', priceValue: 45000, duration: '5 Days', stars: 5, agency: 'Shammi Tours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { id: '2', title: 'Kuala Lumpur Shopping Fiesta', destination: 'MALAYSIA', price: 'Rs 32,000', priceValue: 32000, duration: '7 Days', stars: 4, agency: 'BlueSky Travel', image: 'https://images.unsplash.com/photo-1596422846543-75c6ff197f07?w=800&q=80' },
  { id: '3', title: 'Cape Town Explorer', destination: 'SOUTH AFRICA', price: 'Rs 58,000', priceValue: 58000, duration: '8 Days', stars: 4, agency: 'Silver Wings', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80' },
  { id: '4', title: 'Rodrigues Eco-Lodge Retreat', destination: 'RODRIGUES', price: 'Rs 15,000', priceValue: 15000, duration: '4 Days', stars: 3, agency: 'Shammi Tours', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80' },
];

export interface MobilePackageFilters {
  query: string;
  destination: string;
  maxPrice: number;
}

export const mobilePackageService = {
  async getPackages(filters: MobilePackageFilters) {
    let data = [];
    
    if (USE_MOCK_DATA) {
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      data = [...MOCK_PACKAGES];
    } else {
      // --- PREPARED SUPABASE FETCH ---
      /*
      const { data: supaData, error } = await supabase.from('packages').select('*, agency:agencies(name)').eq('is_active', true);
      if (!error && supaData) {
        // Map supaData to the format expected by the Mobile UI
        data = supaData.map(pkg => ({
          id: pkg.id,
          title: pkg.title,
          destination: pkg.destination,
          price: `Rs ${pkg.base_price_mur.toLocaleString()}`,
          priceValue: pkg.base_price_mur,
          duration: 'TBD',
          stars: pkg.hotel_stars || 4,
          agency: pkg.agency?.name || 'Unknown',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
        }));
      }
      */
    }

    // Filter Logic
    if (filters.query) {
      const q = filters.query.toLowerCase();
      data = data.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
    }
    if (filters.destination && filters.destination !== 'All') {
      data = data.filter(p => p.destination === filters.destination);
    }
    data = data.filter(p => p.priceValue <= filters.maxPrice);

    return data;
  }
};
