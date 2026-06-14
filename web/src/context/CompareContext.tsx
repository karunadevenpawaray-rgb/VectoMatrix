"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Database } from "@/types/supabase";

type Package = Database["public"]["Tables"]["packages"]["Row"] & {
  agency?: Database["public"]["Tables"]["agencies"]["Row"];
};

interface CompareContextType {
  selectedPackages: Package[];
  togglePackage: (pkg: Package) => void;
  removePackage: (pkgId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);

  const togglePackage = (pkg: Package) => {
    setSelectedPackages((prev) => {
      const isSelected = prev.some((p) => p.id === pkg.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== pkg.id);
      }
      if (prev.length >= 3) {
        alert("You can only compare up to 3 packages.");
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const removePackage = (pkgId: string) => {
    setSelectedPackages((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const clearCompare = () => {
    setSelectedPackages([]);
  };

  return (
    <CompareContext.Provider
      value={{ selectedPackages, togglePackage, removePackage, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
