"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { checkoutService } from "@/services/checkoutService";
import { packageService } from "@/services/packageService";

/* Legacy declaration commented out for safety:
export default function CheckoutPage() {
*/
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package') || 'pkg-3'; // Default to Hotel for testing

  const [loading, setLoading] = useState(false);

  // URL & Mock Loading
  const [pkg, setPkg] = useState<any>(null);
  const [loadingPkg, setLoadingPkg] = useState(true);

  // Dynamic Booking State
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  const [mealPlan, setMealPlan] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  // Pricing Engine State
  const [pricing, setPricing] = useState({ baseTotal: 0, serviceFeeAmount: 0, markupPercent: 0, finalTotal: 0 });

  useEffect(() => {
    loadPackage(packageId);
  }, [packageId]);

  const loadPackage = async (id: string) => {
    try {
      const data = await packageService.getPackageById(id);
      if (data) {
        setPkg(data);
        if (data.service_type === 'hotel' && data.meal_plans) {
          const validMeals = data.meal_plans.filter((m: string) => m !== "Room Only");
          if (validMeals.length > 0) setMealPlan(validMeals[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPkg(false);
    }
  };

  useEffect(() => {
    if (pkg) {
      const basePrice = pkg.base_price_mur || 0;
      const calculatedBase = basePrice * (adults * 1 + teens * 0.75 + children * 0.5);
      const serviceFee = calculatedBase * 0.05; // 5% mockup
      setPricing({
        baseTotal: calculatedBase,
        serviceFeeAmount: serviceFee,
        markupPercent: 5,
        finalTotal: calculatedBase + serviceFee
      });
    }
  }, [pkg, adults, teens, children, infants, mealPlan]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, error } = await checkoutService.processCheckout({
      packageId: pkg?.id || 'unknown',
      agencyId: pkg?.agency_id || 'unknown',
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      totalAmount: pricing.finalTotal
    });

    if (success) {
      router.push('/checkout/confirmation');
    } else {
      alert("Error processing checkout: " + error);
    }
    setLoading(false);
  };

  if (loadingPkg) return <div className="min-h-screen py-24 text-center font-['var(--font-outfit)'] font-black text-2xl tracking-tight text-slate-500">LOADING...</div>;

  const totalPax = adults + teens + children + infants;

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-['var(--font-outfit)']">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <Link href={`/package/${pkg.id}`} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-700 flex items-center transition-colors">
            <span className="mr-2 text-lg leading-none">&larr;</span> BACK TO {pkg.title.toUpperCase()}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 leading-[1.1] tracking-tight">REQUEST A<br/><span className="text-red-600">QUOTE</span></h1>
          <p className="text-lg text-slate-500 mt-4 max-w-md">Complete your details below to request a personalized quote for this experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Booking Configuration */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
               <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
                <span className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-xl">1</span>
                BOOKING CONFIGURATION
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Adults (18+)</label>
                    <input type="number" min="1" value={adults} onChange={e => setAdults(parseInt(e.target.value) || 1)} className="w-full pl-4 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Teens (13-17)</label>
                    <input type="number" min="0" value={teens} onChange={e => setTeens(parseInt(e.target.value) || 0)} className="w-full pl-4 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Children (2-12)</label>
                    <input type="number" min="0" value={children} onChange={e => setChildren(parseInt(e.target.value) || 0)} className="w-full pl-4 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Infants (0-2)</label>
                    <input type="number" min="0" value={infants} onChange={e => setInfants(parseInt(e.target.value) || 0)} className="w-full pl-4 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]} 
                    required 
                    value={bookingDate} 
                    onChange={e => setBookingDate(e.target.value)} 
                    className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" 
                  />
                </div>

                {pkg.service_type === 'hotel' && pkg.meal_plans && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Meal Plan</label>
                    <select 
                      value={mealPlan} 
                      onChange={(e) => setMealPlan(e.target.value)}
                      className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all"
                    >
                      {pkg.meal_plans.filter((m: string) => m !== "Room Only").map((m: string) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {pkg.meal_plans.includes("Room Only") && (
                       <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-3">Note: Room Only option restricted.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
                <span className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-xl">2</span>
                CONTACT DETAILS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Phone Number</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-bold text-slate-900 transition-all" placeholder="+230 5555 1234" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
                <span className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-xl">3</span>
                PAYMENT METHOD
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-6 border-2 rounded-2xl text-left transition-all ${paymentMethod === "CARD" ? "border-red-600 bg-red-50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-lg text-slate-900">Credit Card</span>
                    <span className="text-2xl">💳</span>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod("JUICE")}
                  className={`p-6 border-2 rounded-2xl text-left transition-all ${paymentMethod === "JUICE" ? "border-red-600 bg-red-50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-lg text-slate-900">MCB Juice</span>
                    <span className="text-2xl">📱</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a202c] rounded-[2rem] shadow-xl border border-slate-800 p-8 sticky top-24 text-white">
              <h2 className="text-2xl font-black text-white mb-8 tracking-tight">QUOTE SUMMARY</h2>
              
              <div className="flex items-start space-x-4 mb-8 pb-8 border-b border-slate-700">
                <div className="w-24 h-24 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={pkg.gallery_images?.[0] || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">{pkg.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mt-2">OPERATED BY {pkg.agency_id}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-slate-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Base Rate ({totalPax} Pax)
                  </span>
                  <span className="font-black text-white text-lg">
                    MUR {pricing.baseTotal.toLocaleString()}
                  </span>
                </div>
                
                {pricing.markupPercent > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Service Fee ({pricing.markupPercent}%)</span>
                    <span className="font-black text-white text-lg">
                      MUR {pricing.serviceFeeAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-slate-300 font-black text-xl">ESTIMATED TOTAL</span>
                <span className="text-3xl font-black text-red-500 tracking-tight">MUR {pricing.finalTotal.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center text-xl tracking-wide uppercase disabled:opacity-70"
              >
                {loading ? "PROCESSING..." : "SUBMIT REQUEST \u2192"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['var(--font-outfit)']">
        <div className="text-slate-500 text-sm font-black uppercase tracking-widest animate-pulse">Loading Checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
