import type { ParkingZone } from './types';

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

export const UCI_PARKING_ZONES: Record<ParkingZone, {
  label: string;
  lots: string;
  coords: { lng: number; lat: number };
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  1: {
    label: 'Arts/Athletics',
    lots: 'MPS, Lot 14, Lot 14A',
    coords: { lng: -117.8530, lat: 33.6437 },
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
  2: {
    label: 'Humanities/Admin',
    lots: 'Lots 6, 6A, 7, 8',
    coords: { lng: -117.8465, lat: 33.6460 },
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  3: {
    label: 'Health Sciences',
    lots: 'Lot 16H, Lot 70',
    coords: { lng: -117.8510, lat: 33.6365 },
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  4: {
    label: 'Engineering',
    lots: 'APS',
    coords: { lng: -117.8390, lat: 33.6395 },
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  5: {
    label: 'Social Sciences',
    lots: 'SSPS',
    coords: { lng: -117.8410, lat: 33.6490 },
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
  },
  6: {
    label: 'North Campus',
    lots: 'SCPS, Lot 5',
    coords: { lng: -117.8490, lat: 33.6520 },
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
  },
};
