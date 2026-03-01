import React from 'react';
import { Loader2 } from 'lucide-react';
import { getMatchQualityLabel } from '../../services/matching';
import type { Ride } from '../../types';

export interface FindResult {
  ride: Ride;
  score: {
    total: number;
    routeProximity: number;
    timeOverlap: number;
    dayOverlap: number;
    preferences: number;
  };
}

interface FindMatchResultsProps {
  results: FindResult[];
  isFinding: boolean;
  hasSearched: boolean;
  requestingIds: Set<string>;
  onRequestMatch: (ride: Ride, score: number) => void;
}

export const FindMatchResults: React.FC<FindMatchResultsProps> = ({
  results,
  isFinding,
  hasSearched,
  requestingIds,
  onRequestMatch,
}) => {
  if (isFinding) {
    return (
      <div className="mt-8 flex items-center justify-center py-8 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-3" />
        <span className="font-medium">Searching for matches...</span>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <p className="text-slate-400 font-medium">
          No compatible rides found. Try selecting a different ride.
        </p>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        {results.length} match{results.length !== 1 ? 'es' : ''} found
      </p>
      {results.map(({ ride, score }) => (
        <div
          key={ride.id}
          className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900 truncate">
                {ride.user.name}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  ride.type === 'driver'
                    ? 'bg-blue-100 text-uci-blue'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {ride.type}
              </span>
            </div>
            <p className="text-sm text-slate-500 truncate">
              {ride.origin} to {ride.destination}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {ride.schedule.days.join(', ')} - {ride.schedule.timeStart} to{' '}
              {ride.schedule.timeEnd}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="font-display font-bold text-2xl text-uci-blue">
                {score.total}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {getMatchQualityLabel(score.total)}
              </p>
            </div>
            <button
              onClick={() => onRequestMatch(ride, score.total)}
              disabled={requestingIds.has(ride.id)}
              className="px-5 py-2.5 bg-uci-blue text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {requestingIds.has(ride.id) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Request'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
