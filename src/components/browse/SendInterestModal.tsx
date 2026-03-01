import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Instagram, MessageCircle, Phone, Mail, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Ride, ContactMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useRides } from '../../context/RideContext';
import { calculateMatchScore } from '../../services/matching';
import { createMatchRequest, createInterestNotification } from '../../services/matches';

interface SendInterestModalProps {
  ride: Ride;
  onClose: () => void;
  onSuccess: () => void;
}

const CONTACT_OPTIONS: { value: ContactMethod; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'discord', label: 'Discord', icon: MessageCircle },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
];

export const SendInterestModal: React.FC<SendInterestModalProps> = ({ ride, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { rides } = useRides();

  const [selectedContactMethod, setSelectedContactMethod] = useState<ContactMethod | null>(null);
  const [selectedRideId, setSelectedRideId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactName = ride.user?.name?.split(' ')[0] || 'them';
  const complementaryType = ride.type === 'driver' ? 'passenger' : 'driver';

  // Filter user's rides to the complementary type
  const myComplementaryRides = useMemo(
    () => rides.filter((r) => r.userId === user?.id && r.status === 'active' && r.type === complementaryType),
    [rides, user?.id, complementaryType],
  );

  // Auto-select if only one ride
  const effectiveSelectedId = myComplementaryRides.length === 1 ? myComplementaryRides[0].id : selectedRideId;
  const selectedRide = myComplementaryRides.find((r) => r.id === effectiveSelectedId) ?? null;

  // Filter contact methods to what the ride owner has listed
  const availableContactMethods = useMemo(() => {
    return CONTACT_OPTIONS.filter((opt) => {
      switch (opt.value) {
        case 'instagram': return !!ride.user.socials?.instagram;
        case 'discord': return !!ride.user.socials?.discord;
        case 'phone': return !!ride.user.socials?.phone;
        case 'email': return !!ride.user.email;
        default: return false;
      }
    });
  }, [ride.user]);

  const handleSend = async () => {
    if (!user || !selectedRide) return;
    setIsSending(true);
    setError(null);

    try {
      // Calculate score (0 if hard-filtered)
      const scoreResult = calculateMatchScore(selectedRide, ride);
      const score = scoreResult?.total ?? 0;

      const driverRideId = ride.type === 'driver' ? ride.id : selectedRide.id;
      const passengerRideId = ride.type === 'passenger' ? ride.id : selectedRide.id;

      await createMatchRequest(
        driverRideId,
        passengerRideId,
        score,
        user.id,
        selectedContactMethod ?? undefined,
      );

      const rideSummary = `${ride.origin} to ${ride.destination}`;
      await createInterestNotification(ride.userId, user.name, rideSummary);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send interest');
    } finally {
      setIsSending(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[70] bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-slate-100 transition-colors">
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">Send Interest</h2>
            <p className="text-sm text-slate-500 mt-1">Let {contactName} know you want to ride together</p>
          </div>

          {/* Contact info section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-bold text-slate-800">
              Messaging {contactName} directly will <span className="text-uci-blue">significantly</span> increase your chances of being accepted!
            </p>
            <div className="flex flex-wrap gap-2">
              {ride.user.socials?.instagram && (
                <a href={`https://instagram.com/${ride.user.socials.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  <Instagram size={14} /> @{ride.user.socials.instagram}
                  <ExternalLink size={12} />
                </a>
              )}
              {ride.user.socials?.discord && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium">
                  <MessageCircle size={14} /> {ride.user.socials.discord}
                </div>
              )}
              {ride.user.socials?.phone && (
                <a href={`tel:${ride.user.socials.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  <Phone size={14} /> {ride.user.socials.phone}
                </a>
              )}
              {ride.user.email && (
                <a href={`mailto:${ride.user.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  <Mail size={14} /> Email
                </a>
              )}
            </div>
          </div>

          {/* Contact method selector */}
          {availableContactMethods.length > 0 && (
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                How will you contact {contactName}? <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableContactMethods.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedContactMethod === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedContactMethod(isSelected ? null : opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                        isSelected
                          ? 'bg-uci-blue text-white border-uci-blue shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={14} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ride picker */}
          {myComplementaryRides.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
              <p className="text-sm font-medium text-amber-800">
                You need a {complementaryType} ride to match.
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-uci-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Create one now
                <ExternalLink size={14} />
              </Link>
            </div>
          ) : myComplementaryRides.length > 1 ? (
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Select your ride</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
                >
                  <span className={selectedRide ? 'text-slate-900' : 'text-slate-400'}>
                    {selectedRide
                      ? `${selectedRide.origin} to ${selectedRide.destination}`
                      : 'Select a ride...'}
                  </span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                    {myComplementaryRides.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setSelectedRideId(r.id); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          effectiveSelectedId === r.id ? 'bg-blue-50 text-uci-blue font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-medium">{r.origin} to {r.destination}</span>
                        <span className="ml-2 text-xs text-slate-400 uppercase">{r.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Your ride</p>
              <p className="text-sm font-medium text-slate-700">
                {myComplementaryRides[0].origin} to {myComplementaryRides[0].destination}
                <span className="ml-2 text-xs text-slate-400 uppercase">{myComplementaryRides[0].type}</span>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!selectedRide || isSending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-uci-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isSending ? 'Sending...' : 'Send Interest'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
