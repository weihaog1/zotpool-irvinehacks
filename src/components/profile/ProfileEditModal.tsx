import React, { useState } from 'react';
import { X, Loader2, Camera } from 'lucide-react';
import { SelectField } from '../ui/SelectField';

interface ProfileFormData {
  name: string;
  city: string;
  major: string;
  year: string;
  pronouns: string;
  gender: string;
  instagram: string;
  discord: string;
  phone: string;
  avatar: string;
}

interface ProfileEditModalProps {
  initialData: ProfileFormData;
  onSave: (data: ProfileFormData) => Promise<void>;
  onClose: () => void;
}

const genderOptions = [
  { value: '', label: 'Prefer not to say' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Other', label: 'Other' },
];

const yearOptions = [
  { value: '', label: 'Select year' },
  { value: 'Freshman', label: 'Freshman' },
  { value: 'Sophomore', label: 'Sophomore' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Graduate', label: 'Graduate' },
  { value: 'PhD', label: 'PhD' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Alumni', label: 'Alumni' },
];

const inputClasses = 'w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue outline-none font-medium';

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      await onSave(formData);
    } catch {
      setSaveError('Could not save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8" role="dialog" aria-modal="true">
        <button
          onClick={onClose}
          aria-label="Close edit profile"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-uci-blue/10 text-uci-blue flex items-center justify-center">
            <Camera size={22} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-900">Edit profile</h3>
            <p className="text-sm text-slate-500">Update your details and keep your profile fresh.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Avatar URL</label>
            <input
              value={formData.avatar}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">City</label>
            <input
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Major</label>
            <input
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <SelectField
            label="Year"
            value={formData.year}
            onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
            options={yearOptions}
            placeholder="Select year"
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Pronouns</label>
            <input
              value={formData.pronouns}
              onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <SelectField
            label="Gender"
            value={formData.gender}
            onChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}
            options={genderOptions}
            placeholder="Select gender"
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Instagram</label>
            <input
              value={formData.instagram}
              onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
              placeholder="username"
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Discord</label>
            <input
              value={formData.discord}
              onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
              placeholder="username#0000"
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone</label>
            <input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(123) 456-7890"
              className={inputClasses}
            />
          </div>
        </div>

        {saveError && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium">
            {saveError}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-full bg-uci-blue text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
