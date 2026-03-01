// Type aliases
export type AuthTier = 'uci' | 'general';
export type UserRole = 'driver' | 'passenger' | 'both';
export type RideCategory = 'commute' | 'event';
export type EventTag = 'airport' | 'going_home' | 'campus_event' | 'off_campus_event' | 'other';
export type GenderPreference = 'no_preference' | 'same_gender' | 'women_and_nb' | 'men_only';
export type CostType = 'free' | 'split_gas' | 'split_gas_parking' | 'negotiable';
export type CarCleanliness = 1 | 2 | 3 | 4 | 5;
export type ParkingZone = 1 | 2 | 3 | 4 | 5 | 6;
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type RideStatus = 'active' | 'filled' | 'expired' | 'cancelled';
export type NotificationType =
  | 'match_request'
  | 'match_accepted'
  | 'match_declined'
  | 'pickup_reminder'
  | 'ride_cancelled';

// Core interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  authTier: AuthTier;
  avatar?: string;
  gender?: string;
  pronouns?: string;
  city?: string;
  major?: string;
  year?: string;
  socials?: { instagram?: string; discord?: string; phone?: string };
  role?: UserRole;
  isOnboarded: boolean;
  waiverSignedAt?: string;
  waiverVersion?: string;
  homeLat?: number;
  homeLng?: number;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  matchRequest: boolean;
  matchAccepted: boolean;
  matchDeclined: boolean;
  pickupReminder: boolean;
  rideCancelled: boolean;
  emailEnabled: boolean;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Ride {
  id: string;
  userId: string;
  user: User;
  type: 'driver' | 'passenger';
  rideCategory: RideCategory;
  origin: string;
  originLat?: number;
  originLng?: number;
  destination: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationParkingZone?: ParkingZone;
  schedule: {
    days: string[];
    timeStart: string;
    timeEnd: string;
    isRecurring: boolean;
  };
  eventDate?: string;
  eventTag?: EventTag;
  details: {
    vehicleId?: string;
    vehicle?: Vehicle;
    seats?: number;
    cleanliness?: CarCleanliness;
    yearsDriving?: number;
    genderPreference?: GenderPreference;
    costType?: CostType;
    notes?: string;
  };
  routeDistanceMiles?: number;
  suggestedCostCents?: number;
  uciOnly: boolean;
  status: RideStatus;
  createdAt: string;
}

export interface Match {
  id: string;
  driverRideId: string;
  driverRide?: Ride;
  passengerRideId: string;
  passengerRide?: Ride;
  score: number;
  status: MatchStatus;
  requestedBy: string;
  respondedAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
}

export interface Waiver {
  id: string;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export interface MatchScore {
  total: number;
  routeProximity: number;
  timeOverlap: number;
  dayOverlap: number;
  preferences: number;
}

// Backward compatibility alias
export type Post = Ride;
