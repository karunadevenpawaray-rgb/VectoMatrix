import React from "react";
import { Globe, Camera, Music, MessageCircle, Phone, Mail } from "lucide-react";
// Note: Facebook, Instagram, Youtube, MapPin not available in this lucide-react version — using Globe/Camera/Music/MessageCircle instead
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-8 text-slate-600 font-[family-name:var(--font-outfit)]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

        {/* ── Column 1: Brand & Contact ── */}
        <div className="flex flex-col md:col-span-4">
          <div className="flex flex-col mb-5">
            <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
              TRUE<span className="text-slate-400">MEMORIES</span>
            </span>
            <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-[0.15em] mt-1">
              Travel &amp; Tours
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
            A bridge between traveller &amp; tours and holidays. Safe, secure and memorable vacations with our IATA accredited experts.
          </p>

          {/* Contact details */}
          <div className="space-y-3">
            <a href="tel:+23058169420" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-[#ea580c] transition-colors group">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors shrink-0">
                <Phone size={14} />
              </div>
              +230 58 16 94 20
            </a>
            <a href="mailto:karunadevenpawaray@gmail.com" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-[#ea580c] transition-colors group">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors shrink-0">
                <Mail size={14} />
              </div>
              <span className="truncate">karunadevenpawaray@gmail.com</span>
            </a>
            <a href="https://vectomatrix.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-[#ea580c] transition-colors group">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors shrink-0">
                <Globe size={14} />
              </div>
              vectomatrix.com
            </a>
          </div>

          {/* Social icons */}
          <div className="flex gap-2 mt-6">
            {[
              { Icon: Globe,          label: "Website" },
              { Icon: Camera,         label: "Instagram" },
              { Icon: Music,          label: "TikTok" },
              { Icon: MessageCircle,  label: "WhatsApp" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#ea580c] hover:text-[#ea580c] transition-all hover:-translate-y-0.5"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Column 2: Explore ── */}
        <div className="flex flex-col md:col-span-2">
          <h4 className="text-[#ea580c] font-black tracking-[0.2em] uppercase text-[11px] mb-5">Explore</h4>
          <ul className="space-y-3">
            {[
              { href: "/",           label: "Holiday Packages" },
              { href: "/cruises",    label: "Luxury Cruises" },
              { href: "/transfers",  label: "Transfers" },
              { href: "/activities", label: "Activities" },
              { href: "/compare",    label: "Compare Packages" },
              { href: "/dashboard",  label: "My Trips" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-600 hover:text-[#ea580c] transition-colors font-medium">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 3: Company ── */}
        <div className="flex flex-col md:col-span-2">
          <h4 className="text-[#ea580c] font-black tracking-[0.2em] uppercase text-[11px] mb-5">Company</h4>
          <ul className="space-y-3">
            {[
              { href: "#", label: "Our Story" },
              { href: "#", label: "Expert Team" },
              { href: "#", label: "Location &amp; Map" },
              { href: "#", label: "FAQ" },
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms &amp; Conditions" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-[#ea580c] transition-colors font-medium"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 4: Newsletter ── */}
        <div className="flex flex-col md:col-span-4">
          <h4 className="text-[#ea580c] font-black tracking-[0.2em] uppercase text-[11px] mb-5">Stay Inspired</h4>
          <p className="text-sm text-slate-600 font-medium mb-4">
            Subscribe for exclusive travel deals, destination guides and early-access offers.
          </p>
          <div className="flex flex-col gap-2 mb-6">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-[#ea580c] transition"
            />
            <button className="w-full bg-[#ea580c] text-white font-black py-3 rounded-xl hover:bg-orange-600 transition-colors active:scale-95 text-sm tracking-wide shadow-sm shadow-orange-500/20">
              Subscribe
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex gap-3">
            <span className="text-[11px] font-black text-slate-400 border border-slate-200 px-3 py-1.5 rounded-lg">✓ IATA Accredited</span>
            <span className="text-[11px] font-black text-slate-400 border border-slate-200 px-3 py-1.5 rounded-lg">✓ Since 1995</span>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
        <p>© 2026 True Memories Travel &amp; Tours. All rights reserved.</p>
        <p>
          <a href="https://vectomatrix.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ea580c] transition-colors">
            vectomatrix.com
          </a>
        </p>
      </div>
    </footer>
  );
}
