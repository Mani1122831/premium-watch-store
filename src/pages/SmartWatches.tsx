import { useState, useMemo, useEffect } from 'react';
import { FilterState, SortOption } from '../types/product';
import { productService } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import ProductSort from '../components/products/ProductSort';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import { Cpu, HeartPulse, BatteryCharging, Wifi } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  category: ['Smart Watches'],
  gender: [],
  priceRange: [0, 100000],
  rating: 0,
  collection: [],
};

export default function SmartWatches() {
  const [filters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('featured');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Luxury Smart Connected Watches | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  const smartProducts = useMemo(() => {
    return productService.filterAndSort(filters, sort);
  }, [filters, sort]);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-[#0b1320] text-white p-8 sm:p-14 text-center rounded-lg shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[#4fc3f7] text-xs font-semibold tracking-[0.25em] uppercase block">
              HERITAGE MEETS CONNECTED INTELLIGENCE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light">
              Connected Timepieces
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-300 font-light leading-relaxed">
              Vibrant AMOLED touchscreens, biometric sensor arrays, and 5-day continuous battery performance, encased within titanium and aerospace aluminum.
            </p>
          </div>
        </div>

        {/* Feature Icons Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-center">
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded flex flex-col items-center gap-2">
            <Cpu className="w-5 h-5 text-gold-600" />
            <span className="text-xs font-semibold text-charcoal-900">Always-On AMOLED</span>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded flex flex-col items-center gap-2">
            <HeartPulse className="w-5 h-5 text-gold-600" />
            <span className="text-xs font-semibold text-charcoal-900">Biometric Health Suite</span>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded flex flex-col items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-gold-600" />
            <span className="text-xs font-semibold text-charcoal-900">5-7 Day Battery</span>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded flex flex-col items-center gap-2">
            <Wifi className="w-5 h-5 text-gold-600" />
            <span className="text-xs font-semibold text-charcoal-900">iOS & Android Sync</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <ProductSort
            value={sort}
            onChange={setSort}
            count={smartProducts.length}
          />

          {smartProducts.length === 0 ? (
            <EmptyState
              title="No Smart Watches Available"
              description="New batch arriving soon from our precision electronics lab."
            />
          ) : (
            <ProductGrid
              products={smartProducts}
              onToast={msg => setToastMessage(msg)}
            />
          )}
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
