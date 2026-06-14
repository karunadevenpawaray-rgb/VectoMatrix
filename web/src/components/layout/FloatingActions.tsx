"use client";
import React, { useEffect, useState } from 'react';
import { MessageCircle, Camera, Globe, Mail, X, ChevronDown } from 'lucide-react';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // Show actions after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // Listen to scroll to show back-to-top
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Actions */}
      <div className="fixed right-4 bottom-24 flex flex-col gap-2 z-50">
        <button className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><MessageCircle size={20} /></button>
        <button className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Camera size={20} /></button>
        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Globe size={20} /></button>
        <button className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Mail size={20} /></button>
        <button 
          onClick={() => setIsVisible(false)}
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform mt-2"
        >
          <X size={20} />
        </button>
      </div>

      {/* Back to top button */}
      {showScroll && (
        <button 
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 w-12 h-12 bg-red-600 text-white rounded-xl shadow-xl flex items-center justify-center hover:bg-red-700 transition-colors z-50"
        >
          <ChevronDown size={24} className="rotate-180" />
        </button>
      )}
    </>
  );
}
