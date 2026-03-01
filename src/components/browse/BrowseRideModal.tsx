import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, Car, User, ArrowRight, DollarSign, MessageCircle, Instagram, Mail, Phone, Sparkles, Shield, Repeat, CalendarDays, Tag, Send } from 'lucide-react';
import { Ride } from '../../types';
import { TierBadge } from '../ui/TierBadge';
import { RouteMap } from '../ui/RouteMap';
import { formatTime } from '../../lib/formatters';
import { useAuth } from '../../context/AuthContext';
import { SendInterestModal } from './SendInterestModal';

function formatGenderPreference(pref: string): string {
  switch (pref) {
    case 'same_gender': return 'Same gender preferred';
    case 'women_and_nb': return 'Women and non-binary only';
    case 'men_only': return 'Men only';
    default: return 'No preference';
  }
}

function formatEventTag(tag: string): string {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

interface BrowseRideModalProps {
  ride: Ride;
  onClose: () => void;
}

export const BrowseRideModal: React.FC<BrowseRideModalProps> = ({ ride, onClose }) => {
  const { user } = useAuth();
  const contactName = ride.user?.name?.split(' ')[0] || 'them';
  const isEvent = ride.rideCategory === 'event';
  const [showInterestModal, setShowInterestModal] = useState(false);
  const isOwnRide = user?.id === ride.userId;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center pt-24 pb-6 px-4">
      {/* Backdrop: below navbar (z-50) so navbar stays visible */}
      <div className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[60] bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200" role="dialog" aria-modal="true">
        <button onClick={onClose} aria-label="Close details"
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-slate-100 transition-colors">
          <X size={20} />
        </button>

        <div className="overflow-y-auto min-h-0">
        {/* Header */}
        <div className={`p-8 relative overflow-hidden ${ride.type === 'driver' ? 'bg-gradient-to-br from-uci-blue to-blue-600' : 'bg-gradient-to-br from-teal-500 to-teal-600'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-inner border border-white/20">
                {ride.user.name.charAt(0)}
              </div>
              <div className="text-white">
                <h2 className="font-bold text-2xl">{ride.user.name}</h2>
                <p className={`${ride.type === 'driver' ? 'text-blue-100' : 'text-white/70'}`}>{ride.user.major} - {ride.user.year}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <TierBadge tier={ride.user.authTier || 'general'} size="sm" />
              {isEvent ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-2.5 py-1 rounded-lg">
                  <CalendarDays size={13} /> Event
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-2.5 py-1 rounded-lg">
                  <Repeat size={13} /> Commute
                </span>
              )}
              {ride.uciOnly && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 px-2.5 py-1 rounded-lg">
                  <Shield size={13} /> UCI Only
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 text-white">
              <div className="flex-1">
                <p className={`text-xs uppercase tracking-wider mb-1 ${ride.type === 'driver' ? 'text-blue-100' : 'text-white/60'}`}>From</p>
                <p className="font-bold text-lg">{ride.origin}</p>
              </div>
              <ArrowRight size={24} className="text-white/50" />
              <div className="flex-1 text-right">
                <p className={`text-xs uppercase tracking-wider mb-1 ${ride.type === 'driver' ? 'text-blue-100' : 'text-white/60'}`}>To</p>
                <p className="font-bold text-lg">{ride.destination || 'UCI Campus'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="p-6 border-b border-slate-100">
          <RouteMap origin={ride.origin} destination={ride.destination} height="250px" />
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Calendar size={16} />
                <span className="text-xs font-bold uppercase">{isEvent ? 'Date' : 'Days'}</span>
              </div>
              <p className="font-bold text-slate-900">
                {isEvent && ride.eventDate
                  ? new Date(ride.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                  : ride.schedule.days.length ? ride.schedule.days.join(', ') : 'Flexible'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase">Time</span>
              </div>
              <p className="font-bold text-slate-900">{formatTime(ride.schedule.timeStart)} - {formatTime(ride.schedule.timeEnd)}</p>
            </div>
          </div>

          {/* Event tag */}
          {isEvent && ride.eventTag && (
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Tag size={16} />
                <span className="text-xs font-bold uppercase">Event Type</span>
              </div>
              <p className="font-bold text-slate-900">{formatEventTag(ride.eventTag)}</p>
            </div>
          )}

          {/* Driver Details */}
          {ride.type === 'driver' && (
            <div className="grid grid-cols-2 gap-4">
              {ride.details.vehicle && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Car size={16} />
                    <span className="text-xs font-bold uppercase">Vehicle</span>
                  </div>
                  <p className="font-bold text-slate-900">{ride.details.vehicle.color} {ride.details.vehicle.year} {ride.details.vehicle.make} {ride.details.vehicle.model}</p>
                </div>
              )}
              {ride.details.seats && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <User size={16} />
                    <span className="text-xs font-bold uppercase">Seats Available</span>
                  </div>
                  <p className="font-bold text-slate-900">{ride.details.seats}</p>
                </div>
              )}
              {ride.details.cleanliness && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase">Cleanliness</span>
                  </div>
                  <p className="font-bold text-slate-900">{ride.details.cleanliness} / 5</p>
                </div>
              )}
              {ride.details.yearsDriving !== undefined && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Shield size={16} />
                    <span className="text-xs font-bold uppercase">Experience</span>
                  </div>
                  <p className="font-bold text-slate-900">{ride.details.yearsDriving} years</p>
                </div>
              )}
              {ride.details.costType && (
                <div className="bg-slate-50 rounded-2xl p-4 col-span-2">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <DollarSign size={16} />
                    <span className="text-xs font-bold uppercase">Cost Sharing</span>
                  </div>
                  <p className="font-bold text-slate-900 capitalize">{ride.details.costType.replace(/_/g, ' ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Gender preference (both roles) */}
          {ride.details.genderPreference && ride.details.genderPreference !== 'no_preference' && (
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Shield size={16} />
                <span className="text-xs font-bold uppercase">Gender Preference</span>
              </div>
              <p className="font-bold text-slate-900">{formatGenderPreference(ride.details.genderPreference)}</p>
            </div>
          )}

          {/* Notes */}
          {ride.details.notes && (
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <MessageCircle size={16} />
                <span className="text-xs font-bold uppercase">Notes</span>
              </div>
              <p className="text-slate-700">{ride.details.notes}</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Contact {contactName}</h3>
            <div className="flex flex-wrap gap-3">
              {ride.user.socials?.instagram && (
                <a href={`https://instagram.com/${ride.user.socials.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                  <Instagram size={18} /> @{ride.user.socials.instagram}
                </a>
              )}
              {ride.user.socials?.discord && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-medium">
                  <MessageCircle size={18} /> {ride.user.socials.discord}
                </div>
              )}
              {ride.user.socials?.phone && (
                <a href={`tel:${ride.user.socials.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                  <Phone size={18} /> {ride.user.socials.phone}
                </a>
              )}
              {ride.user.email && (
                <a href={`mailto:${ride.user.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  <Mail size={18} /> Email
                </a>
              )}
            </div>
          </div>

          {/* I'm Interested button */}
          {!isOwnRide && (
            <button
              onClick={() => setShowInterestModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-uci-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <Send size={18} />
              I'm Interested
            </button>
          )}
        </div>
        </div>

        {showInterestModal && (
          <SendInterestModal
            ride={ride}
            onClose={() => setShowInterestModal(false)}
            onSuccess={() => {
              setShowInterestModal(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>,
    document.body
  );
};
