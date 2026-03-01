// UCI campus coordinates
const UCI_LAT = 33.6405;
const UCI_LNG = -117.8443;

// Internal threshold - never expose this value in user-facing messages
const SERVICE_RADIUS_MILES = 400;

// Earth radius in miles for Haversine formula
const EARTH_RADIUS_MILES = 3959;

export const SERVICE_AREA_ERROR = 'This location is outside our service area';

/**
 * Converts degrees to radians.
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the great-circle distance between two geographic points
 * using the Haversine formula.
 *
 * Returns distance in miles.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_MILES * c;
}

/**
 * Checks whether a given coordinate is within the platform service area.
 * The service area is centered on UCI. The exact radius is intentionally
 * not exposed to users.
 */
export function isWithinServiceArea(lat: number, lng: number): boolean {
  const distance = haversineDistance(UCI_LAT, UCI_LNG, lat, lng);
  return distance <= SERVICE_RADIUS_MILES;
}
