import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Calendar, Car, CheckCircle, XCircle, Phone, Mail, Instagram, MessageCircle, Eye, Info } from 'lucide-react';
import { TierBadge } from '../ui/TierBadge';
import { BrowseRideModal } from '../browse/BrowseRideModal';
import type { Match, Ride, MatchStatus, ContactMethod } from '../../types';
import { formatTime } from '../../lib/formatters';
import { DAYS_OF_WEEK } from '../../constants';

interface MatchCardProps {
  match: Match;
  userRide: Ride;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
}

function getQualityLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent match', color: 'text-emerald-600' };
  if (score >= 60) return { label: 'Good fit', color: 'text-uci-blue' };
  return { label: 'Possible match', color: 'text-amber-600' };
}

function getStatusConfig(status: MatchStatus) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'accepted':
      return { label: 'Accepted', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'declined':
      return { label: 'Declined', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
    case 'cancelled':
      return { label: 'Cancelled', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
  }
}

function getOverlappingDays(daysA: string[], daysB: string[]): string[] {
  return daysA.filter((d) => daysB.includes(d));
}

const contactMethodConfig: Record<ContactMethod, { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  instagram: { label: 'Instagram', icon: Instagram },
  discord: { label: 'Discord', icon: MessageCircle },
  phone: { label: 'Phone', icon: Phone },
  email: { label: 'Email', icon: Mail },
};

const ScoreBar: React.FC<{ label: string; value: number; max: number }> = ({
  label,
  value,
  max,
}) => {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 text-slate-500 font-medium shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-uci-blue rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 text-right text-slate-600 font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
};

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  userRide,
  onAccept,
  onDecline,
}) => {
  const [showRideModal, setShowRideModal] = useState(false);

  const otherRide =
    userRide.type === 'driver' ? match.passengerRide : match.driverRide;

  if (!otherRide) return null;

  const otherUser = otherRide.user;
  const quality = getQualityLabel(match.score);
  const statusConfig = getStatusConfig(match.status);
  const vehicle = otherRide.details.vehicle;

  const overlappingDays = getOverlappingDays(
    userRide.schedule.days,
    otherRide.schedule.days
  );

  // Approximate score breakdown based on total (weights: route 40, time 25, day 20, prefs 15)
  const routeScore = Math.round(match.score * 0.4);
  const timeScore = Math.round(match.score * 0.25);
  const dayScore = Math.round(match.score * 0.2);
  const prefScore = match.score - routeScore - timeScore - dayScore;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header with score */}
      <div className="bg-gradient-to-r from-uci-blue to-blue-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-lg font-bold">
            {match.score}
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {match.score}% <span className="font-medium text-white/80">-</span>{' '}
              <span className="text-white/90 font-medium">{quality.label}</span>
            </p>
            <p className="text-white/70 text-sm">Match score</p>
          </div>
        </div>
        {match.status !== 'pending' && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            {statusConfig.label}
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Score breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Score Breakdown
          </p>
          <ScoreBar label="Route" value={routeScore} max={40} />
          <ScoreBar label="Time" value={timeScore} max={25} />
          <ScoreBar label="Schedule" value={dayScore} max={20} />
          <ScoreBar label="Preferences" value={prefScore} max={15} />
        </div>

        <div className="h-px bg-slate-100" />

        {/* Other user info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-uci-blue to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-900 truncate">{otherUser.name}</p>
              <TierBadge tier={otherUser.authTier} size="sm" />
            </div>
            {vehicle && (
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Car size={14} />
                {vehicle.color} {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Route comparison */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Routes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400 mb-1.5">Your ride</p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">{userRide.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mt-1">
                <Navigation size={14} className="text-uci-blue shrink-0" />
                <span className="truncate">{userRide.destination}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400 mb-1.5">Their ride</p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">{otherRide.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mt-1">
                <Navigation size={14} className="text-uci-blue shrink-0" />
                <span className="truncate">{otherRide.destination}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Schedule overlap */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Schedule
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const inUser = userRide.schedule.days.includes(day);
              const inOther = otherRide.schedule.days.includes(day);
              const overlap = inUser && inOther;
              return (
                <span
                  key={day}
                  className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center ${
                    overlap
                      ? 'bg-uci-blue text-white shadow-sm'
                      : inUser || inOther
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-50 text-slate-300'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-uci-blue" />
              <span className="font-medium">
                {formatTime(otherRide.schedule.timeStart)} -{' '}
                {formatTime(otherRide.schedule.timeEnd)}
              </span>
            </div>
            {overlappingDays.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-500" />
                <span className="font-medium">
                  {overlappingDays.length} day{overlappingDays.length !== 1 ? 's' : ''} overlap
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact info for accepted matches */}
        {match.status === 'accepted' && otherUser.socials && (
          <>
            <div className="h-px bg-slate-100" />
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle size={14} />
                Contact Info
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                {otherUser.email && (
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Mail size={14} className="text-slate-400" />
                    {otherUser.email}
                  </span>
                )}
                {otherUser.socials.phone && (
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Phone size={14} className="text-slate-400" />
                    {otherUser.socials.phone}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Contact method badge for pending matches */}
        {match.status === 'pending' && match.contactMethod && (
          <>
            <div className="h-px bg-slate-100" />
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center gap-2">
              <Info size={16} className="text-uci-blue shrink-0" />
              <p className="text-sm text-blue-800 font-medium">
                They plan to contact you via{' '}
                <span className="font-bold">{contactMethodConfig[match.contactMethod].label}</span>
              </p>
            </div>
          </>
        )}

        {/* Action buttons for pending matches */}
        {match.status === 'pending' && (onAccept || onDecline) && (
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setShowRideModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              <Eye size={18} />
              View Details
            </button>
            {onAccept && (
              <button
                onClick={() => onAccept(match.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <CheckCircle size={18} />
                Accept
              </button>
            )}
            {onDecline && (
              <button
                onClick={() => onDecline(match.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-200"
              >
                <XCircle size={18} />
                Decline
              </button>
            )}
          </div>
        )}

        {/* View Details for non-pending matches */}
        {match.status !== 'pending' && (
          <div className="pt-1">
            <button
              onClick={() => setShowRideModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors w-full"
            >
              <Eye size={18} />
              View Details
            </button>
          </div>
        )}
      </div>

      {showRideModal && otherRide && (
        <BrowseRideModal ride={otherRide} onClose={() => setShowRideModal(false)} />
      )}
    </div>
  );
};
