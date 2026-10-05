import { useState, useEffect } from 'react';
import { getBestSellers } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';
import Toast from '../components/common/Toast';

export default function BestSellersPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const products = getBestSellers();

  useEffect(() => {
    document.title = 'Best Selling Luxury Watches | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block">
            TIMELESS ICONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            Our Most Acclaimed Timepieces
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-light leading-relaxed">
            The watches chosen most frequently by our discerning patrons across the world.
          </p>
        </div>

        <ProductGrid products={products} onToast={msg => setToastMessage(msg)} />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
