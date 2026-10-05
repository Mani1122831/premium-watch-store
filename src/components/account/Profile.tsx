import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Phone, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Arjun Mehta');
  const [email] = useState(user?.email || 'demo@titanova.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-charcoal-200/80 space-y-6">
      <div className="border-b border-charcoal-100 pb-4">
        <h2 className="font-serif text-2xl text-charcoal-950 font-normal">Personal Profile</h2>
        <p className="text-xs text-charcoal-500 font-light mt-1">
          Manage your personal information and contact preferences.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile changes successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 text-sm bg-charcoal-50 text-charcoal-500 cursor-not-allowed"
            />
          </div>
          <span className="text-[11px] text-charcoal-400 mt-1 block">
            Primary authentication account address.
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
