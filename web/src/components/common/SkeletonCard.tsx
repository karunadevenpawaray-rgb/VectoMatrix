"use client";

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-100/80 text-left flex flex-col animate-pulse h-full">
      {/* Thumbnail shimmer */}
      <div className="relative h-64 bg-slate-200" />

      {/* Card body shimmer */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title lines */}
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-3" />
        <div className="h-5 bg-slate-200 rounded-md w-1/2 mb-6" />

        {/* Inclusions tags shimmer */}
        <div className="flex gap-2 mb-6">
          <div className="h-6 bg-slate-200 rounded-lg w-16" />
          <div className="h-6 bg-slate-200 rounded-lg w-16" />
          <div className="h-6 bg-slate-200 rounded-lg w-20" />
        </div>

        {/* Price & button row shimmer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100/80 pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-6 bg-slate-200 rounded-md w-28" />
          </div>
          <div className="h-10 bg-slate-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
