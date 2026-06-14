"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function AgencyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [agencyId, setAgencyId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        // Get agency ID from metadata (implementation depends on your schema)
        const agencyId = user.user_metadata.agency_id;
        setAgencyId(agencyId);
        
        // Fetch agency data
        const { data, error: agencyError } = await supabase
          .from('agencies')
          .select('*')
          .eq('id', agencyId)
          .single();
          
        if (agencyError) throw agencyError;
        
        if (data) {
          setAgencyName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setLogoUrl(data.logo_url || null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // --- LIVE SUPABASE STORAGE UPLOAD ---
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `agency-logos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('package-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      return;
    }
    
    const { data } = supabase.storage
      .from('package-images')
      .getPublicUrl(filePath);
      
    setLogoUrl(data.publicUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agencyId) {
      alert("No agency ID found. Please log in again.");
      return;
    }
    
    setLoading(true);
    
    try {
      // --- LIVE SUPABASE UPDATE ---
      const { error } = await supabase
        .from('agencies')
        .update({
          name: agencyName,
          email: email,
          phone: phone,
          bio: bio,
          logo_url: logoUrl
        })
        .eq('id', agencyId);
        
      if (error) throw error;
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agency Profile</h1>
          <p className="text-gray-500 mt-1">Manage your public business details and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
            <div className="flex items-center gap-6">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" className="w-16 h-16 object-contain rounded-lg border" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-slate-400 text-xs">No logo</span>
                </div>
              )}
              <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-700 hover:border-slate-400 transition-colors">
                Upload Logo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., Shammi Tours Ltd"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., info@shammitours.mu"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., +23055551122"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all min-h-[120px]"
              placeholder="Tell customers about your agency..."
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
