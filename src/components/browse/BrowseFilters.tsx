import React from 'react';
import { Search, X, Filter, ChevronRight } from 'lucide-react';
import { RideCategory, GenderPreference, CostType } from '../../types';
import { DAYS_OF_WEEK } from '../../constants';

interface BrowseFiltersProps {
  filterType: 'all' | 'driver' | 'passenger';
  setFilterType: (v: 'all' | 'driver' | 'passenger') => void;
  filterCity: string;
  setFilterCity: (v: string) => void;
  filterCategory: 'all' | RideCategory;
  setFilterCategory: (v: 'all' | RideCategory) => void;
  filterGender: 'all' | GenderPreference;
  setFilterGender: (v: 'all' | GenderPreference) => void;
  filterCost: 'all' | CostType;
  setFilterCost: (v: 'all' | CostType) => void;
  filterDays: string[];
  onDayToggle: (day: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
}

const RadioGroup: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}> = ({ label, options, value, onChange, name }) => (
  <div className="mb-8">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">{label}</label>
    <div className="space-y-3">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${value === opt.value ? 'border-uci-blue bg-uci-blue' : 'border-slate-300 bg-white'}`}>
            {value === opt.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
          </div>
          <input type="radio" name={name} className="hidden" checked={value === opt.value} onChange={() => onChange(opt.value)} />
          <span className={`text-sm font-medium capitalize transition-colors ${value === opt.value ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export const BrowseFilters: React.FC<BrowseFiltersProps> = ({
  filterType, setFilterType, filterCity, setFilterCity,
  filterCategory, setFilterCategory, filterGender, setFilterGender,
  filterCost, setFilterCost, filterDays, onDayToggle,
  isFilterOpen, setIsFilterOpen,
}) => {
  return (
    <>
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between bg-white border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 shadow-sm"
        >
          <span className="flex items-center gap-2"><Filter size={18} /> Filters</span>
          <ChevronRight size={18} className={`transform transition-transform ${isFilterOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <aside className={`w-full md:w-72 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-28 space-y-6">
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-slate-900 text-lg">Filters</h3>
            </div>

            <RadioGroup label="Role Type" name="type" value={filterType} onChange={(v) => setFilterType(v as any)}
              options={[
                { value: 'all', label: 'All Listings' },
                { value: 'driver', label: 'Drivers' },
                { value: 'passenger', label: 'Passengers' },
              ]}
            />

            <RadioGroup label="Ride Category" name="category" value={filterCategory} onChange={(v) => setFilterCategory(v as any)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'commute', label: 'Commute' },
                { value: 'event', label: 'Ride to Event' },
              ]}
            />

            <RadioGroup label="Gender Preference" name="gender" value={filterGender} onChange={(v) => setFilterGender(v as any)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'no_preference', label: 'No preference' },
                { value: 'same_gender', label: 'Same gender' },
                { value: 'women_and_nb', label: 'Women & non-binary' },
                { value: 'men_only', label: 'Men only' },
              ]}
            />

            <RadioGroup label="Cost Type" name="cost" value={filterCost} onChange={(v) => setFilterCost(v as any)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'free', label: 'Free' },
                { value: 'split_gas', label: 'Split Gas' },
                { value: 'split_gas_parking', label: 'Gas & Parking' },
                { value: 'negotiable', label: 'Negotiable' },
              ]}
            />

            <div className="mb-8">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button key={day} type="button" onClick={() => onDayToggle(day)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                      filterDays.includes(day)
                        ? 'bg-uci-blue text-white shadow-md'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Search City</label>
              <div className="relative group">
                <input type="text" placeholder="Irvine, Anaheim..." value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-uci-blue/50 transition-all" />
                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-uci-blue transition-colors" />
                {filterCity && (
                  <button onClick={() => setFilterCity('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
