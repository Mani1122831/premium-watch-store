import { useState, useMemo, useEffect } from 'react';
import { FilterState, SortOption } from '../types/product';
import { productService } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

const DEFAULT_FILTERS: FilterState = {
  category: [],
  gender: ['men'],
  priceRange: [0, 100000],
  rating: 0,
  collection: [],
};

export default function MensWatches() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Men's Luxury Watches | TITANOVA";
    window.scrollTo(0, 0);
  }, []);

  const mensProducts = useMemo(() => {
    return productService.filterAndSort(filters, sort);
  }, [filters, sort]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-charcoal-950 text-white p-8 sm:p-14 text-center rounded-lg shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase block">
              GENTLEMEN'S CHRONOMETRY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light">
              Men's Watch Collection
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-300 font-light leading-relaxed">
              Engineered with substantial 40mm–44mm surgical-grade cases, automatic calibres, and uncompromising architectural symmetry.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-10">
          <ProductFilter
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          <div className="flex-1 min-w-0 space-y-6">
            <ProductSort
              value={sort}
              onChange={setSort}
              count={mensProducts.length}
              onOpenMobileFilter={() => setMobileFilterOpen(true)}
            />

            {mensProducts.length === 0 ? (
              <EmptyState
                title="No Men's Watches Match Your Filters"
                description="Reset your filters to explore our full selection of gentlemen's timepieces."
                action={
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <ProductGrid
                products={mensProducts}
                onToast={msg => setToastMessage(msg)}
                columns="three"
              />
            )}
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
