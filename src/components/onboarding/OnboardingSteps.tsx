import React, { useState, useEffect, useRef } from 'react';
import { Check, User, MapPin, Share2, Car, GraduationCap, Instagram, Phone, MessageCircle, Truck } from 'lucide-react';
import { SelectField } from '../ui/SelectField';
import { VehicleDetailsForm, VehicleFormData } from '../ui/VehicleDetailsForm';

interface InputFieldProps {
  label: string;
  [key: string]: unknown;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
  <div className="group">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
    <input
      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all"
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  </div>
);

export interface OnboardingFormData {
  name: string;
  gender: string;
  pronouns: string;
  city: string;
  major: string;
  year: string;
  phone: string;
  instagram: string;
  discord: string;
  role: 'driver' | 'passenger' | 'both' | '';
  vehicle: VehicleFormData;
}

interface StepProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  email?: string;
}

export const StepNameGender: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner rotate-3">
        <User size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-slate-900">Let's introduce you</h2>
      <p className="text-slate-500 text-lg mt-2">Basic info so others know who they're riding with.</p>
    </div>
    <div className="space-y-5">
      <InputField
        label="Display Name *"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Peter Anteater"
      />
      <div className="grid grid-cols-2 gap-5">
        <SelectField
          label="Gender (optional)"
          value={formData.gender}
          onChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}
          placeholder=""
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Non-binary', label: 'Non-binary' },
          ]}
        />
        <InputField
          label="Pronouns (optional)"
          value={formData.pronouns}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
          placeholder=""
        />
      </div>
      <p className="text-xs text-slate-400 ml-1">* Required</p>
    </div>
  </div>
);

export const StepCity: React.FC<StepProps> = ({ formData, setFormData }) => {
  const [suggestions, setSuggestions] = useState<{ place_name: string; text: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!token || query.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=US&proximity=-117.8443,33.6405&types=place,locality,neighborhood&limit=5`
        );
        const data = await res.json();
        if (data.features) {
          setSuggestions(data.features.map((f: { place_name: string; text: string }) => ({
            place_name: f.place_name,
            text: f.text,
          })));
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, city: val }));
    fetchSuggestions(val);
  };

  const handleSelect = (suggestion: { place_name: string; text: string }) => {
    setFormData(prev => ({ ...prev, city: suggestion.text }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner -rotate-3">
          <MapPin size={40} />
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900">Your Commute</h2>
        <p className="text-slate-500 text-lg mt-2">Where are you coming from?</p>
      </div>
      <div className="space-y-5">
        <div ref={containerRef} className="relative">
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">City / Area (optional)</label>
          <input
            type="text"
            value={formData.city}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="e.g. Irvine Spectrum"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3"
                  >
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{s.text}</p>
                      <p className="text-xs text-slate-400 truncate">{s.place_name}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export const StepStudies: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner rotate-3">
        <GraduationCap size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-slate-900">Your Studies</h2>
      <p className="text-slate-500 text-lg mt-2">Tell us about your academic background.</p>
    </div>
    <div className="space-y-5">
      <InputField
        label="Major (optional)"
        value={formData.major}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, major: e.target.value }))}
        placeholder="e.g. Computer Science"
      />
      <SelectField
        label="Year (optional)"
        value={formData.year}
        onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
        placeholder="Select..."
        options={[
          { value: 'Freshman', label: 'Freshman' },
          { value: 'Sophomore', label: 'Sophomore' },
          { value: 'Junior', label: 'Junior' },
          { value: 'Senior', label: 'Senior' },
          { value: 'Grad', label: 'Grad Student' },
          { value: 'PhD Student', label: 'PhD Student' },
        ]}
      />
    </div>
  </div>
);

export const StepSocials: React.FC<StepProps> = ({ formData, setFormData, email }) => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner rotate-6">
        <Share2 size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-slate-900">Get Connected</h2>
      <p className="text-slate-500 text-lg mt-2">Optional ways for matches to reach you.</p>
    </div>
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
          <Phone size={16} className="text-uci-blue" /> Phone Number (optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(123) 456-7890"
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
          <Instagram size={16} className="text-uci-blue" /> Instagram (optional)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-4 text-slate-400 font-medium">@</span>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
            className="w-full p-4 pl-9 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
          <MessageCircle size={16} className="text-uci-blue" /> Discord Username (optional)
        </label>
        <input
          type="text"
          value={formData.discord}
          onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all"
        />
      </div>
    </div>
  </div>
);

export const StepRole: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner">
        <Car size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-slate-900">How will you participate?</h2>
      <p className="text-slate-500 text-lg mt-2">This helps us customize your feed.</p>
    </div>
    <div className="grid gap-4">
      {[
        { id: 'driver', label: 'I am a Driver', desc: 'I have a car and want to fill empty seats.' },
        { id: 'passenger', label: 'I need a Ride', desc: 'I want to find a driver to commute with.' },
        { id: 'both', label: 'Both', desc: 'I can drive sometimes, but might need rides too.' },
      ].map((option) => (
        <button
          key={option.id}
          onClick={() => setFormData(prev => ({ ...prev, role: option.id as 'driver' | 'passenger' | 'both' }))}
          className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
            formData.role === option.id
              ? 'border-uci-blue bg-blue-50/50 shadow-inner'
              : 'border-slate-100 hover:border-uci-blue/30 hover:bg-slate-50'
          }`}
        >
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className={`font-bold text-lg ${formData.role === option.id ? 'text-uci-blue' : 'text-slate-900'}`}>{option.label}</div>
              <div className="text-sm text-slate-500 mt-1">{option.desc}</div>
            </div>
            {formData.role === option.id && (
              <div className="w-6 h-6 bg-uci-blue rounded-full flex items-center justify-center text-white">
                <Check size={14} />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
    <p className="text-xs text-slate-400 ml-1">* Required - select one to continue</p>
  </div>
);

export const StepVehicle: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner -rotate-3">
        <Truck size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-slate-900">Your Vehicle</h2>
      <p className="text-slate-500 text-lg mt-2">Add your car details so riders know what to expect.</p>
    </div>
    <VehicleDetailsForm
      value={formData.vehicle}
      onChange={(vehicle) => setFormData(prev => ({ ...prev, vehicle }))}
    />
    <p className="text-xs text-slate-400 ml-1">All fields are optional. You can add this later from your profile.</p>
  </div>
);
