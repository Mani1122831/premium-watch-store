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
  gender: ['women'],
  priceRange: [0, 100000],
  rating: 0,
  collection: [],
};

export default function WomensWatches() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Women's Luxury Watches | TITANOVA";
    window.scrollTo(0, 0);
  }, []);

  const womensProducts = useMemo(() => {
    return productService.filterAndSort(filters, sort);
  }, [filters, sort]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-[#1f1a1d] text-white p-8 sm:p-14 text-center rounded-lg shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[#e8b4b8] text-xs font-semibold tracking-[0.25em] uppercase block">
              POETRY IN PRECISION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light">
              Women's Watch Collection
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-300 font-light leading-relaxed">
              Delicate 28mm–36mm silhouettes featuring iridescent mother-of-pearl, diamond-set bezels, and fluid link bracelets.
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
              count={womensProducts.length}
              onOpenMobileFilter={() => setMobileFilterOpen(true)}
            />

            {womensProducts.length === 0 ? (
              <EmptyState
                title="No Women's Watches Match Your Filters"
                description="Reset your filters to explore our full selection of feminine timepieces."
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
                products={womensProducts}
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
