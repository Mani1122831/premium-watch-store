import { SortOption } from '../../types/product';
import { SlidersHorizontal } from 'lucide-react';

interface ProductSortProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  count: number;
  onOpenMobileFilter?: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured Selection' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-rated', label: 'Highest Rated' },
];

export default function ProductSort({
  value,
  onChange,
  count,
  onOpenMobileFilter,
}: ProductSortProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-charcoal-100">
      {/* Result Count & Mobile Filter Trigger */}
      <div className="flex items-center gap-4">
        {onOpenMobileFilter && (
          <button
            onClick={onOpenMobileFilter}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-charcoal-200 text-xs font-semibold tracking-wider uppercase text-charcoal-800 hover:border-charcoal-950 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        )}
        <p className="text-xs sm:text-sm text-charcoal-500 font-light">
          Showing <span className="font-semibold text-charcoal-900">{count}</span> timepieces
        </p>
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 sm:gap-3">
        <label htmlFor="sort-dropdown" className="text-xs font-semibold tracking-[0.1em] uppercase text-charcoal-500 hidden sm:inline">
          Sort by:
        </label>
        <select
          id="sort-dropdown"
          value={value}
          onChange={e => onChange(e.target.value as SortOption)}
          className="border border-charcoal-200 bg-white text-charcoal-900 text-xs font-medium py-2 px-3 focus:outline-none focus:border-charcoal-950 cursor-pointer"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
