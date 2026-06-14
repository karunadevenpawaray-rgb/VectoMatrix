"use client";

import { useState, useEffect } from "react";
import { inventoryService, PackagePayload } from "@/services/inventoryService";
import { storageService } from "@/services/storageService";
import { saasConfigManager } from "@vectormatrix/mock-engine";

export default function InventoryPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("DUBAI");
  const [price, setPrice] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelStars, setHotelStars] = useState("4");
  const [travelMonth, setTravelMonth] = useState("");
  const [description, setDescription] = useState("• Daily Breakfast included\n• Return Airport Transfers\n• Desert Safari with BBQ Dinner");
  
  // Tenant Configuration
  const [tenant, setTenant] = useState<any>(null);
  
  // Storage Integration
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    saasConfigManager.loadDynamicPlugins();
    setTenant(saasConfigManager.getActiveTenant());
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getPackages();
      setPackages(data);
    } catch (error) {
      alert("Error fetching inventory");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPkgId(null);
    setTitle(""); setPrice(""); setHotelName(""); setDescription("• Daily Breakfast included\n• Return Airport Transfers\n• Desert Safari with BBQ Dinner");
    setGalleryImages([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `package-${Date.now()}-${file.name}`;
      const url = await storageService.uploadImage(file, fileName);
      setGalleryImages(prev => [...prev, url]);
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    /* Legacy payload creation commented out for safety:
    const payload: PackagePayload = {
      title, destination, base_price_mur: parseInt(price), travel_month: travelMonth, hotel_name: hotelName, hotel_stars: parseInt(hotelStars), description
    };
    */
    const payload: PackagePayload = {
      title, 
      destination, 
      base_price_mur: parseInt(price), 
      travel_month: travelMonth, 
      hotel_name: hotelName, 
      hotel_stars: parseInt(hotelStars), 
      description,
      gallery_images: galleryImages
    };

    try {
      if (editingPkgId) {
        await inventoryService.updatePackage(editingPkgId, payload);
        alert("Package updated successfully!");
      } else {
        await inventoryService.createPackage(payload);
        alert("Package created successfully!");
      }
      resetForm();
      fetchInventory();
    } catch (error: any) {
      alert(error.message || "Failed to save package");
    }
  };

  const handleEditClick = (pkg: any) => {
    setEditingPkgId(pkg.id);
    setTitle(pkg.title);
    setDestination(pkg.destination);
    setPrice(pkg.base_price_mur.toString());
    setTravelMonth(pkg.travel_month || "");
    setHotelName(pkg.hotel_name || "");
    setDescription(pkg.description || "• Daily Breakfast included\n• Return Airport Transfers\n• Desert Safari with BBQ Dinner");
    setGalleryImages(pkg.gallery_images || []);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await inventoryService.deletePackage(id);
      alert("Package deleted.");
      fetchInventory();
    } catch (error: any) {
      alert(error.message || "Failed to delete package");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Package Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your active holiday packages and itineraries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPkgId ? "Edit Package" : "Create New Package"}
              </h2>
              {editingPkgId && (
                <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              )}
            </div>
            <form onSubmit={handleCreateOrUpdatePackage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g. 5 Days Dubai Premium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="DUBAI">Dubai</option>
                    <option value="MALAYSIA">Malaysia</option>
                    <option value="SOUTH_AFRICA">South Africa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <input required type="month" value={travelMonth} onChange={(e) => setTravelMonth(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (MUR)</label>
                <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded-md" placeholder="35000" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input required type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stars</label>
                  <select value={hotelStars} onChange={(e) => setHotelStars(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>

              {/* RICH TEXT EDITOR MOCK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Description (Rich Text)</label>
                <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center space-x-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold" title="Bold">B</button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-700 italic" title="Italic">I</button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-700 underline" title="Underline">U</button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-700" title="Bullet List">• List</button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-700" title="Add Link">🔗 Link</button>
                  </div>
                  <textarea 
                    rows={5} 
                    className="w-full p-3 outline-none resize-y" 
                    placeholder="Describe the itinerary, inclusions, and exclusions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Content is automatically sanitized via XSS utils before publishing.</p>
              </div>
              {/* Image Input (Modular Plugin Toggle) */}
              {(!tenant || tenant.plugins.imageGalleryUpload) ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Images (Gallery)</label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm">
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading} 
                        className="hidden" 
                      />
                    </label>
                    {galleryImages.length > 0 && (
                      <span className="text-xs text-gray-500 font-bold">{galleryImages.length} image(s) added</span>
                    )}
                  </div>
                  {galleryImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {galleryImages.map((url, idx) => (
                        <div key={idx} className="relative group/img w-16 h-16 bg-slate-100 border rounded-md overflow-hidden">
                          <img src={url} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-600/90 text-white font-bold text-[10px] items-center justify-center opacity-0 group-hover/img:flex transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Single Cover Image URL (Core Basic)</label>
                  <input 
                    type="text" 
                    value={galleryImages[0] || ""} 
                    onChange={(e) => setGalleryImages([e.target.value])} 
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}

              <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors">
                {editingPkgId ? "Update Package" : "Publish Package"}
              </button>
            </form>
          </div>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (MUR)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading inventory...</td></tr>
                ) : packages.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No packages created yet.</td></tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{pkg.title}</p>
                        <p className="text-sm text-gray-500">{pkg.destination} • {pkg.travel_month}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">Rs {pkg.base_price_mur.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(pkg)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDeleteClick(pkg.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
