import { CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

interface PaymentFormProps {
  method: 'upi' | 'card' | 'cod';
  onMethodChange: (m: 'upi' | 'card' | 'cod') => void;
  upiId: string;
  onUpiIdChange: (val: string) => void;
  cardNumber: string;
  onCardNumberChange: (val: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (val: string) => void;
  cardCvv: string;
  onCardCvvChange: (val: string) => void;
}

export default function PaymentForm({
  method,
  onMethodChange,
  upiId,
  onUpiIdChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvv,
  onCardCvvChange,
}: PaymentFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-charcoal-200 pb-3">
        <h3 className="font-serif text-xl text-charcoal-950 font-normal">
          2. Payment Method
        </h3>
        <span className="text-[11px] text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded font-medium">
          DEMO SIMULATION
        </span>
      </div>

      {/* Payment Options Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onMethodChange('upi')}
          className={`p-4 border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
            method === 'upi'
              ? 'border-charcoal-950 bg-charcoal-50 ring-1 ring-charcoal-950'
              : 'border-charcoal-200 hover:border-charcoal-400'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${method === 'upi' ? 'text-charcoal-950' : 'text-charcoal-400'}`} />
          <div>
            <span className="font-semibold text-xs text-charcoal-900 block">UPI Instant</span>
            <span className="text-[11px] text-charcoal-500">GPay, PhonePe, Paytm</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('card')}
          className={`p-4 border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
            method === 'card'
              ? 'border-charcoal-950 bg-charcoal-50 ring-1 ring-charcoal-950'
              : 'border-charcoal-200 hover:border-charcoal-400'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-charcoal-950' : 'text-charcoal-400'}`} />
          <div>
            <span className="font-semibold text-xs text-charcoal-900 block">Credit / Debit Card</span>
            <span className="text-[11px] text-charcoal-500">Visa, Mastercard, Amex</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('cod')}
          className={`p-4 border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
            method === 'cod'
              ? 'border-charcoal-950 bg-charcoal-50 ring-1 ring-charcoal-950'
              : 'border-charcoal-200 hover:border-charcoal-400'
          }`}
        >
          <Banknote className={`w-5 h-5 ${method === 'cod' ? 'text-charcoal-950' : 'text-charcoal-400'}`} />
          <div>
            <span className="font-semibold text-xs text-charcoal-900 block">Cash on Delivery</span>
            <span className="text-[11px] text-charcoal-500">Pay upon receipt</span>
          </div>
        </button>
      </div>

      {/* Dynamic method details */}
      <div className="bg-[#faf9f7] border border-charcoal-200/80 p-5 rounded">
        {method === 'upi' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block">
              Enter Virtual Payment Address (UPI ID)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={e => onUpiIdChange(e.target.value)}
              placeholder="e.g. yourname@okhdfcbank"
              className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 bg-white"
            />
            <p className="text-[11px] text-charcoal-500">
              A demo collect notification will be simulated. No real funds are transferred.
            </p>
          </div>
        )}

        {method === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => onCardNumberChange(e.target.value)}
                placeholder="4532 •••• •••• 8910"
                maxLength={19}
                className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 bg-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => onCardExpiryChange(e.target.value)}
                  placeholder="12/28"
                  maxLength={5}
                  className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={e => onCardCvvChange(e.target.value)}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {method === 'cod' && (
          <div className="space-y-2 text-xs text-charcoal-600">
            <p className="font-semibold text-charcoal-900">
              Cash / UPI on Delivery Available
            </p>
            <p>
              Please prepare exact cash or use the delivery courier’s handheld terminal to scan and pay via QR upon receiving your sealed TITANOVA timepiece.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-charcoal-500 pt-1">
        <ShieldCheck className="w-4 h-4 text-gold-600" />
        <span>Transactions are secured with 256-bit SSL testing protocol.</span>
      </div>
    </div>
  );
}
