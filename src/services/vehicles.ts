import { supabase, dbVehicleToVehicle } from './supabase';
import type { Vehicle } from '../types';
import type { DbVehicle } from './supabase';

/**
 * Fetches the user's default vehicle, or null if none is set.
 */
export async function fetchUserVehicle(
  userId: string
): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch default vehicle: ${error.message}`);
  if (!data) return null;

  return dbVehicleToVehicle(data as DbVehicle);
}

/**
 * Fetches all vehicles belonging to a user, ordered by creation date.
 */
export async function fetchUserVehicles(
  userId: string
): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
  if (!data) return [];

  return (data as DbVehicle[]).map(dbVehicleToVehicle);
}

/**
 * Creates or updates a vehicle. Automatically sets it as the default.
 * If the vehicle has no id field, a new record is inserted.
 * If the vehicle already exists, the existing record is updated.
 */
export async function upsertVehicle(
  vehicle: Omit<Vehicle, 'id' | 'createdAt'>
): Promise<Vehicle> {
  // Clear any existing default for this user first
  await supabase
    .from('vehicles')
    .update({ is_default: false })
    .eq('user_id', vehicle.userId)
    .eq('is_default', true);

  const { data, error } = await supabase
    .from('vehicles')
    .upsert(
      {
        user_id: vehicle.userId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        license_plate: vehicle.licensePlate,
        is_default: true,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw new Error(`Failed to upsert vehicle: ${error.message}`);

  return dbVehicleToVehicle(data as DbVehicle);
}

/**
 * Deletes a vehicle by its ID.
 */
export async function deleteVehicle(vehicleId: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);

  if (error) throw new Error(`Failed to delete vehicle: ${error.message}`);
}
