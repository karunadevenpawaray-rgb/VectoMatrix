import React from 'react';
import { Globe, Camera, Music, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0f1c] pt-10 pb-6 text-slate-400 text-xs mt-auto font-[family-name:var(--font-outfit)]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* Column 1 */}
        <div className="flex flex-col md:col-span-4 lg:col-span-3">
          <div className="flex items-center mb-4 text-white">
            <div className="w-5 h-5 rounded-full border border-white border-dashed animate-spin-slow flex items-center justify-center mr-2">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <span className="text-base font-black tracking-tight">TRUE<span className="text-slate-300">MEMORIES</span></span>
          </div>
          <p className="mb-4 leading-relaxed text-slate-400 text-[11px]">
            True Memories Travel & Tours — a bridge between traveler and tours and holidays. Experience safe, secure and memorable vacations with our IATA accredited experts.
          </p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-white">
              <Globe size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-white">
              <Camera size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-white">
              <Music size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-slate-700 transition-colors text-white">
              <MessageCircle size={14} />
            </button>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col md:col-span-4 lg:col-span-3">
          <h4 className="text-red-600 font-black tracking-[0.2em] uppercase text-[10px] mb-4">EXPLORE</h4>
          <ul className="space-y-2 font-medium text-white/80">
            <li className="flex items-center gap-2 text-[11px]"><div className="w-1 h-1 bg-red-600 rounded-full"></div> <Link href="/" className="hover:text-white transition-colors">Holiday Packages</Link></li>
            <li className="flex items-center gap-2 text-[11px]"><div className="w-1 h-1 bg-red-600 rounded-full"></div> <Link href="/cruises" className="hover:text-white transition-colors">Luxury Cruises</Link></li>
            <li className="flex items-center gap-2 text-[11px]"><div className="w-1 h-1 bg-red-600 rounded-full"></div> <Link href="/transfers" className="hover:text-white transition-colors">Transfers & Activities</Link></li>
            <li className="flex items-center gap-2 text-[11px]"><div className="w-1 h-1 bg-red-600 rounded-full"></div> <Link href="/compare" className="hover:text-white transition-colors">Compare Packages</Link></li>
            <li className="flex items-center gap-2 text-[11px]"><div className="w-1 h-1 bg-red-600 rounded-full"></div> <Link href="/dashboard" className="hover:text-white transition-colors">My Trips</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col md:col-span-4 lg:col-span-3">
          <h4 className="text-red-600 font-black tracking-[0.2em] uppercase text-[10px] mb-4">THE AGENCY</h4>
          <ul className="space-y-2 font-medium text-white/80 text-[11px]">
            <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Expert Team</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Location & Map</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Common Questions (FAQ)</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col md:col-span-12 lg:col-span-3">
          <h4 className="text-red-600 font-black tracking-[0.2em] uppercase text-[10px] mb-4">NEWSLETTER</h4>
          <p className="text-white font-bold mb-3 text-[11px]">Subscribe for luxury travel insights.</p>
          <div className="flex flex-col gap-2 mb-6">
            <input type="email" placeholder="Your email" className="bg-slate-800/80 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors text-[11px]" />
            <input type="button" value="SUBSCRIBE" className="bg-red-600 text-white font-black py-2 rounded-lg hover:bg-red-700 transition-colors active:scale-95 text-[10px] tracking-[0.1em] uppercase shadow-lg shadow-red-600/20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-red-500">
              <Phone size={14} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Help Desk</span>
              <span className="text-white font-black text-base tracking-tight leading-none">+230 2124070</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800/50 flex flex-col items-center justify-center text-center">
        <p className="text-[9px] font-bold tracking-[0.1em] text-slate-500 uppercase mb-1">© 2026 TRUE MEMORIES | A BRIDGE BETWEEN TRAVELER & TOURS AND HOLIDAYS. ALL RIGHTS RESERVED. | SINCE 1995</p>
        <p className="text-[8px] font-bold tracking-[0.2em] text-slate-600 uppercase">CREATED AND PRODUCED BY DEVEN</p>
      </div>
    </footer>
  );
}
