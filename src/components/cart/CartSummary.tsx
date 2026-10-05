import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { getSubtotal, getDiscount, getShipping, getTotal } = useCart();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <div className="bg-[#faf9f7] border border-charcoal-200/80 p-6 sm:p-8 space-y-6">
      <h3 className="font-serif text-xl text-charcoal-950 font-normal border-b border-charcoal-200/70 pb-4">
        Order Summary
      </h3>

      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex justify-between text-charcoal-600">
          <span>Subtotal</span>
          <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-gold-700">
            <span>Special Promotional Savings</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-charcoal-600">
          <div className="flex items-center gap-1.5">
            <span>Estimated Shipping</span>
            <Truck className="w-3.5 h-3.5 text-charcoal-400" />
          </div>
          <span className="font-medium text-charcoal-900">
            {shipping === 0 ? (
              <span className="text-emerald-700 font-semibold uppercase text-xs">Complimentary</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-[11px] text-charcoal-500 pt-1 italic">
            Add {formatPrice(10000 - subtotal)} more to qualify for complimentary insured delivery.
          </p>
        )}

        <div className="border-t border-charcoal-200/80 pt-4 flex justify-between items-baseline">
          <span className="font-serif text-base sm:text-lg font-medium text-charcoal-950">
            Total
          </span>
          <div className="text-right">
            <span className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950 block">
              {formatPrice(total)}
            </span>
            <span className="text-[10px] text-charcoal-400 font-normal">All Indian taxes included</span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <div className="space-y-3 pt-2">
          <Link
            to="/checkout"
            className="w-full py-4 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="w-full py-3 text-center border border-charcoal-300 text-charcoal-800 text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-100 transition-colors block"
          >
            Continue Browsing
          </Link>
        </div>
      )}

      {/* Assurance */}
      <div className="pt-4 border-t border-charcoal-200/60 flex items-center gap-2 text-[11px] text-charcoal-500">
        <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
        <span>Safe & Encrypted 256-Bit SSL Demo Checkout</span>
      </div>
    </div>
  );
}
