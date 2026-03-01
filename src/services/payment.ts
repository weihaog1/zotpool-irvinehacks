// Default parameters based on SoCal averages (2025-2026)
const DEFAULT_AVG_MPG = 28;
const DEFAULT_GAS_PRICE = 4.5;
const DEFAULT_PARKING_COST = 14.0;

interface PaymentParams {
  distanceMiles: number;
  totalRiders: number;
  avgMpg?: number;
  gasPrice?: number;
  parkingCost?: number;
  includeParkingInSplit?: boolean;
}

interface PaymentBreakdown {
  gasCost: number;
  parkingCost: number;
  perRider: number;
  totalRiders: number;
}

/**
 * Calculates the suggested per-rider payment in cents.
 *
 * Formula: (distance * 2 / avgMpg * gasPrice + parkingCost) / totalRiders
 *
 * The distance is doubled to account for a round trip.
 * All monetary values are stored in cents for precision.
 */
export function calculateSuggestedPayment(params: PaymentParams): number {
  const {
    distanceMiles,
    totalRiders,
    avgMpg = DEFAULT_AVG_MPG,
    gasPrice = DEFAULT_GAS_PRICE,
    parkingCost = DEFAULT_PARKING_COST,
    includeParkingInSplit = true,
  } = params;

  if (totalRiders <= 0) return 0;
  if (distanceMiles <= 0) return 0;
  if (avgMpg <= 0) return 0;

  const roundTripGallons = (distanceMiles * 2) / avgMpg;
  const gasCostDollars = roundTripGallons * gasPrice;
  const parkingDollars = includeParkingInSplit ? parkingCost : 0;
  const totalCostDollars = gasCostDollars + parkingDollars;
  const perRiderDollars = totalCostDollars / totalRiders;

  // Convert to cents and round to nearest cent
  return Math.round(perRiderDollars * 100);
}

/**
 * Formats an amount in cents as a dollar string.
 * Example: 1250 -> "$12.50"
 */
export function formatPaymentAmount(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Returns a detailed breakdown of the payment calculation.
 * All monetary values in the breakdown are in cents.
 */
export function getPaymentBreakdown(params: PaymentParams): PaymentBreakdown {
  const {
    distanceMiles,
    totalRiders,
    avgMpg = DEFAULT_AVG_MPG,
    gasPrice = DEFAULT_GAS_PRICE,
    parkingCost = DEFAULT_PARKING_COST,
    includeParkingInSplit = true,
  } = params;

  if (totalRiders <= 0 || distanceMiles <= 0 || avgMpg <= 0) {
    return { gasCost: 0, parkingCost: 0, perRider: 0, totalRiders: 0 };
  }

  const roundTripGallons = (distanceMiles * 2) / avgMpg;
  const gasCostCents = Math.round(roundTripGallons * gasPrice * 100);
  const parkingCents = includeParkingInSplit
    ? Math.round(parkingCost * 100)
    : 0;
  const perRiderCents = Math.round((gasCostCents + parkingCents) / totalRiders);

  return {
    gasCost: gasCostCents,
    parkingCost: parkingCents,
    perRider: perRiderCents,
    totalRiders,
  };
}
