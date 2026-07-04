import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { employeeApi } from '../api/endpoints';
import { Edit3, Phone, MapPin, Building2, Calendar, Save, X, Mail, CheckCircle2, User } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const loadProfile = async () => {
    const res = await employeeApi.getMe();
    setProfile(res.data.data);
    reset({
      phone: res.data.data.phone || '',
      address: res.data.data.address || '',
    });
  };

  useEffect(() => { loadProfile(); }, []);

  const onSubmit = async (data) => {
    setMessage('');
    try {
      await employeeApi.updateMe(data);
      setMessage('Profile updated successfully.');
      setEditing(false);
      loadProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-12 rounded-xl w-64" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  const fields = [
    { icon: Phone,     label: 'Phone',          value: profile.phone || '—' },
    { icon: MapPin,    label: 'Address',        value: profile.address || '—' },
    { icon: Building2, label: 'Department',     value: profile.departmentId?.name || '—' },
    { icon: Calendar,  label: 'Date of Joining',value: new Date(profile.dateOfJoining).toLocaleDateString() },
    { icon: Mail,      label: 'Email',          value: profile.email || profile.userId?.email || '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
      </div>

      {message && (
        <div className="px-4 py-3 bg-success-50 border border-success-200 text-success-700 text-sm rounded-xl animate-fade-in-down flex items-center gap-2">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===== Profile card ===== */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-pink-600 rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

            <div className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white shadow-xl border-2 border-white/40 animate-pulse-glow">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success-500 border-4 border-white flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-white/80 mt-1">{profile.designation || 'No designation set'}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                <User size={12} />
                {profile.userId?.role || 'EMPLOYEE'}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100 card-hover animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employee ID</p>
              <p className="mt-1 text-lg font-bold text-gray-800">{profile.employeeId}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100 card-hover animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</p>
              <p className="mt-1 text-lg font-bold text-gray-800">{new Date(profile.dateOfJoining).getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* ===== Details card ===== */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <h2 className="font-bold text-gray-800">Personal Details</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-primary text-xs">
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : null}
            </div>

            {!editing ? (
              <div className="divide-y divide-gray-50">
                {fields.map((field, idx) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-accent-50/30 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${300 + idx * 50}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                      <field.icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-primary-600" /> Phone
                  </label>
                  <input {...register('phone')} className="input-premium" />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-primary-600" /> Address
                  </label>
                  <input {...register('address')} className="input-premium" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary">
                    <Save size={16} /> Save Changes
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
