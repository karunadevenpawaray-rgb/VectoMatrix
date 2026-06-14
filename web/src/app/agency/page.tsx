"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";

export default function AgencyAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a brief authentication check, then redirect to the B2B portal
    setTimeout(() => {
      window.location.href = "http://localhost:3001/b2b";
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-['var(--font-outfit)'] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-rose-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-2">AGENCY<br/><span className="text-red-600">PORTAL</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">EXCLUSIVE B2B ACCESS</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">AGENCY EMAIL</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-4 pr-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-600/10 outline-none font-bold text-white transition-all placeholder-slate-600" 
                placeholder="partner@agency.com" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ACCESS KEY</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.1em] text-red-500 hover:text-red-400 transition-colors">Forgot?</Link>
              </div>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-4 pr-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-600/10 outline-none font-bold text-white transition-all placeholder-slate-600" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center text-lg tracking-widest uppercase mt-4 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? (
                "AUTHENTICATING..."
              ) : (
                <>
                  <KeyRound className="w-5 h-5 mr-3" />
                  SECURE LOGIN <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-sm font-bold text-slate-400">
              Not a registered partner? <Link href="/" className="text-red-500 hover:text-red-400 transition-colors">Apply here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
