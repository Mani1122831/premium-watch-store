import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import WishlistItem from '../components/wishlist/WishlistItem';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

export default function Wishlist() {
  const { items } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Saved Timepieces | TITANOVA Wishlist';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            YOUR CURATED WISHLIST
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            Saved Timepieces
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-light mt-2">
            Items saved to your personal registry are preserved across your sessions.
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-8 h-8 text-charcoal-300" />}
            title="Your Wishlist is Empty"
            description="Explore our collections to bookmark watches you wish to acquire or review later."
            action={
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
              >
                <span>Browse Timepieces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-charcoal-500 border-b border-charcoal-100 pb-3">
              <span>{items.length} saved item{items.length === 1 ? '' : 's'}</span>
              <Link to="/shop" className="hover:text-charcoal-950 uppercase font-semibold tracking-wider">
                Continue Browsing →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(product => (
                <WishlistItem
                  key={product.id}
                  product={product}
                  onToast={msg => setToastMessage(msg)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
