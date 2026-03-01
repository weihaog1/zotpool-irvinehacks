import { supabase, dbMatchToMatch } from './supabase';
import type { Match } from '../types';
import type { DbMatch } from './supabase';

/**
 * Creates a new match request between a driver ride and a passenger ride.
 */
export async function createMatchRequest(
  driverRideId: string,
  passengerRideId: string,
  score: number,
  requestedBy: string
): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      driver_ride_id: driverRideId,
      passenger_ride_id: passengerRideId,
      score,
      status: 'pending',
      requested_by: requestedBy,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create match request: ${error.message}`);

  return dbMatchToMatch(data as DbMatch);
}

/**
 * Responds to a match request by accepting or declining it.
 * Updates the status and records the response timestamp.
 */
export async function respondToMatch(
  matchId: string,
  accept: boolean
): Promise<Match> {
  const newStatus = accept ? 'accepted' : 'declined';

  const { data, error } = await supabase
    .from('matches')
    .update({
      status: newStatus,
      responded_at: new Date().toISOString(),
    })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw new Error(`Failed to respond to match: ${error.message}`);

  return dbMatchToMatch(data as DbMatch);
}

/**
 * Fetches all matches where the user owns either the driver or passenger ride.
 * Joins with rides and user data for display purposes.
 */
export async function fetchUserMatches(userId: string): Promise<Match[]> {
  // Fetch matches where the user's rides are involved.
  // We query rides by user_id and then find matches referencing those rides.
  const { data: userRides, error: ridesError } = await supabase
    .from('rides')
    .select('id')
    .eq('user_id', userId);

  if (ridesError) throw new Error(`Failed to fetch user rides: ${ridesError.message}`);
  if (!userRides || userRides.length === 0) return [];

  const rideIds = userRides.map((r: { id: string }) => r.id);

  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      driver_ride:rides!matches_driver_ride_id_fkey(
        id, user_id, type, origin, destination, days, time_start, time_end,
        origin_lat, origin_lng, destination_lat, destination_lng,
        ride_category, status
      ),
      passenger_ride:rides!matches_passenger_ride_id_fkey(
        id, user_id, type, origin, destination, days, time_start, time_end,
        origin_lat, origin_lng, destination_lat, destination_lng,
        ride_category, status
      )
    `)
    .or(
      `driver_ride_id.in.(${rideIds.join(',')}),passenger_ride_id.in.(${rideIds.join(',')})`
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch user matches: ${error.message}`);
  if (!data) return [];

  return (data as DbMatch[]).map(dbMatchToMatch);
}

/**
 * Fetches a single match by its ID, with joined ride data.
 */
export async function fetchMatchById(
  matchId: string
): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      driver_ride:rides!matches_driver_ride_id_fkey(
        id, user_id, type, origin, destination, days, time_start, time_end,
        origin_lat, origin_lng, destination_lat, destination_lng,
        ride_category, status
      ),
      passenger_ride:rides!matches_passenger_ride_id_fkey(
        id, user_id, type, origin, destination, days, time_start, time_end,
        origin_lat, origin_lng, destination_lat, destination_lng,
        ride_category, status
      )
    `)
    .eq('id', matchId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch match: ${error.message}`);
  if (!data) return null;

  return dbMatchToMatch(data as DbMatch);
}
