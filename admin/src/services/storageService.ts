import { supabase } from '@/utils/supabase';

export const storageService = {
  /**
   * Uploads an image to the Supabase 'assets' bucket
   * @param file The File object from an <input type="file">
   * @param path The path inside the bucket (e.g. 'packages/pkg-123.jpg')
   * @returns The public URL of the uploaded image
   */
  async uploadImage(file: File, path: string): Promise<string> {
    // --- LIVE SUPABASE STORAGE ---
    const { data, error } = await supabase.storage
      .from('vmx-assets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Storage Upload Error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('vmx-assets').getPublicUrl(path);
    return publicUrl;
  },

  /**
   * Deletes an image from the 'vmx-assets' bucket
   */
  async deleteImage(path: string): Promise<boolean> {
    const { error } = await supabase.storage.from('vmx-assets').remove([path]);
    
    if (error) {
      console.error('Storage Delete Error:', error);
      throw error;
    }
    return true;
  }
};
