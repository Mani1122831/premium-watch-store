import { useState } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { Address } from '../../types/user';

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
    name: 'Arjun Mehta',
    street: 'Penthouse 4B, Emerald Heights, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '9876543210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Corporate Office',
    name: 'Arjun Mehta',
    street: 'Level 18, One International Centre, Senapati Bapat Marg',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    phone: '9876543210',
    isDefault: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !street || !city || !pincode) return;

    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      label: label.trim() || 'Other Residence',
      name: name.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim() || 'State',
      pincode: pincode.trim(),
      phone: phone.trim() || '9876543210',
      isDefault: false,
    };

    setAddresses([...addresses, newAddr]);
    setShowAddForm(false);
    setLabel('');
    setName('');
    setStreet('');
    setCity('');
    setState('');
    setPincode('');
    setPhone('');
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-charcoal-200/80 space-y-6">
      <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-950 font-normal">Saved Addresses</h2>
          <p className="text-xs text-charcoal-500 font-light mt-1">
            Manage your residential and business delivery destinations.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 border border-charcoal-950 text-charcoal-950 text-xs font-bold tracking-widest uppercase hover:bg-charcoal-950 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add New'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#faf9f7] p-5 border border-charcoal-200 space-y-4 animate-slide-up">
          <h4 className="font-serif text-base text-charcoal-950 font-medium">Add Delivery Address</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">Label</label>
              <input
                type="text"
                placeholder="e.g. Summer Villa"
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full recipient name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">Street Address</label>
            <input
              type="text"
              placeholder="Building, street, apartment"
              value={street}
              onChange={e => setStreet(e.target.value)}
              required
              className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">State</label>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={e => setState(e.target.value)}
                required
                className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-charcoal-700 block mb-1">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                required
                className="w-full px-3 py-2 border border-charcoal-300 text-xs bg-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`p-5 border rounded space-y-3 relative ${
              addr.isDefault
                ? 'border-charcoal-950 bg-charcoal-50/50 ring-1 ring-charcoal-950'
                : 'border-charcoal-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-charcoal-900 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="text-[10px] font-bold tracking-widest uppercase bg-charcoal-950 text-white px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>

            <div className="text-xs text-charcoal-600 space-y-1 font-light leading-relaxed">
              <p className="font-medium text-charcoal-900">{addr.name}</p>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p>Contact: {addr.phone}</p>
            </div>

            {!addr.isDefault && (
              <div className="pt-2">
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] font-semibold text-charcoal-700 hover:text-charcoal-950 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Set as Default</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
