import { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { formatPrice } from '../../utils/formatCurrency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getItemCount, getSubtotal } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-charcoal-900" />
            <h2 className="font-serif text-xl text-charcoal-950">Your Cart</h2>
            <span className="text-xs text-charcoal-500 font-medium">({getItemCount()})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-400 hover:text-charcoal-950 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-charcoal-100">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-charcoal-50 rounded-full flex items-center justify-center mx-auto text-charcoal-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-charcoal-900">Your shopping bag is empty</h3>
              <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                Explore our collections of hand-finished chronographs and automatics.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-block px-6 py-2.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map(item => (
              <CartItem key={`${item.product.id}-${item.selectedColor}`} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-charcoal-100 bg-[#faf9f7] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold tracking-wider uppercase text-charcoal-600">Subtotal</span>
              <span className="font-serif text-xl font-bold text-charcoal-950">{formatPrice(getSubtotal())}</span>
            </div>
            <p className="text-[11px] text-charcoal-400 font-light">
              Taxes and insured shipping calculated at checkout.
            </p>
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 transition-colors flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full py-2.5 text-center border border-charcoal-300 text-charcoal-800 text-xs font-semibold tracking-wider uppercase hover:bg-charcoal-100 transition-colors block"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
