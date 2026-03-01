import { haversineDistance } from '../lib/geo';
import type { Ride, MatchScore, GenderPreference } from '../types';

// -- Scoring weights (out of 100) --
const WEIGHT_ROUTE = 40;
const WEIGHT_TIME = 25;
const WEIGHT_DAY = 20;
const WEIGHT_PREFS = 15;

// -- Hard filter thresholds --
const MAX_ORIGIN_DISTANCE_MILES = 5;

// ----------------------------------------------------------------
// Helper: parse "HH:MM" or "H:MM AM/PM" into minutes since midnight
// ----------------------------------------------------------------
function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim().toUpperCase();

  // Handle 12-hour format with AM/PM
  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const minutes = parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3];
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
  }

  // Handle 24-hour format "HH:MM"
  const parts = trimmed.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  return 0;
}

// ----------------------------------------------------------------
// Hard filter checks
// ----------------------------------------------------------------

function areSameType(a: Ride, b: Ride): boolean {
  return a.type === b.type;
}

function hasGenderViolation(rideA: Ride, rideB: Ride): boolean {
  return (
    isGenderBlocked(rideA.details.genderPreference, rideB.user?.gender) ||
    isGenderBlocked(rideB.details.genderPreference, rideA.user?.gender)
  );
}

function isGenderBlocked(
  preference: GenderPreference | undefined,
  otherGender: string | undefined
): boolean {
  if (!preference || preference === 'no_preference') return false;
  if (!otherGender) return false;

  const gender = otherGender.toLowerCase();

  switch (preference) {
    case 'same_gender':
      // Cannot determine compatibility without the preference-holder's gender,
      // so we let same_gender pass at this level. The caller should check both
      // directions if needed.
      return false;
    case 'women_and_nb':
      return gender !== 'female' && gender !== 'woman' && gender !== 'non-binary' && gender !== 'nonbinary';
    case 'men_only':
      return gender !== 'male' && gender !== 'man';
    default:
      return false;
  }
}

function hasZeroDayOverlap(a: Ride, b: Ride): boolean {
  const setA = new Set(a.schedule.days.map((d) => d.toLowerCase()));
  return !b.schedule.days.some((d) => setA.has(d.toLowerCase()));
}

function originsExceedDistance(a: Ride, b: Ride): boolean {
  if (
    a.originLat == null ||
    a.originLng == null ||
    b.originLat == null ||
    b.originLng == null
  ) {
    return true;
  }
  const dist = haversineDistance(
    a.originLat,
    a.originLng,
    b.originLat,
    b.originLng
  );
  return dist > MAX_ORIGIN_DISTANCE_MILES;
}

// ----------------------------------------------------------------
// Scoring components
// ----------------------------------------------------------------

function scoreRouteProximity(a: Ride, b: Ride): number {
  if (
    a.originLat == null ||
    a.originLng == null ||
    b.originLat == null ||
    b.originLng == null
  ) {
    return 0;
  }

  const originDist = haversineDistance(
    a.originLat,
    a.originLng,
    b.originLat,
    b.originLng
  );

  let originScore: number;
  if (originDist < 1) originScore = 1.0;
  else if (originDist < 3) originScore = 0.75;
  else if (originDist < 5) originScore = 0.5;
  else if (originDist < 10) originScore = 0.25;
  else originScore = 0;

  // Also factor in destination proximity if both have coords
  let destScore = 1.0;
  if (
    a.destinationLat != null &&
    a.destinationLng != null &&
    b.destinationLat != null &&
    b.destinationLng != null
  ) {
    const destDist = haversineDistance(
      a.destinationLat,
      a.destinationLng,
      b.destinationLat,
      b.destinationLng
    );
    if (destDist < 1) destScore = 1.0;
    else if (destDist < 3) destScore = 0.75;
    else if (destDist < 5) destScore = 0.5;
    else if (destDist < 10) destScore = 0.25;
    else destScore = 0;
  }

  // Average of origin and destination proximity, weighted toward origin
  const combined = originScore * 0.6 + destScore * 0.4;
  return Math.round(combined * WEIGHT_ROUTE);
}

function scoreTimeOverlap(a: Ride, b: Ride): number {
  const aStart = parseTimeToMinutes(a.schedule.timeStart);
  const aEnd = parseTimeToMinutes(a.schedule.timeEnd);
  const bStart = parseTimeToMinutes(b.schedule.timeStart);
  const bEnd = parseTimeToMinutes(b.schedule.timeEnd);

  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);
  const overlapMinutes = Math.max(0, overlapEnd - overlapStart);

  const maxPossible = Math.max(aEnd - aStart, bEnd - bStart, 1);
  const ratio = Math.min(overlapMinutes / maxPossible, 1);

  return Math.round(ratio * WEIGHT_TIME);
}

function scoreDayOverlap(a: Ride, b: Ride): number {
  const setA = new Set(a.schedule.days.map((d) => d.toLowerCase()));
  const matching = b.schedule.days.filter((d) => setA.has(d.toLowerCase()));

  const totalUnique = new Set([
    ...a.schedule.days.map((d) => d.toLowerCase()),
    ...b.schedule.days.map((d) => d.toLowerCase()),
  ]).size;

  if (totalUnique === 0) return 0;
  const ratio = matching.length / totalUnique;
  return Math.round(ratio * WEIGHT_DAY);
}

function scorePreferences(a: Ride, b: Ride): number {
  let score = WEIGHT_PREFS;

  // Gender compatibility: deduct if either has a restrictive preference
  const aPref = a.details.genderPreference;
  const bPref = b.details.genderPreference;
  if (
    (aPref && aPref !== 'no_preference') ||
    (bPref && bPref !== 'no_preference')
  ) {
    // Partial deduction for having a restriction (matching is still allowed)
    score -= 5;
  }

  // Cost compatibility: deduct if cost types conflict
  const aCost = a.details.costType;
  const bCost = b.details.costType;
  if (aCost && bCost && aCost !== bCost) {
    // One wants free, other wants split - partial penalty
    if (aCost === 'free' || bCost === 'free') {
      score -= 10;
    } else {
      score -= 3;
    }
  }

  return Math.max(0, score);
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/**
 * Calculates a match score between two rides.
 * Returns null if hard-filtered out (incompatible rides).
 */
export function calculateMatchScore(
  rideA: Ride,
  rideB: Ride
): MatchScore | null {
  // Hard filters
  if (areSameType(rideA, rideB)) return null;
  if (hasGenderViolation(rideA, rideB)) return null;
  if (hasZeroDayOverlap(rideA, rideB)) return null;
  if (originsExceedDistance(rideA, rideB)) return null;

  const routeProximity = scoreRouteProximity(rideA, rideB);
  const timeOverlap = scoreTimeOverlap(rideA, rideB);
  const dayOverlap = scoreDayOverlap(rideA, rideB);
  const preferences = scorePreferences(rideA, rideB);

  const total = routeProximity + timeOverlap + dayOverlap + preferences;

  return {
    total,
    routeProximity,
    timeOverlap,
    dayOverlap,
    preferences,
  };
}

/**
 * Finds and ranks all matching rides for a given user ride.
 * Returns results sorted by total score descending.
 */
export function findMatches(
  userRide: Ride,
  allRides: Ride[]
): Array<{ ride: Ride; score: MatchScore }> {
  const results: Array<{ ride: Ride; score: MatchScore }> = [];

  for (const candidate of allRides) {
    // Skip the user's own rides
    if (candidate.id === userRide.id) continue;
    if (candidate.userId === userRide.userId) continue;

    const score = calculateMatchScore(userRide, candidate);
    if (score !== null) {
      results.push({ ride: candidate, score });
    }
  }

  results.sort((a, b) => b.score.total - a.score.total);

  return results;
}

/**
 * Returns a human-readable quality label for a match score.
 */
export function getMatchQualityLabel(score: number): string {
  if (score >= 80) return 'Excellent match';
  if (score >= 60) return 'Good fit';
  return 'Possible match';
}
