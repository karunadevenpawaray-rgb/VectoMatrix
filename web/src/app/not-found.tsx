"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
        Go Home
      </Link>
    </div>
  );
}
