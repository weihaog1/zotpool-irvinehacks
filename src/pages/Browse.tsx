import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import { Ride, RideCategory, GenderPreference, CostType } from '../types';
import { Search } from 'lucide-react';
import { BrowseRideCard, BrowseRideModal, BrowseFilters } from '../components/browse';

export const Browse: React.FC = () => {
  const { isLoading } = useAuth();
  const { rides } = useRides();

  const [filterType, setFilterType] = useState<'all' | 'driver' | 'passenger'>('all');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | RideCategory>('all');
  const [filterGender, setFilterGender] = useState<'all' | GenderPreference>('all');
  const [filterCost, setFilterCost] = useState<'all' | CostType>('all');
  const [filterDays, setFilterDays] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const handleDayToggle = (day: string) => {
    setFilterDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const clearFilters = () => {
    setFilterCity('');
    setFilterType('all');
    setFilterCategory('all');
    setFilterGender('all');
    setFilterCost('all');
    setFilterDays([]);
  };

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      if (filterType !== 'all' && ride.type !== filterType) return false;
      if (filterCity && !ride.origin.toLowerCase().includes(filterCity.toLowerCase())) return false;
      if (filterCategory !== 'all' && ride.rideCategory !== filterCategory) return false;
      if (filterGender !== 'all' && ride.details.genderPreference !== filterGender) return false;
      if (filterCost !== 'all' && ride.details.costType !== filterCost) return false;
      if (filterDays.length > 0) {
        const rideDays = ride.schedule.days;
        const hasOverlap = filterDays.some(d => rideDays.includes(d));
        if (!hasOverlap) return false;
      }
      return true;
    });
  }, [rides, filterType, filterCity, filterCategory, filterGender, filterCost, filterDays]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-8">
        <BrowseFilters
          filterType={filterType} setFilterType={setFilterType}
          filterCity={filterCity} setFilterCity={setFilterCity}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          filterGender={filterGender} setFilterGender={setFilterGender}
          filterCost={filterCost} setFilterCost={setFilterCost}
          filterDays={filterDays} onDayToggle={handleDayToggle}
          isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
        />

        {/* Results Grid */}
        <div className="flex-grow">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900">
              {filterType === 'all' ? 'All Listings' : filterType === 'driver' ? 'Available Drivers' : 'Passenger Requests'}
            </h2>
            <p className="text-slate-500 mt-2">Showing {filteredRides.length} results</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-72 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-slate-200 rounded"></div>
                      <div className="w-20 h-3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-slate-200 rounded"></div>
                    <div className="w-2/3 h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRides.map(ride => (
                <BrowseRideCard key={ride.id} ride={ride} onSelect={setSelectedRide} />
              ))}
            </div>
          )}

          {!isLoading && filteredRides.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Search size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">No results found</h3>
              <p className="text-slate-500 mt-2 text-center max-w-xs">We couldn't find any listings matching your criteria. Try different filters.</p>
              <button onClick={clearFilters} className="mt-6 text-uci-blue font-bold hover:underline">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedRide && (
        <BrowseRideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
      )}
    </div>
  );
};
