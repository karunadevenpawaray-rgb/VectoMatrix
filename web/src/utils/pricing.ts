export const ESIM_PRICE = 600;
export const PREMIUM_INSURANCE_UPGRADE = 1500; 
export const PRIVATE_TRANSIT_UPGRADE = 2500;

export interface PackageConfig {
  premiumInsurance: boolean;
  esim: boolean;
  privateTransit: boolean;
}

export const calculateTotal = (basePrice: number, config: PackageConfig) => {
  let total = basePrice;
  if (config.premiumInsurance) total += PREMIUM_INSURANCE_UPGRADE;
  if (config.esim) total += ESIM_PRICE;
  if (config.privateTransit) total += PRIVATE_TRANSIT_UPGRADE;
  return total;
};
