'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { alerts } from '../utils/alerts';

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      alerts.info('Uploading image...', 'Please wait while we upload your file.');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError, data } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          onUpload(publicUrlData.publicUrl);
          alerts.success('Upload complete!', 'The image has been successfully uploaded.');
        }
      }
    } catch (error: any) {
      alerts.error('Upload failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
    </div>
  );
}
