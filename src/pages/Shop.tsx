import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState, SortOption } from '../types/product';
import { productService } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

const DEFAULT_FILTERS: FilterState = {
  category: [],
  gender: [],
  priceRange: [0, 100000],
  rating: 0,
  collection: [],
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const querySearch = searchParams.get('q') || '';
  const queryGender = searchParams.get('gender') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryCollection = searchParams.get('collection') || '';

  useEffect(() => {
    document.title = 'Explore All Timepieces | TITANOVA';
    window.scrollTo(0, 0);

    const initial: FilterState = {
      ...DEFAULT_FILTERS,
      gender: queryGender ? [queryGender] : [],
      category: queryCategory ? [queryCategory] : [],
      collection: queryCollection ? [queryCollection] : [],
    };
    setFilters(initial);
  }, [queryGender, queryCategory, queryCollection]);

  const filteredProducts = useMemo(() => {
    return productService.filterAndSort(filters, sort, querySearch);
  }, [filters, sort, querySearch]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            CATALOGUE OF MASTERWORKS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            All Timepieces
          </h1>
          {querySearch && (
            <p className="text-sm text-charcoal-500 mt-2">
              Results matching: <strong className="text-charcoal-900">"{querySearch}"</strong>
            </p>
          )}
        </div>

        {/* Layout with Sidebar & Grid */}
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
              count={filteredProducts.length}
              onOpenMobileFilter={() => setMobileFilterOpen(true)}
            />

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No Matching Watches Found"
                description="Try loosening your filters, widening the price range, or searching for a different specification."
                action={
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
                  >
                    Reset All Filters
                  </button>
                }
              />
            ) : (
              <ProductGrid
                products={filteredProducts}
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
