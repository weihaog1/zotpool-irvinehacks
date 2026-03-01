import React, { useState } from 'react';
import { Calendar, Clock, Car, ChevronRight, ArrowRight, Map, ChevronDown, DollarSign, Shield, Repeat, CalendarDays } from 'lucide-react';
import { Ride } from '../../types';
import { TierBadge } from '../ui/TierBadge';
import { RouteMap } from '../ui/RouteMap';
import { formatTime, formatCostType } from '../../lib/formatters';

interface BrowseRideCardProps {
  ride: Ride;
  onSelect: (ride: Ride) => void;
}

export const BrowseRideCard: React.FC<BrowseRideCardProps> = ({ ride, onSelect }) => {
  const [showMap, setShowMap] = useState(false);
  const destinationLabel = ride.destination && ride.destination.trim().length > 0 ? ride.destination : 'UCI';
  const destinationShort = destinationLabel.toLowerCase().includes('uci') ? 'UCI' : destinationLabel;
  const daysLabel = ride.schedule.days.length ? ride.schedule.days.join(', ') : 'Flexible';
  const displayMajor = ride.user.major || 'UCI Student';
  const userInitial = ride.user.name?.charAt(0) || 'U';
  const isEvent = ride.rideCategory === 'event';

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
      {/* Card Header */}
      <div className={`p-6 relative overflow-hidden ${ride.type === 'driver' ? 'bg-gradient-to-br from-uci-blue to-blue-600' : 'bg-gradient-to-br from-teal-500 to-teal-600'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/20">
              {userInitial}
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg leading-tight">{ride.user.name}</h3>
              <p className={`text-xs opacity-90 ${ride.type === 'driver' ? 'text-blue-50' : 'text-white/60'}`}>{displayMajor}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{ride.type}</span>
            </div>
            <TierBadge tier={ride.user.authTier || 'general'} size="sm" />
          </div>
        </div>

        {/* Ride category indicator */}
        <div className="mt-3 flex items-center gap-2">
          {isEvent ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/15 px-2.5 py-1 rounded-lg">
              <CalendarDays size={13} />
              {ride.eventDate ? new Date(ride.eventDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Event'}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/15 px-2.5 py-1 rounded-lg">
              <Repeat size={13} />
              Commute
            </span>
          )}
          {ride.details.genderPreference && ride.details.genderPreference !== 'no_preference' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-white/80 bg-white/15 px-2.5 py-1 rounded-lg">
              <Shield size={12} />
              {ride.details.genderPreference === 'same_gender' ? 'Same gender' : ride.details.genderPreference === 'women_and_nb' ? 'Women & NB' : 'Men only'}
            </span>
          )}
        </div>

        {/* Route Visual */}
        <div className="mt-4 flex items-center gap-4 text-white relative">
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className={`text-xs uppercase tracking-wider mb-1 ${ride.type === 'driver' ? 'text-blue-100' : 'text-white/60'}`}>From</p>
            <p className="font-bold whitespace-nowrap overflow-hidden" style={{ maskImage: 'linear-gradient(to right, black 75%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 75%, transparent)' }}>{ride.origin}</p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="w-16 h-0.5 bg-white/30 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="p-1 bg-white/20 rounded-full mt-[-10px] backdrop-blur-sm">
              <ArrowRight size={12} />
            </div>
          </div>
          <div className="flex-1 min-w-0 overflow-hidden text-right">
            <p className={`text-xs uppercase tracking-wider mb-1 ${ride.type === 'driver' ? 'text-blue-100' : 'text-white/60'}`}>To</p>
            <p className="font-bold whitespace-nowrap overflow-hidden" style={{ maskImage: 'linear-gradient(to left, black 75%, transparent)', WebkitMaskImage: 'linear-gradient(to left, black 75%, transparent)' }}>{destinationShort}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">
                {isEvent ? 'Date' : 'Days'}
              </p>
              <p className="text-sm font-medium text-slate-900">
                {isEvent && ride.eventDate
                  ? new Date(ride.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                  : daysLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Time</p>
              <p className="text-sm font-medium text-slate-900">{formatTime(ride.schedule.timeStart)} - {formatTime(ride.schedule.timeEnd)}</p>
            </div>
          </div>
          {ride.details.vehicle && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Car size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Vehicle</p>
                <p className="text-sm font-medium text-slate-900">{ride.details.vehicle.color} {ride.details.vehicle.year} {ride.details.vehicle.make} {ride.details.vehicle.model}</p>
              </div>
            </div>
          )}
          {ride.type === 'driver' && ride.details.costType && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Cost</p>
                <p className="text-sm font-medium text-slate-900">{formatCostType(ride.details.costType)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              showMap
                ? 'bg-uci-blue/10 text-uci-blue border border-uci-blue/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            <Map size={16} />
            {showMap ? 'Hide Route' : 'View Route'}
            <ChevronDown size={16} className={`transition-transform ${showMap ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => onSelect(ride)}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-uci-blue transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group-hover:gap-3">
            View Details <ChevronRight size={16} />
          </button>
        </div>

        {showMap && (
          <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
            <RouteMap origin={ride.origin} destination={ride.destination} height="200px" interactive={false} />
          </div>
        )}
      </div>
    </div>
  );
};
