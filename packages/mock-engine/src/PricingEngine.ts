export class PricingEngine {
  static calculatePrice(pkg: any, options: {
    adults: number;
    teens: number;
    children: number;
    infants: number;
    roomTypeId?: string;
    mealPlan?: string;
  }) {
    if (!pkg) throw new Error("Package not found for pricing calculation.");

    let baseTotal = 0;
    const { adults = 0, teens = 0, children = 0, infants = 0 } = options;

    if (pkg.service_type === 'hotel') {
      if (pkg.occupancy_pricing) {
        baseTotal = (pkg.occupancy_pricing.adult || pkg.base_price_mur);
        baseTotal += (teens * (pkg.occupancy_pricing.teen || 0));
        baseTotal += (children * (pkg.occupancy_pricing.child || 0));
        baseTotal += (infants * (pkg.occupancy_pricing.infant || 0));
      } else {
        baseTotal = pkg.base_price_mur;
      }

      let mealSupplement = 0;
      if (options.mealPlan === 'Half Board') mealSupplement = 1500 * (adults + teens + children);
      if (options.mealPlan === 'Full Board') mealSupplement = 3000 * (adults + teens + children);
      baseTotal += mealSupplement;

    } else {
      if (pkg.occupancy_pricing) {
        baseTotal += adults * (pkg.occupancy_pricing.adult || pkg.base_price_mur);
        baseTotal += teens * (pkg.occupancy_pricing.teen || 0);
        baseTotal += children * (pkg.occupancy_pricing.child || 0);
        baseTotal += infants * (pkg.occupancy_pricing.infant || 0);
      } else {
        baseTotal = pkg.base_price_mur * (adults + teens + children);
      }
    }

    let markupPercent = pkg.service_fee || 0;
    if (pkg.service_type === 'hotel' && options.roomTypeId && pkg.room_types) {
      const rt = pkg.room_types.find((r: any) => r.id === options.roomTypeId);
      if (rt && rt.service_fee !== undefined) {
        markupPercent = rt.service_fee;
      }
    }

    const serviceFeeAmount = baseTotal * (markupPercent / 100);
    const finalTotal = baseTotal + serviceFeeAmount;

    return {
      baseTotal,
      serviceFeeAmount,
      markupPercent,
      finalTotal,
      currency: "MUR"
    };
  }
}
