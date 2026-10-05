import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { validateEmail, validatePhone, validatePincode, validateRequired } from '../../utils/validators';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    name: user?.name || 'Arjun Mehta',
    email: user?.email || 'arjun@example.com',
    phone: user?.phone || '9876543210',
    street: 'Penthouse 4B, Emerald Heights, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('arjun@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8910 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('821');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFieldChange = (field: keyof typeof addressData, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!validateRequired(addressData.name)) errs.name = 'Please provide full name.';
    if (!validateEmail(addressData.email)) errs.email = 'Please provide a valid email.';
    if (!validatePhone(addressData.phone)) errs.phone = 'Please provide a valid 10-digit mobile number.';
    if (!validateRequired(addressData.street)) errs.street = 'Street address is required.';
    if (!validateRequired(addressData.city)) errs.city = 'City is required.';
    if (!validateRequired(addressData.state)) errs.state = 'State is required.';
    if (!validatePincode(addressData.pincode)) errs.pincode = 'Valid 6-digit pincode required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await paymentService.processPayment({
        items,
        subtotal: getSubtotal(),
        shipping: getShipping(),
        total: getTotal(),
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: {
          name: addressData.name,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          phone: addressData.phone,
        },
      });

      if (res.success && res.order) {
        clearCart();
        onSuccess(res.order.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <AddressForm
        data={addressData}
        onChange={handleFieldChange}
        errors={errors}
      />

      <PaymentForm
        method={paymentMethod}
        onMethodChange={setPaymentMethod}
        upiId={upiId}
        onUpiIdChange={setUpiId}
        cardNumber={cardNumber}
        onCardNumberChange={setCardNumber}
        cardExpiry={cardExpiry}
        onCardExpiryChange={setCardExpiry}
        cardCvv={cardCvv}
        onCardCvvChange={setCardCvv}
      />

      <div className="pt-4">
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 bg-charcoal-950 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-gold-500 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isProcessing ? 'AUTHORIZING ORDER...' : 'CONFIRM & PLACE ORDER'}
        </button>
      </div>
    </form>
  );
}
