"use client";

import { useState, useEffect } from "react";
import { inventoryService } from "@/services/inventoryService";
import { storageService } from "@/services/storageService";

export default function InventoryPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("DUBAI");
  const [price, setPrice] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelStars, setHotelStars] = useState("4");
  const [travelMonth, setTravelMonth] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("package");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getPackages();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload images if any
      let uploadedImageUrls: string[] = [];
      if (galleryImages.length > 0) {
        for (const image of galleryImages) {
          const imageUrl = await storageService.uploadImage(image, `packages/${Date.now()}_${image.name}`);
          uploadedImageUrls.push(imageUrl);
        }
      }
      
      const payload = {
        title,
        destination,
        base_price_mur: parseFloat(price),
        travel_month: travelMonth,
        hotel_name: hotelName,
        hotel_stars: parseInt(hotelStars),
        description,
        service_type: serviceType,
        gallery_images: uploadedImageUrls
      };
      
      await inventoryService.createPackage(payload);
      alert("Package created successfully!");
      
      // Reset form
      setTitle("");
      setDestination("DUBAI");
      setPrice("");
      setHotelName("");
      setHotelStars("4");
      setTravelMonth("");
      setDescription("");
      setGalleryImages([]);
      setImagePreviews([]);
      
      fetchInventory();
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(files);
      
      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await inventoryService.deletePackage(id);
        alert("Package deleted successfully!");
        fetchInventory();
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Package Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your travel packages and offerings.</p>
        </div>
      </div>

      {/* Create New Package Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Package</h2>
        
        <form onSubmit={handleCreatePackage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Package Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., 5 Days Dubai Premium Desert Safari"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              required
            >
              <option value="DUBAI">Dubai</option>
              <option value="MALAYSIA">Malaysia</option>
              <option value="SOUTH_AFRICA">South Africa</option>
              <option value="RODRIGUES">Rodrigues</option>
              <option value="REUNION">Réunion</option>
              <option value="MALDIVES">Maldives</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Base Price (MUR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., 45000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Travel Month</label>
            <input
              type="month"
              value={travelMonth}
              onChange={(e) => setTravelMonth(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hotel Name</label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              placeholder="e.g., Atlantis The Palm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hotel Stars</label>
            <select
              value={hotelStars}
              onChange={(e) => setHotelStars(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
              required
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all min-h-[120px]"
              placeholder="Describe the package..."
              required
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Gallery Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
            />
            
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>

      {/* Package Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-gray-900">Your Packages</h2>
          <p className="text-gray-500 mt-1">{packages.length} packages in inventory</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {packages.map((pkg) => (
            <div key={pkg.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{pkg.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{pkg.destination} • {pkg.hotel_name} ({pkg.hotel_stars} stars)</p>
                <p className="text-slate-900 font-bold mt-2">Rs {pkg.base_price_mur.toLocaleString()} MUR</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Handle edit functionality
                    console.log("Edit package:", pkg.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
