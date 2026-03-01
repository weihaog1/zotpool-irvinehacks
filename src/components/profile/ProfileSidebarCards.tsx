import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, MapPin, Hash, Mail, Phone, Instagram, MessageCircle,
  Car, ShieldCheck, AlertCircle, Loader2,
} from 'lucide-react';
import type { User as UserType, Vehicle } from '../../types';

function InfoRow({ icon, text, truncate }: { icon: React.ReactNode; text: string; truncate?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-uci-blue shrink-0">{icon}</div>
      <span className={`text-sm ${truncate ? 'truncate' : ''}`}>{text}</span>
    </div>
  );
}

export function ProfileAboutCard({ user }: { user: UserType }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="font-display font-bold text-slate-900 mb-4">About Me</h3>
      <div className="space-y-4">
        <InfoRow icon={<Mail size={16} />} text={user.email} truncate />
        <InfoRow icon={<MapPin size={16} />} text={user.city || 'Not specified'} />
        <InfoRow icon={<Hash size={16} />} text={user.pronouns || 'Not specified'} />
        {user.gender && <InfoRow icon={<User size={16} />} text={user.gender} />}
      </div>
    </div>
  );
}

export function ProfileContactCard({ user }: { user: UserType }) {
  if (!user.socials?.instagram && !user.socials?.discord && !user.socials?.phone) return null;
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="font-display font-bold text-slate-900 mb-4">Contact</h3>
      <div className="space-y-3">
        {user.socials?.instagram && (
          <a href={`https://instagram.com/${user.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 shrink-0"><Instagram size={16} /></div>
            <span className="text-sm">@{user.socials.instagram}</span>
          </a>
        )}
        {user.socials?.discord && (
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><MessageCircle size={16} /></div>
            <span className="text-sm">{user.socials.discord}</span>
          </div>
        )}
        {user.socials?.phone && (
          <a href={`tel:${user.socials.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><Phone size={16} /></div>
            <span className="text-sm">{user.socials.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function ProfileVehicleCard({ vehicle, loading, onEdit }: { vehicle: Vehicle | null; loading: boolean; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-slate-900">Vehicle</h3>
        <button onClick={onEdit} className="text-sm font-semibold text-uci-blue hover:text-blue-700 transition-colors">
          {vehicle ? 'Edit' : 'Add'}
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-4 text-slate-400"><Loader2 className="animate-spin" size={20} /></div>
      ) : vehicle ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-uci-blue shrink-0"><Car size={18} /></div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            <p className="text-xs text-slate-500">{vehicle.color}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No vehicle added yet.</p>
      )}
    </div>
  );
}

export function ProfileWaiverCard({ user }: { user: UserType }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="font-display font-bold text-slate-900 mb-4">Waiver</h3>
      {user.waiverSignedAt ? (
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"><ShieldCheck size={16} /></div>
          <span className="text-sm font-medium">Signed on {new Date(user.waiverSignedAt).toLocaleDateString()}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0"><AlertCircle size={16} /></div>
          <div>
            <p className="text-sm font-medium text-slate-700">Waiver not signed</p>
            <Link to="/waiver" className="text-xs font-semibold text-uci-blue hover:text-blue-700">Sign waiver</Link>
          </div>
        </div>
      )}
    </div>
  );
}
