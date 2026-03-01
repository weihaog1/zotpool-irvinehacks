import React from 'react';
import { Car, DollarSign, Shield, Sparkles } from 'lucide-react';
import { CostType, CarCleanliness } from '../../types';
import { SelectField } from '../ui/SelectField';

interface CreatePostDriverFieldsProps {
  carType: string;
  setCarType: (v: string) => void;
  seats: number;
  setSeats: (v: number) => void;
  yearsDriving: number;
  setYearsDriving: (v: number) => void;
  cleanliness: CarCleanliness;
  setCleanliness: (v: CarCleanliness) => void;
  costType: CostType;
  setCostType: (v: CostType) => void;
}

const cleanlinessLabels: Record<CarCleanliness, string> = {
  1: 'Needs work', 2: 'A bit messy', 3: 'Average', 4: 'Clean', 5: 'Spotless',
};

export const CreatePostDriverFields: React.FC<CreatePostDriverFieldsProps> = ({
  carType, setCarType, seats, setSeats, yearsDriving, setYearsDriving,
  cleanliness, setCleanliness, costType, setCostType,
}) => {
  return (
    <>
      <div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Car size={22} className="text-uci-gold" /> Car & Preferences
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Car Model</label>
            <input
              type="text"
              placeholder="e.g. Toyota Corolla"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue outline-none transition-all font-medium"
            />
          </div>
          <SelectField
            label="Seats Available"
            value={String(seats)}
            onChange={(val) => setSeats(Number(val))}
            options={[1,2,3,4,5,6].map(n => ({ value: String(n), label: `${n} seat${n > 1 ? 's' : ''}` }))}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Shield size={16} className="text-uci-blue" /> Years Driving
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={yearsDriving}
              onChange={(e) => {
                const value = Number(e.target.value);
                setYearsDriving(Number.isNaN(value) ? 0 : Math.max(0, value));
              }}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue outline-none transition-all font-medium"
            />
          </div>
          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Sparkles size={16} className="text-uci-gold" /> Car Cleanliness
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-medium text-slate-600">Current rating</span>
                <span className="font-bold text-slate-900">{cleanlinessLabels[cleanliness]}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={cleanliness}
                onChange={(e) => setCleanliness(Number(e.target.value) as CarCleanliness)}
                className="w-full accent-uci-blue"
              />
              <div className="flex justify-between text-xs text-slate-400 font-semibold mt-2">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <DollarSign size={16} className="text-uci-blue" /> Cost Sharing
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['free', 'split_gas', 'split_gas_parking', 'negotiable'] as CostType[]).map((cType) => (
                <button
                  key={cType}
                  type="button"
                  onClick={() => setCostType(cType)}
                  className={`p-3 rounded-xl text-sm font-bold border transition-all ${
                    costType === cType
                      ? 'bg-uci-blue text-white border-uci-blue shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cType === 'split_gas_parking' ? 'Gas & Parking' : cType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-slate-100"></div>
    </>
  );
};
