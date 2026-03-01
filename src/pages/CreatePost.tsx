import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import { Car, User, MapPin, Loader2, AlertCircle, Shield, Info, CheckCircle } from 'lucide-react';
import { CostType, CarCleanliness, GenderPreference, RideCategory, EventTag } from '../types';
import { RouteMap, SelectField, RideCategoryPicker } from '../components/ui';
import { PaymentSuggestionCard, CreatePostDriverFields, CreatePostScheduleFields } from '../components/create-post';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { rides, addRide, updateRide } = useRides();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');
  const isEditing = Boolean(postId);
  const rideToEdit = rides.find(ride => ride.id === postId);
  const [type, setType] = useState<'driver' | 'passenger'>('driver');

  const [rideCategory, setRideCategory] = useState<RideCategory>('commute');
  const [origin, setOrigin] = useState(user?.city || '');
  const [destination, setDestination] = useState('UCI Main Campus');
  const [days, setDays] = useState<string[]>([]);
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('17:00');
  const [isRecurring, setIsRecurring] = useState(true);
  const [eventDate, setEventDate] = useState('');
  const [eventTag, setEventTag] = useState<EventTag>('other');
  const [carType, setCarType] = useState('');
  const [seats, setSeats] = useState(3);
  const [cleanliness, setCleanliness] = useState<CarCleanliness>(5);
  const [yearsDriving, setYearsDriving] = useState(2);
  const [costType, setCostType] = useState<CostType>('split_gas');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('no_preference');
  const [uciOnly, setUciOnly] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const hasInvalidTime = timeStart >= timeEnd;
  const isCommute = rideCategory === 'commute';
  const isUciUser = user?.authTier === 'uci';
  const scheduleIsInvalid = isCommute ? days.length === 0 : !eventDate;

  useEffect(() => {
    if (!isEditing && user?.city && !origin) setOrigin(user.city);
  }, [user, origin, isEditing]);

  useEffect(() => {
    if (!isEditing || !rideToEdit) return;
    setType(rideToEdit.type);
    setRideCategory(rideToEdit.rideCategory || 'commute');
    setOrigin(rideToEdit.origin);
    setDestination(rideToEdit.destination);
    setDays(rideToEdit.schedule.days);
    setTimeStart(rideToEdit.schedule.timeStart);
    setTimeEnd(rideToEdit.schedule.timeEnd);
    setIsRecurring(rideToEdit.schedule.isRecurring);
    setEventDate(rideToEdit.eventDate || '');
    setEventTag(rideToEdit.eventTag || 'other');
    setCarType(rideToEdit.details.vehicle ? `${rideToEdit.details.vehicle.make} ${rideToEdit.details.vehicle.model}` : '');
    setSeats(rideToEdit.details.seats || 3);
    setCleanliness(rideToEdit.details.cleanliness || 5);
    setYearsDriving(rideToEdit.details.yearsDriving || 2);
    setCostType(rideToEdit.details.costType || 'split_gas');
    setGenderPreference(rideToEdit.details.genderPreference || 'no_preference');
    setUciOnly(rideToEdit.uciOnly || false);
    setNotes(rideToEdit.details.notes || '');
  }, [isEditing, rideToEdit]);

  const handleDayToggle = (day: string) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isCommute && days.length === 0) {
      setError('Please select at least one day for your schedule.');
      return;
    }
    if (!isCommute && !eventDate) {
      setError('Please select a date for your event ride.');
      return;
    }
    if (hasInvalidTime) {
      setError('Return time must be later than your departure time.');
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        type,
        rideCategory,
        origin: origin.trim(),
        destination: destination.trim(),
        schedule: {
          days: isCommute ? days : [],
          timeStart,
          timeEnd,
          isRecurring: isCommute ? isRecurring : false,
        },
        eventDate: !isCommute ? eventDate : undefined,
        eventTag: !isCommute ? eventTag : undefined,
        details: {
          seats: type === 'driver' ? seats : undefined,
          cleanliness: type === 'driver' ? cleanliness : undefined,
          yearsDriving: type === 'driver' ? yearsDriving : undefined,
          genderPreference,
          costType: type === 'driver' ? costType : undefined,
          notes,
        },
        uciOnly: isUciUser ? uciOnly : false,
        status: 'active' as const,
      };

      if (isEditing && postId) {
        await updateRide(postId, payload);
      } else {
        await addRide(payload);
      }
      setShowSuccess(true);
      setTimeout(() => navigate(isEditing ? '/profile' : '/browse'), 1200);
    } catch (err) {
      setError(isEditing ? 'Failed to update ride. Please try again.' : 'Failed to create ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
          <div className="inline-flex items-center gap-3 text-slate-600 font-semibold">
            <Loader2 className="animate-spin" size={20} /> Loading listing...
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && !rideToEdit && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Listing not found</h2>
          <p className="text-slate-500 mb-6">That ride may have been removed or is no longer available.</p>
          <button onClick={() => navigate('/browse')} className="px-6 py-3 rounded-full bg-uci-blue text-white font-bold hover:bg-blue-700 transition-colors">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/30 font-bold">
            <CheckCircle size={20} />
            {isEditing ? 'Ride updated successfully!' : 'Ride posted successfully!'}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 md:px-10 pt-8 pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">
                {isEditing ? 'Edit your listing' : 'Create a new listing'}
              </h1>
              <p className="text-slate-500 mt-1">
                {isEditing ? 'Update your ride details and keep your schedule fresh.' : 'Post a ride or request to match with other Anteaters.'}
              </p>
            </div>
            {isEditing && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-uci-blue/10 text-uci-blue font-semibold text-sm">Editing</span>
            )}
          </div>
        </div>

        <RideCategoryPicker value={rideCategory} onChange={setRideCategory} />

        <div className="bg-slate-50/80 backdrop-blur border-b border-slate-200 p-3 flex gap-2">
          {(['driver', 'passenger'] as const).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300 ${
                type === t ? 'bg-white shadow-md text-uci-blue ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}>
              {t === 'driver' ? <Car size={22} className={type === t ? 'fill-uci-blue/10' : ''} /> : <User size={22} className={type === t ? 'fill-uci-blue/10' : ''} />}
              {t === 'driver' ? "I'm Driving" : 'I Need a Ride'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          {/* Route */}
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin size={22} className="text-uci-gold" /> Route Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Starting Point</label>
                <input type="text" required value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Irvine Spectrum"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white outline-none transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Destination</label>
                <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Within UCI"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white outline-none transition-all font-medium" />
              </div>
            </div>
            {origin.length > 2 && (
              <div className="mt-6">
                <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Route Preview</label>
                <RouteMap origin={origin} destination={destination} height="250px" />
              </div>
            )}
            {type === 'driver' && origin.length > 2 && destination.length > 2 && (
              <div className="mt-6">
                <PaymentSuggestionCard distanceMiles={15} totalRiders={seats} />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Schedule */}
          <CreatePostScheduleFields
            isCommute={isCommute} days={days} onDayToggle={handleDayToggle}
            timeStart={timeStart} setTimeStart={setTimeStart}
            timeEnd={timeEnd} setTimeEnd={setTimeEnd}
            isRecurring={isRecurring} setIsRecurring={setIsRecurring}
            eventDate={eventDate} setEventDate={setEventDate}
            eventTag={eventTag} setEventTag={setEventTag}
            hasInvalidTime={hasInvalidTime}
          />

          <div className="h-px bg-slate-100"></div>

          {/* Driver Details */}
          {type === 'driver' && (
            <CreatePostDriverFields
              carType={carType} setCarType={setCarType}
              seats={seats} setSeats={setSeats}
              yearsDriving={yearsDriving} setYearsDriving={setYearsDriving}
              cleanliness={cleanliness} setCleanliness={setCleanliness}
              costType={costType} setCostType={setCostType}
            />
          )}

          {/* Preferences (Both roles) */}
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield size={22} className="text-uci-gold" /> Preferences
            </h3>
            <div className="space-y-6">
              <SelectField label="Gender Preference" value={genderPreference}
                onChange={(val) => setGenderPreference(val as GenderPreference)}
                options={[
                  { value: 'no_preference', label: 'No preference' },
                  { value: 'same_gender', label: 'Same gender' },
                  { value: 'women_and_nb', label: 'Women and non-binary only' },
                  { value: 'men_only', label: 'Men only' },
                ]}
              />
              {isUciUser && (
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" checked={uciOnly} onChange={(e) => setUciOnly(e.target.checked)}
                    className="w-5 h-5 text-uci-blue rounded focus:ring-uci-blue border-slate-300" />
                  <div>
                    <span className="text-slate-700 font-medium">Restrict to UCI-verified riders only</span>
                    <p className="text-xs text-slate-400 mt-0.5">Only users with a verified @uci.edu email can see this listing</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Notes */}
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info size={22} className="text-uci-gold" /> Additional Notes
            </h3>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Talk about your music taste, specific pickup spots, or if you're okay with food/drinks..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white outline-none transition-all font-medium" />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
          )}

          {scheduleIsInvalid && !error && (
            <p className="text-sm text-amber-600 font-medium flex items-center gap-1.5">
              <AlertCircle size={16} />
              {isCommute ? 'Please select at least one day for your schedule' : 'Please select a date for your event'}
            </p>
          )}

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting || scheduleIsInvalid || hasInvalidTime}
              className="w-full bg-uci-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={20} /> {isEditing ? 'Saving...' : 'Creating...'}</>
              ) : (
                <>{isEditing ? 'Update Listing' : `Post ${type === 'driver' ? 'Ride' : 'Request'}`}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
