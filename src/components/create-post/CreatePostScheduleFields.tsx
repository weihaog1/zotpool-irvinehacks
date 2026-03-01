import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { EventTag } from '../../types';
import { SelectField } from '../ui/SelectField';
import { DAYS_OF_WEEK } from '../../constants';

interface CreatePostScheduleFieldsProps {
  isCommute: boolean;
  days: string[];
  onDayToggle: (day: string) => void;
  timeStart: string;
  setTimeStart: (v: string) => void;
  timeEnd: string;
  setTimeEnd: (v: string) => void;
  isRecurring: boolean;
  setIsRecurring: (v: boolean) => void;
  eventDate: string;
  setEventDate: (v: string) => void;
  eventTag: EventTag;
  setEventTag: (v: EventTag) => void;
  hasInvalidTime: boolean;
}

export const CreatePostScheduleFields: React.FC<CreatePostScheduleFieldsProps> = ({
  isCommute, days, onDayToggle, timeStart, setTimeStart, timeEnd, setTimeEnd,
  isRecurring, setIsRecurring, eventDate, setEventDate, eventTag, setEventTag,
  hasInvalidTime,
}) => {
  return (
    <div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Calendar size={22} className="text-uci-gold" />
        {isCommute ? 'Weekly Schedule' : 'Event Details'}
      </h3>
      <div className="space-y-6">

        {/* Commute: day selector */}
        {isCommute && (
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-3 ml-1">Days</label>
            <div className="flex flex-wrap gap-3">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => onDayToggle(day)}
                  className={`w-14 h-14 rounded-2xl font-bold transition-all duration-200 text-sm ${
                    days.includes(day)
                      ? 'bg-uci-blue text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Event: date picker and tag */}
        {!isCommute && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
            <SelectField
              label="Event Type"
              value={eventTag}
              onChange={(val) => setEventTag(val as EventTag)}
              options={[
                { value: 'airport', label: 'Airport' },
                { value: 'going_home', label: 'Going Home' },
                { value: 'campus_event', label: 'Campus Event' },
                { value: 'off_campus_event', label: 'Off-Campus Event' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Departure Time</label>
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 outline-none font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Return Time</label>
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 outline-none font-medium"
            />
          </div>
        </div>
        {hasInvalidTime && (
          <p className="text-sm text-amber-600 font-medium flex items-center gap-1.5">
            <AlertCircle size={16} />
            Return time should be later than your departure time.
          </p>
        )}

        {isCommute && (
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5 text-uci-blue rounded focus:ring-uci-blue border-slate-300"
            />
            <span className="text-slate-700 font-medium">Repeat this schedule weekly</span>
          </label>
        )}
      </div>
    </div>
  );
};
