import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Trash2, 
  CheckCircle,
  Moon,
  Sun,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, theme, toggleTheme, updateCurrentUserProfile, addToast, logout } = useApp();
  const navigate = useNavigate();

  // Profile management states
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [occupation, setOccupation] = useState(user?.occupation || 'Consultant');
  const [city, setCity] = useState(user?.city || 'Seattle');
  const [country, setCountry] = useState(user?.country || 'USA');

  // Security mock states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securitySaved, setSecuritySaved] = useState(false);

  // Notification toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(user?.weeklyDigestEnabled ?? false);

  // Profile save action
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await updateCurrentUserProfile({
      name,
      occupation,
      city,
      country
    });
  };

  // Notification toggles save action
  const handleSaveNotifications = async () => {
    await updateCurrentUserProfile({
      notificationsEnabled,
      weeklyDigestEnabled
    });
    addToast('Notification preferences synced!', 'success');
  };

  // Mock safety profile updates
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySaved(true);
    setOldPassword('');
    setNewPassword('');
    addToast('Security credentials updated successfully', 'success');
    setTimeout(() => setSecuritySaved(false), 4000);
  };

  // Clean Account Destruct Trigger
  const handleDeleteAccount = () => {
    const confirmation = window.confirm("🚨 CRITICAL WARNING: Deleting standard profile parameters is irreversible! Do you wish to continue and wipe out all logged activities?");
    if (confirmation) {
      localStorage.clear();
      logout();
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          App Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
          Refactor preferences, personal profiles, notifications, theme bindings, and account credentials.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column: Span 3 (Profile details & Password updates) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section 1: Profile management form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Personal Client Profile</span>
            </h3>
            <p className="text-xs text-gray-405 mt-1 border-b border-gray-500/10 pb-3">Update your demographical footprint constraints</p>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Occupation / Role</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">City Location</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5  py-2.5 text-xs font-bold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow-md shadow-emerald-500/5 cursor-pointer"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Mock Security forms */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>App Credential Security</span>
            </h3>
            <p className="text-xs text-gray-405 mt-1 border-b border-gray-500/10 pb-3">Change security passwords and variables</p>

            <form onSubmit={handleSaveSecurity} className="mt-4 space-y-4 font-sans">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs outline-hidden focus:border-emerald-500 dark:border-gray-800"
                  />
                </div>
              </div>

              {securitySaved && (
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-500/15 flex items-center justify-center gap-1.5 font-semibold">
                  <ShieldCheck className="h-4.5 w-4.5" /> Password credentials refactored perfectly!
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  Sync Password credentials
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column: Span 2 (Theme switches, Notifications control & Delete profile) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 3: Themes & Notifications drawer */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              <span>Theme & Alerts</span>
            </h3>
            <p className="text-xs text-gray-405 mt-1 border-b border-gray-500/10 pb-3">Customize visual rendering modes and digests</p>

            <div className="mt-4 space-y-5">
              {/* Theme Toggle option */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Theme Mode Preferred</h4>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">Toggle between dark and light modes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-20 items-center justify-between rounded-full bg-gray-50 border border-gray-200 p-1 dark:bg-gray-950 dark:border-gray-800"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${theme === 'light' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>
                    <Sun className="h-4 w-4" />
                  </span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${theme === 'dark' ? 'bg-emerald-600 text-white animate-pulse' : 'text-gray-400'}`}>
                    <Moon className="h-4 w-4" />
                  </span>
                </button>
              </div>

              {/* Weekly digest switcher */}
              <div className="flex items-center justify-between border-t border-gray-500/10 pt-4">
                <div className="flex gap-2.5 items-center">
                  <Bell className="h-5 w-5 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Weekly Email Digest</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Subscribe to environmental standings reports</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigestEnabled}
                  onChange={e => {
                    setWeeklyDigestEnabled(e.target.checked);
                    setTimeout(handleSaveNotifications, 200);
                  }}
                  className="h-4.5 w-4.5 text-emerald-600 focus:ring-emerald-500 rounded-sm border-gray-300 pointer-events-auto"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Caution delete zone */}
          <div className="rounded-2xl border border-red-200/40 bg-red-500/2 p-6 shadow-xs dark:border-red-900/10">
            <h3 className="font-display text-base font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500 shrink-0" />
              <span>Caution Zone Area</span>
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-sans leading-relaxed">
              Completely delete your CarbonWise SaaS configuration profiles and database indices. This is final.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="mt-4 w-full flex items-center justify-center gap-1 rounded-xl bg-red-650 py-2.5 text-xs font-bold text-white hover:bg-red-650/90 shadow-md shadow-red-500/5 cursor-pointer"
            >
              Destroy Profile & Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
