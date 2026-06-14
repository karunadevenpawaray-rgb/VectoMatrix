import { supabase } from '@/utils/supabase';

// Live Supabase Auth

export const authService = {
  async login(email: string, password: string): Promise<{ user: any, error: any }> {
    // --- LIVE SUPABASE AUTH ---
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { user: data?.user, error };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
