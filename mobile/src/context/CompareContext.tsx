import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "react-native";

interface Package {
  id: string;
  agency?: { name: string; phone?: string };
  title: string;
  destination: string;
  base_price_mur: number;
  travel_month?: string;
  hotel_name?: string;
  hotel_stars?: number;
  hotel_location?: string;
  baggage_allowance?: string;
  transfer_type?: string;
}

interface CompareContextType {
  selectedPackages: Package[];
  togglePackage: (pkg: Package) => void;
  removePackage: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);

  const togglePackage = (pkg: Package) => {
    setSelectedPackages((prev) => {
      const isSelected = prev.find((p) => p.id === pkg.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== pkg.id);
      }
      if (prev.length >= 3) {
        Alert.alert("Limit Reached", "You can only compare up to 3 packages at once.");
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const removePackage = (id: string) => {
    setSelectedPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setSelectedPackages([]);
  };

  return (
    <CompareContext.Provider value={{ selectedPackages, togglePackage, removePackage, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
