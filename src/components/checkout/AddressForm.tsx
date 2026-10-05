interface AddressData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface AddressFormProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  errors: Partial<Record<keyof AddressData, string>>;
}

export default function AddressForm({ data, onChange, errors }: AddressFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl text-charcoal-950 font-normal border-b border-charcoal-200 pb-3">
        1. Contact & Shipping Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Recipient Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="e.g. Arjun Mehta"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Email for Order Updates *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="e.g. arjun@example.com"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Mobile Number (10 digits) *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            placeholder="e.g. 9876543210"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.phone ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            Pincode (6 digits) *
          </label>
          <input
            type="text"
            value={data.pincode}
            onChange={e => onChange('pincode', e.target.value)}
            placeholder="e.g. 400001"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.pincode ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
          Street Address / Apartment / Suite *
        </label>
        <input
          type="text"
          value={data.street}
          onChange={e => onChange('street', e.target.value)}
          placeholder="e.g. Penthouse 4B, Emerald Towers, Linking Road"
          className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
            errors.street ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
          }`}
        />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            City *
          </label>
          <input
            type="text"
            value={data.city}
            onChange={e => onChange('city', e.target.value)}
            placeholder="e.g. Mumbai"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.city ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
            State *
          </label>
          <input
            type="text"
            value={data.state}
            onChange={e => onChange('state', e.target.value)}
            placeholder="e.g. Maharashtra"
            className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none ${
              errors.state ? 'border-red-500' : 'border-charcoal-300 focus:border-charcoal-950'
            }`}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
        </div>
      </div>
    </div>
  );
}
