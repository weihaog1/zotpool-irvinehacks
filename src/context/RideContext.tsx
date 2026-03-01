import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Ride } from '../types';
import { supabase, dbUserToUser, dbRideToRide, DbUser, DbRide } from '../services/supabase';
import { useAuth } from './AuthContext';
import { TEST_USER_ID } from '../constants';

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'user' | 'userId'>) => Promise<void>;
  updateRide: (
    rideId: string,
    ride: Omit<Ride, 'id' | 'createdAt' | 'user' | 'userId'>,
  ) => Promise<void>;
  deleteRide: (rideId: string) => Promise<void>;
  refreshRides: () => Promise<void>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);

  // Fetch all rides with user data
  const fetchRides = async (): Promise<Ride[]> => {
    const { data: ridesData, error: ridesError } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });

    if (ridesError || !ridesData) {
      return [];
    }

    if (ridesData.length === 0) {
      return [];
    }

    // Get unique user IDs
    const userIds = [...new Set(ridesData.map((r: DbRide) => r.user_id))];

    // Fetch all users for these rides
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (usersError || !usersData) {
      return [];
    }

    // Create user lookup map
    const userMap = new Map<string, User>();
    usersData.forEach((dbUser: DbUser) => {
      userMap.set(dbUser.id, dbUserToUser(dbUser));
    });

    // Convert rides with user data
    return ridesData
      .map((dbRide: DbRide) => {
        const rideUser = userMap.get(dbRide.user_id);
        if (!rideUser) return null;
        return dbRideToRide(dbRide, rideUser);
      })
      .filter((r): r is Ride => r !== null);
  };

  // Load rides when user changes
  useEffect(() => {
    if (user) {
      fetchRides().then(setRides);
    } else {
      setRides([]);
    }
  }, [user?.id]);

  // Add new ride
  const addRide = async (
    rideData: Omit<Ride, 'id' | 'createdAt' | 'user' | 'userId'>,
  ) => {
    if (!user) return;

    const isTestUser = user.id === TEST_USER_ID;

    if (isTestUser) {
      const mockRide: Ride = {
        id: `test-ride-${Date.now()}`,
        userId: user.id,
        user,
        type: rideData.type,
        rideCategory: rideData.rideCategory,
        origin: rideData.origin,
        originLat: rideData.originLat,
        originLng: rideData.originLng,
        destination: rideData.destination,
        destinationLat: rideData.destinationLat,
        destinationLng: rideData.destinationLng,
        destinationParkingZone: rideData.destinationParkingZone,
        schedule: rideData.schedule,
        eventDate: rideData.eventDate,
        eventTag: rideData.eventTag,
        details: rideData.details,
        routeDistanceMiles: rideData.routeDistanceMiles,
        suggestedCostCents: rideData.suggestedCostCents,
        uciOnly: rideData.uciOnly,
        status: rideData.status,
        createdAt: new Date().toISOString(),
      };
      setRides((prev) => [mockRide, ...prev]);
      return;
    }

    const dbRide = {
      user_id: user.id,
      type: rideData.type,
      ride_category: rideData.rideCategory,
      origin: rideData.origin,
      origin_lat: rideData.originLat ?? null,
      origin_lng: rideData.originLng ?? null,
      destination: rideData.destination,
      destination_lat: rideData.destinationLat ?? null,
      destination_lng: rideData.destinationLng ?? null,
      destination_parking_zone: rideData.destinationParkingZone ?? null,
      days: rideData.schedule.days,
      time_start: rideData.schedule.timeStart,
      time_end: rideData.schedule.timeEnd,
      is_recurring: rideData.schedule.isRecurring,
      event_date: rideData.eventDate ?? null,
      event_tag: rideData.eventTag ?? null,
      vehicle_id: rideData.details.vehicleId ?? null,
      seats: rideData.details.seats ?? null,
      cleanliness: rideData.details.cleanliness ?? null,
      years_driving: rideData.details.yearsDriving ?? null,
      gender_preference: rideData.details.genderPreference ?? null,
      cost_type: rideData.details.costType ?? null,
      notes: rideData.details.notes ?? null,
      route_distance_miles: rideData.routeDistanceMiles ?? null,
      suggested_cost_cents: rideData.suggestedCostCents ?? null,
      uci_only: rideData.uciOnly,
      status: rideData.status,
    };

    const { data, error } = await supabase
      .from('rides')
      .insert(dbRide)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const newRide = dbRideToRide(data as DbRide, user);
    setRides((prev) => [newRide, ...prev]);
  };

  // Update existing ride
  const updateRide = async (
    rideId: string,
    rideData: Omit<Ride, 'id' | 'createdAt' | 'user' | 'userId'>,
  ) => {
    if (!user) return;

    const isTestUser = user.id === TEST_USER_ID;

    if (isTestUser) {
      setRides((prev) =>
        prev.map((ride) => {
          if (ride.id !== rideId) return ride;
          return {
            ...ride,
            type: rideData.type,
            rideCategory: rideData.rideCategory,
            origin: rideData.origin,
            destination: rideData.destination,
            schedule: rideData.schedule,
            details: rideData.details,
            uciOnly: rideData.uciOnly,
            status: rideData.status,
          };
        }),
      );
      return;
    }

    const dbUpdates = {
      type: rideData.type,
      ride_category: rideData.rideCategory,
      origin: rideData.origin,
      origin_lat: rideData.originLat ?? null,
      origin_lng: rideData.originLng ?? null,
      destination: rideData.destination,
      destination_lat: rideData.destinationLat ?? null,
      destination_lng: rideData.destinationLng ?? null,
      destination_parking_zone: rideData.destinationParkingZone ?? null,
      days: rideData.schedule.days,
      time_start: rideData.schedule.timeStart,
      time_end: rideData.schedule.timeEnd,
      is_recurring: rideData.schedule.isRecurring,
      event_date: rideData.eventDate ?? null,
      event_tag: rideData.eventTag ?? null,
      vehicle_id: rideData.details.vehicleId ?? null,
      seats: rideData.details.seats ?? null,
      cleanliness: rideData.details.cleanliness ?? null,
      years_driving: rideData.details.yearsDriving ?? null,
      gender_preference: rideData.details.genderPreference ?? null,
      cost_type: rideData.details.costType ?? null,
      notes: rideData.details.notes ?? null,
      route_distance_miles: rideData.routeDistanceMiles ?? null,
      suggested_cost_cents: rideData.suggestedCostCents ?? null,
      uci_only: rideData.uciOnly,
      status: rideData.status,
    };

    const { data, error } = await supabase
      .from('rides')
      .update(dbUpdates)
      .eq('id', rideId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const updatedRide = dbRideToRide(data as DbRide, user);
    setRides((prev) =>
      prev.map((ride) => (ride.id === rideId ? updatedRide : ride)),
    );
  };

  // Delete ride
  const deleteRide = async (rideId: string) => {
    const isTestRide = rideId.startsWith('test-ride-');

    if (!isTestRide) {
      const { error } = await supabase
        .from('rides')
        .delete()
        .eq('id', rideId);

      if (error) {
        throw error;
      }
    }

    setRides((prev) => prev.filter((r) => r.id !== rideId));
  };

  // Refresh rides
  const refreshRides = async () => {
    const allRides = await fetchRides();
    setRides(allRides);
  };

  return (
    <RideContext.Provider
      value={{
        rides,
        addRide,
        updateRide,
        deleteRide,
        refreshRides,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};
