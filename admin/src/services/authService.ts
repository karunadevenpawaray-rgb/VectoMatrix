import { supabase } from '@/utils/supabase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

export const authService = {
  async login(email: string, password: string): Promise<{ user: any, error: any }> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      return { 
        user: { id: "mock-user-id", email }, 
        error: null 
      };
    }

    // --- LIVE SUPABASE AUTH ---
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { user: data?.user, error };
  },

  async logout(): Promise<void> {
    if (USE_MOCK_DATA) return;
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<any> {
    if (USE_MOCK_DATA) {
      return { id: "mock-user-id", email: "mock@example.com" };
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
