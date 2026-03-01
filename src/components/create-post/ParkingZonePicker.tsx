import React from 'react';
import { ParkingSquare } from 'lucide-react';
import { ParkingZone } from '../../types';
import { UCI_PARKING_ZONES } from '../../constants';

interface ParkingZonePickerProps {
  value: ParkingZone | null;
  onChange: (zone: ParkingZone | null) => void;
}

export const ParkingZonePicker: React.FC<ParkingZonePickerProps> = ({ value, onChange }) => {
  const zones = Object.entries(UCI_PARKING_ZONES) as [string, typeof UCI_PARKING_ZONES[ParkingZone]][];

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
        <ParkingSquare size={16} className="text-slate-400" />
        UCI Parking Zone
        <span className="text-slate-400 font-normal">(optional)</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {zones.map(([key, zone]) => {
          const zoneNum = Number(key) as ParkingZone;
          const isSelected = value === zoneNum;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(isSelected ? null : zoneNum)}
              className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? `${zone.bgColor} ${zone.borderColor} ${zone.color} shadow-sm`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black ${
                  isSelected ? `${zone.bgColor} ${zone.color}` : 'bg-slate-100 text-slate-500'
                }`}>
                  {key}
                </span>
                <span className="font-bold text-sm truncate">{zone.label}</span>
              </div>
              <p className={`text-xs ml-8 ${isSelected ? zone.color : 'text-slate-400'}`}>
                {zone.lots}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
