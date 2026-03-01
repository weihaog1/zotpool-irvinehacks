import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import { TierBadge, VehicleDetailsForm } from '../components/ui';
import type { VehicleFormData } from '../components/ui';
import { ProfileEditModal, ProfileAboutCard, ProfileContactCard, ProfileVehicleCard, ProfileWaiverCard } from '../components/profile';
import { fetchUserVehicle, upsertVehicle } from '../services/vehicles';
import { User, Edit2, Calendar, Clock, Trash2, Loader2 } from 'lucide-react';
import type { Vehicle } from '../types';

const emptyVehicleForm: VehicleFormData = { make: '', model: '', year: '', color: '', licensePlate: '' };

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { rides, deleteRide } = useRides();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<VehicleFormData>(emptyVehicleForm);
  const [vehicleSaving, setVehicleSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setVehicleLoading(true);
    fetchUserVehicle(user.id)
      .then(setVehicle)
      .catch(() => setVehicle(null))
      .finally(() => setVehicleLoading(false));
  }, [user?.id]);

  if (!user) return null;

  const myRides = rides.filter(r => r.userId === user.id);

  const handleSaveProfile = async (formData: {
    name: string; city: string; major: string; year: string;
    pronouns: string; gender: string; instagram: string;
    discord: string; phone: string; avatar: string;
  }) => {
    await updateUser({
      name: formData.name.trim() || user.name,
      city: formData.city.trim(),
      major: formData.major.trim(),
      year: formData.year.trim(),
      pronouns: formData.pronouns.trim(),
      gender: formData.gender.trim(),
      avatar: formData.avatar.trim(),
      socials: {
        instagram: formData.instagram.trim(),
        discord: formData.discord.trim(),
        phone: formData.phone.trim(),
      },
    });
    setIsEditing(false);
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!window.confirm('Delete this listing? This action cannot be undone.')) return;
    try { await deleteRide(rideId); } catch { /* silent */ }
  };

  const openVehicleEditor = () => {
    setVehicleForm(vehicle ? {
      make: vehicle.make, model: vehicle.model,
      year: String(vehicle.year), color: vehicle.color,
      licensePlate: vehicle.licensePlate,
    } : emptyVehicleForm);
    setShowVehicleForm(true);
  };

  const handleSaveVehicle = async () => {
    setVehicleSaving(true);
    try {
      const saved = await upsertVehicle({
        userId: user.id,
        make: vehicleForm.make.trim(),
        model: vehicleForm.model.trim(),
        year: parseInt(vehicleForm.year, 10) || new Date().getFullYear(),
        color: vehicleForm.color.trim(),
        licensePlate: vehicleForm.licensePlate.trim(),
        isDefault: true,
      });
      setVehicle(saved);
      setShowVehicleForm(false);
    } catch { /* silent */ }
    setVehicleSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="relative mb-24">
         <div className="h-48 rounded-[2rem] bg-gradient-to-r from-uci-blue via-blue-600 to-indigo-600 relative overflow-hidden shadow-lg">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute -bottom-24 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
         </div>

         <div className="absolute top-24 left-0 w-full px-8">
             <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-end md:items-center gap-6 shadow-xl">
                 <div className="relative -mt-16 md:-mt-20 shrink-0">
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">
                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden relative">
                             {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                <User size={64} />
                             )}
                        </div>
                     </div>
                     <button
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-2 right-2 bg-slate-900 text-white p-2.5 rounded-full hover:bg-uci-blue transition-colors shadow-lg"
                        title="Edit profile"
                     >
                         <Edit2 size={16} />
                     </button>
                 </div>

                 <div className="flex-grow text-center md:text-left pb-2">
                     <div className="flex items-center justify-center md:justify-start gap-3">
                       <h1 className="font-display text-3xl font-bold text-slate-900">{user.name}</h1>
                       {user.authTier && <TierBadge tier={user.authTier} size="sm" />}
                     </div>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-slate-500 font-medium">
                         <span>{user.major || 'UCI Student'}</span>
                         <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                         <span>{user.year || '--'}</span>
                     </div>
                 </div>

                 <div className="flex gap-3 w-full md:w-auto">
                     <div className="flex-1 md:flex-none text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Role</div>
                         <div className="font-bold text-uci-blue capitalize">{user.role || 'Not set'}</div>
                     </div>
                     <div className="flex-1 md:flex-none text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Status</div>
                         <div className="font-bold text-green-600 flex items-center justify-center gap-1">
                             <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
                         </div>
                     </div>
                     <button
                       onClick={() => setIsEditing(true)}
                       className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-uci-blue transition-colors"
                     >
                       Edit Profile
                     </button>
                 </div>
             </div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-32 md:mt-24">
          <div className="space-y-6">
              <ProfileAboutCard user={user} />
              <ProfileContactCard user={user} />
              <ProfileVehicleCard vehicle={vehicle} loading={vehicleLoading} onEdit={openVehicleEditor} />
              <ProfileWaiverCard user={user} />
          </div>

          <div className="md:col-span-2 space-y-8">
              <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-6">Active Listings</h2>
                  <div className="space-y-4">
                    {myRides.length > 0 ? (
                        myRides.map(ride => (
                            <div key={ride.id} className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${ride.type === 'driver' ? 'bg-blue-100 text-uci-blue' : 'bg-green-100 text-green-700'}`}>
                                            {ride.type}
                                        </span>
                                        <span className="text-slate-400 text-xs font-medium">-- {new Date(ride.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">Trip from {ride.origin} to {ride.destination}</h3>
                                    <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {ride.schedule.days.length ? ride.schedule.days.join(', ') : 'Flexible'}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {ride.schedule.timeStart}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Link to={`/create?postId=${ride.id}`} className="p-2 text-slate-400 hover:text-uci-blue hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteRide(ride.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 border-dashed text-slate-500">
                            <p className="font-medium">No active listings</p>
                            <p className="text-sm mt-1">Ready to start commuting?</p>
                            <Link to="/create" className="inline-flex mt-4 px-5 py-2.5 rounded-full bg-uci-blue text-white font-bold text-sm hover:bg-blue-700 transition-colors">Create a listing</Link>
                        </div>
                    )}
                  </div>
              </div>
          </div>
      </div>

      {isEditing && (
        <ProfileEditModal
          initialData={{
            name: user.name || '', city: user.city || '', major: user.major || '',
            year: user.year || '', pronouns: user.pronouns || '', gender: user.gender || '',
            instagram: user.socials?.instagram || '', discord: user.socials?.discord || '',
            phone: user.socials?.phone || '', avatar: user.avatar || '',
          }}
          onSave={handleSaveProfile}
          onClose={() => setIsEditing(false)}
        />
      )}

      {showVehicleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowVehicleForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8" role="dialog" aria-modal="true">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-4">
              {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
            </h3>
            <VehicleDetailsForm value={vehicleForm} onChange={setVehicleForm} compact />
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowVehicleForm(false)} className="px-5 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              <button
                onClick={handleSaveVehicle}
                disabled={vehicleSaving}
                className="px-5 py-2.5 rounded-full bg-uci-blue text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {vehicleSaving ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : 'Save Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
