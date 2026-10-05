import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items } = useCart();
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Checkout | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  // Successful Order Confirmation View
  if (completedOrderId) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8 animate-slide-up">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block">
              ORDER CONFIRMED & DISPATCH PREPARED
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
              Thank You for Your Patronage
            </h1>
            <p className="text-sm text-charcoal-600 font-light max-w-lg mx-auto leading-relaxed">
              Your order reference <strong className="font-mono text-charcoal-950">#{completedOrderId}</strong> has been confirmed. A formal horological acquisition invoice has been transmitted to your email.
            </p>
          </div>

          <div className="bg-[#faf9f7] border border-charcoal-200 p-6 rounded-lg text-left space-y-4 max-w-lg mx-auto text-xs">
            <div className="flex items-center gap-2 font-semibold text-charcoal-900 uppercase tracking-wider">
              <PackageCheck className="w-4 h-4 text-gold-600" />
              <span>Next Steps:</span>
            </div>
            <ul className="space-y-2 text-charcoal-600 list-disc pl-5">
              <li>Our master watchmaker conducts final 24-hour rate calibration check.</li>
              <li>Your timepiece is placed into its serialized presentation vault with warranty card.</li>
              <li>SMS updates with live armored courier tracking link will be dispatched shortly.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/account/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
            >
              View in My Orders
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 border border-charcoal-300 text-charcoal-800 text-xs font-bold tracking-widest uppercase hover:bg-charcoal-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Checkout View
  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="border-b border-charcoal-100 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
              SECURE CHECKOUT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-light">
              Finalize Your Acquisition
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Demo Secured</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="text-sm text-charcoal-500">No timepieces are currently in your bag to checkout.</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
            >
              Return to Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 bg-white border border-charcoal-200/80 p-6 sm:p-8 rounded">
              <CheckoutForm onSuccess={orderId => setCompletedOrderId(orderId)} />
            </div>

            <div className="lg:col-span-5 sticky top-28">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
