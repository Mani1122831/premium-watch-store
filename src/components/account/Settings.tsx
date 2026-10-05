import { useState } from 'react';
import { Bell, Shield, Lock, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [newReleases, setNewReleases] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passUpdated, setPassUpdated] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 6) {
      setPassUpdated(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPassUpdated(false), 3000);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-charcoal-200/80 space-y-8">
      <div className="border-b border-charcoal-100 pb-4">
        <h2 className="font-serif text-2xl text-charcoal-950 font-normal">Account Settings</h2>
        <p className="text-xs text-charcoal-500 font-light mt-1">
          Manage privacy, password, and horological communication preferences.
        </p>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-charcoal-950 font-medium flex items-center gap-2">
          <Bell className="w-4 h-4 text-gold-600" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3 max-w-md">
          <label className="flex items-center justify-between p-3 border border-charcoal-200 rounded cursor-pointer hover:bg-charcoal-50 transition-colors">
            <div>
              <span className="text-xs font-semibold text-charcoal-900 block">Order Status Alerts</span>
              <span className="text-[11px] text-charcoal-500">Real-time shipping and courier updates</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-charcoal-950"
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-charcoal-200 rounded cursor-pointer hover:bg-charcoal-50 transition-colors">
            <div>
              <span className="text-xs font-semibold text-charcoal-900 block">SMS Dispatch Updates</span>
              <span className="text-[11px] text-charcoal-500">Instant SMS upon courier departure</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-charcoal-950"
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-charcoal-200 rounded cursor-pointer hover:bg-charcoal-50 transition-colors">
            <div>
              <span className="text-xs font-semibold text-charcoal-900 block">Private VIP Novelties</span>
              <span className="text-[11px] text-charcoal-500">First-access notifications for new watch drops</span>
            </div>
            <input
              type="checkbox"
              checked={newReleases}
              onChange={e => setNewReleases(e.target.checked)}
              className="w-4 h-4 accent-charcoal-950"
            />
          </label>
        </div>
      </div>

      {/* Password Security */}
      <div className="border-t border-charcoal-100 pt-6 space-y-4">
        <h3 className="font-serif text-lg text-charcoal-950 font-medium flex items-center gap-2">
          <Lock className="w-4 h-4 text-gold-600" />
          <span>Security & Password</span>
        </h3>

        {passUpdated && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
              required
              minLength={6}
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-charcoal-100 pt-6 flex items-center gap-2 text-xs text-charcoal-400">
        <Shield className="w-4 h-4 text-charcoal-500" />
        <span>Client data is protected under TITANOVA’s strict privacy confidentiality protocol.</span>
      </div>
    </div>
  );
}
