import { createClient } from '@supabase/supabase-js';
import type {
  User,
  Ride,
  Vehicle,
  Match,
  AppNotification,
  AuthTier,
  UserRole,
  RideCategory,
  RideStatus,
  EventTag,
  GenderPreference,
  CostType,
  CarCleanliness,
  ParkingZone,
  MatchStatus,
  NotificationType,
  NotificationPreferences,
} from '../types';

const supabaseUrl = 'https://pkfhlanvpwqkqkdjzkka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmhsYW52cHdxa3FrZGp6a2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDc4NzcsImV4cCI6MjA4NzkyMzg3N30.po_HFj2wzBQUuV7cm--_n3AWe52Mebe89hK2jRVY2rc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Database row interfaces
// ---------------------------------------------------------------------------

export interface DbUser {
  id: string;
  name: string;
  email: string;
  auth_tier: AuthTier | null;
  avatar: string | null;
  gender: string | null;
  pronouns: string | null;
  city: string | null;
  major: string | null;
  year: string | null;
  socials: { instagram?: string; discord?: string; phone?: string } | null;
  role: UserRole | null;
  is_onboarded: boolean;
  waiver_signed_at: string | null;
  waiver_version: string | null;
  home_lat: number | null;
  home_lng: number | null;
  notification_preferences: NotificationPreferences | null;
  created_at: string;
}

export interface DbRide {
  id: string;
  user_id: string;
  type: 'driver' | 'passenger';
  ride_category: RideCategory;
  origin: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;
  destination_parking_zone: ParkingZone | null;
  days: string[];
  time_start: string;
  time_end: string;
  is_recurring: boolean;
  event_date: string | null;
  event_tag: EventTag | null;
  vehicle_id: string | null;
  seats: number | null;
  cleanliness: number | null;
  years_driving: number | null;
  gender_preference: GenderPreference | null;
  cost_type: CostType | null;
  notes: string | null;
  route_distance_miles: number | null;
  suggested_cost_cents: number | null;
  uci_only: boolean;
  status: RideStatus;
  created_at: string;
}

export interface DbVehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  is_default: boolean;
  created_at: string;
}

export interface DbMatch {
  id: string;
  driver_ride_id: string;
  passenger_ride_id: string;
  score: number;
  status: MatchStatus;
  requested_by: string;
  responded_at: string | null;
  created_at: string;
  driver_ride?: Record<string, unknown>;
  passenger_ride?: Record<string, unknown>;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
}

export interface DbWaiver {
  id: string;
  version: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Conversion helpers: DB row -> app interface
// ---------------------------------------------------------------------------

export function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    authTier: dbUser.auth_tier ?? 'general',
    avatar: dbUser.avatar ?? undefined,
    gender: dbUser.gender ?? undefined,
    pronouns: dbUser.pronouns ?? undefined,
    city: dbUser.city ?? undefined,
    major: dbUser.major ?? undefined,
    year: dbUser.year ?? undefined,
    role: dbUser.role ?? undefined,
    isOnboarded: dbUser.is_onboarded,
    waiverSignedAt: dbUser.waiver_signed_at ?? undefined,
    waiverVersion: dbUser.waiver_version ?? undefined,
    homeLat: dbUser.home_lat ?? undefined,
    homeLng: dbUser.home_lng ?? undefined,
    notificationPreferences: dbUser.notification_preferences ?? undefined,
    socials: dbUser.socials
      ? {
          instagram: dbUser.socials.instagram ?? undefined,
          discord: dbUser.socials.discord ?? undefined,
          phone: dbUser.socials.phone ?? undefined,
        }
      : undefined,
  };
}

export function dbRideToRide(dbRide: DbRide, user: User): Ride {
  return {
    id: dbRide.id,
    userId: dbRide.user_id,
    user,
    type: dbRide.type,
    rideCategory: dbRide.ride_category,
    origin: dbRide.origin,
    originLat: dbRide.origin_lat ?? undefined,
    originLng: dbRide.origin_lng ?? undefined,
    destination: dbRide.destination,
    destinationLat: dbRide.destination_lat ?? undefined,
    destinationLng: dbRide.destination_lng ?? undefined,
    destinationParkingZone: dbRide.destination_parking_zone ?? undefined,
    schedule: {
      days: dbRide.days,
      timeStart: dbRide.time_start,
      timeEnd: dbRide.time_end,
      isRecurring: dbRide.is_recurring,
    },
    eventDate: dbRide.event_date ?? undefined,
    eventTag: dbRide.event_tag ?? undefined,
    details: {
      vehicleId: dbRide.vehicle_id ?? undefined,
      seats: dbRide.seats ?? undefined,
      cleanliness: (dbRide.cleanliness as CarCleanliness) ?? undefined,
      yearsDriving: dbRide.years_driving ?? undefined,
      genderPreference: dbRide.gender_preference ?? undefined,
      costType: dbRide.cost_type ?? undefined,
      notes: dbRide.notes ?? undefined,
    },
    routeDistanceMiles: dbRide.route_distance_miles ?? undefined,
    suggestedCostCents: dbRide.suggested_cost_cents ?? undefined,
    uciOnly: dbRide.uci_only,
    status: dbRide.status,
    createdAt: dbRide.created_at,
  };
}

export function dbVehicleToVehicle(dbVehicle: DbVehicle): Vehicle {
  return {
    id: dbVehicle.id,
    userId: dbVehicle.user_id,
    make: dbVehicle.make,
    model: dbVehicle.model,
    year: dbVehicle.year,
    color: dbVehicle.color,
    licensePlate: dbVehicle.license_plate,
    isDefault: dbVehicle.is_default,
    createdAt: dbVehicle.created_at,
  };
}

export function dbMatchToMatch(dbMatch: DbMatch): Match {
  return {
    id: dbMatch.id,
    driverRideId: dbMatch.driver_ride_id,
    passengerRideId: dbMatch.passenger_ride_id,
    score: dbMatch.score,
    status: dbMatch.status,
    requestedBy: dbMatch.requested_by,
    respondedAt: dbMatch.responded_at ?? undefined,
    createdAt: dbMatch.created_at,
  };
}

export function dbNotificationToNotification(
  dbNotification: DbNotification,
): AppNotification {
  return {
    id: dbNotification.id,
    userId: dbNotification.user_id,
    type: dbNotification.type,
    title: dbNotification.title,
    body: dbNotification.body,
    data: dbNotification.data ?? undefined,
    isRead: dbNotification.is_read,
    emailSent: dbNotification.email_sent,
    createdAt: dbNotification.created_at,
  };
}

// Backward compatibility
export const dbPostToPost = dbRideToRide;
export type DbPost = DbRide;
