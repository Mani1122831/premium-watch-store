import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getBestSellers } from '../../data/products';
import ProductGrid from '../products/ProductGrid';
import Toast from '../common/Toast';

export default function BestSellers() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const bestSellers = getBestSellers();

  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6]" aria-labelledby="bestsellers-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-charcoal-200/60 pb-6">
          <div>
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              TIME-TESTED FAVORITES
            </span>
            <h2 id="bestsellers-heading" className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-light">
              Most Celebrated Timepieces
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-charcoal-950 hover:text-gold-600 transition-colors group"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} onToast={msg => setToastMessage(msg)} />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </section>
  );
}
