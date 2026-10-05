export const DELIVERY_PRICE_CAP = 50000;

export function calculateDeliveryPrice({ distanceKm, durationMinutes }) {
  const safeDistanceKm = Number.isFinite(distanceKm) ? Math.max(0, distanceKm) : 0;
  const safeDurationMinutes = Number.isFinite(durationMinutes) ? Math.max(0, durationMinutes) : 0;

  const baseFare = 1500;
  const distanceCharge = Math.max(0, safeDistanceKm - 3) * 40;
  const timeCharge = Math.max(0, safeDurationMinutes - 20) * 4;
  const rawPrice = baseFare + distanceCharge + timeCharge;

  return Math.min(Math.max(rawPrice, baseFare), DELIVERY_PRICE_CAP);
}
