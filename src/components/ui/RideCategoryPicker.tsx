import React from 'react';
import { Repeat, CalendarDays } from 'lucide-react';
import { RideCategory } from '../../types';

interface RideCategoryPickerProps {
  value: RideCategory;
  onChange: (category: RideCategory) => void;
}

export const RideCategoryPicker: React.FC<RideCategoryPickerProps> = ({ value, onChange }) => {
  return (
    <div className="bg-slate-50/80 backdrop-blur border-b border-slate-200 p-3 flex gap-2">
      <button
        type="button"
        onClick={() => onChange('commute')}
        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300 ${
          value === 'commute'
            ? 'bg-white shadow-md text-uci-blue ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
        }`}
      >
        <Repeat size={20} className={value === 'commute' ? 'text-uci-blue' : ''} />
        Commute
      </button>
      <button
        type="button"
        onClick={() => onChange('event')}
        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300 ${
          value === 'event'
            ? 'bg-white shadow-md text-emerald-600 ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
        }`}
      >
        <CalendarDays size={20} className={value === 'event' ? 'text-emerald-600' : ''} />
        Ride to Event
      </button>
    </div>
  );
};
