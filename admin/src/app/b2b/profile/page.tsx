"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/authService";

export default function AgencyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const id = await authService.getCurrentAgencyId();
        if (id) {
          setAgencyId(id);
          const { supabase } = await import('@/utils/supabase');
          const { data, error } = await supabase
            .from('agencies')
            .select('*')
            .eq('id', id)
            .single();
          if (!error && data) {
            setAgencyName(data.name || "");
            setEmail(data.email || "");
            setPhone(data.phone || "");
            setBio(data.bio || "");
            setLogoUrl(data.logo_url || null);
          }
        }
      } catch (e) {
        console.error("Error loading agency profile:", e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- PREPARED SUPABASE STORAGE UPLOAD ---
    const { supabase } = await import('@/utils/supabase');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `agency-logos/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('package-images').upload(filePath, file);
    if (uploadError) alert(uploadError.message);
    else {
      const { data } = supabase.storage.from('package-images').getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyId) {
      alert("No active session found.");
      return;
    }
    setLoading(true);

    // --- PREPARED SUPABASE UPDATE ---
    const { supabase } = await import('@/utils/supabase');
    const { error } = await supabase.from('agencies').update({
      name: agencyName,
      email: email,
      phone: phone,
      bio: bio,
      logo_url: logoUrl
    }).eq('id', agencyId);
    if (error) alert(error.message);
    else alert("Profile Saved!");
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agency Profile</h1>
          <p className="text-gray-500 mt-1">Manage your public business details and contact information.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <form onSubmit={handleSave} className="p-8 space-y-8">
          
          {/* Logo Upload Mock */}
          <div className="flex items-center space-x-6 pb-8 border-b border-gray-100">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300 border-dashed overflow-hidden relative group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-400">🏢</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Company Logo</h3>
              <p className="text-xs text-gray-500 mb-3">Upload a high-res image (Max 2MB)</p>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="bg-white border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2 rounded shadow-sm hover:bg-gray-50">
                  Choose File...
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Legal Agency Name</label>
              <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Business Registration (BRN)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" defaultValue="C09876543" disabled />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Public Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp / Contact Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Agency Bio / Description</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
