import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Cart() {
  const { items, clearCart } = useCart();

  useEffect(() => {
    document.title = 'Shopping Bag | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            YOUR SELECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            Shopping Bag
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8 text-charcoal-300" />}
            title="Your Shopping Bag is Currently Empty"
            description="Discover watches designed for every moment and add your favorites to checkout."
            action={
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
              >
                <span>Discover Watches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 bg-white border border-charcoal-200/80 p-6 sm:p-8 rounded space-y-6">
              <div className="flex justify-between items-center border-b border-charcoal-100 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                  {items.length} Timepiece{items.length === 1 ? '' : 's'} Selected
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-charcoal-400 hover:text-red-600 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Empty Bag
                </button>
              </div>

              <div className="divide-y divide-charcoal-100">
                {items.map(item => (
                  <CartItem key={`${item.product.id}-${item.selectedColor}`} item={item} />
                ))}
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 sticky top-28">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
