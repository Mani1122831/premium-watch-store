import { X, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/product';
import { categories } from '../../data/categories';
import { collections } from '../../data/collections';

interface ProductFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const genderOptions = [
  { label: "Men's", value: 'men' },
  { label: "Women's", value: 'women' },
  { label: 'Unisex', value: 'unisex' },
];

const ratingOptions = [
  { label: '4.8★ & above', value: 4.8 },
  { label: '4.5★ & above', value: 4.5 },
  { label: '4.0★ & above', value: 4.0 },
];

export default function ProductFilter({
  filters,
  onChange,
  onClear,
  isOpenMobile,
  onCloseMobile,
}: ProductFilterProps) {
  const handleCategoryToggle = (categoryName: string) => {
    const updated = filters.category.includes(categoryName)
      ? filters.category.filter(c => c !== categoryName)
      : [...filters.category, categoryName];
    onChange({ ...filters, category: updated });
  };

  const handleGenderToggle = (genderVal: string) => {
    const updated = filters.gender.includes(genderVal)
      ? filters.gender.filter(g => g !== genderVal)
      : [...filters.gender, genderVal];
    onChange({ ...filters, gender: updated });
  };

  const handleCollectionToggle = (colName: string) => {
    const updated = filters.collection.includes(colName)
      ? filters.collection.filter(c => c !== colName)
      : [...filters.collection, colName];
    onChange({ ...filters, collection: updated });
  };

  const handlePriceChange = (maxPrice: number) => {
    onChange({ ...filters, priceRange: [filters.priceRange[0], maxPrice] });
  };

  const handleRatingChange = (rating: number) => {
    onChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    });
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.gender.length > 0 ||
    filters.collection.length > 0 ||
    filters.rating > 0 ||
    filters.priceRange[1] < 100000;

  const content = (
    <div className="space-y-8 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-200">
        <h3 className="font-serif text-lg font-medium text-charcoal-950">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-950 font-medium tracking-wider uppercase transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Gender */}
      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900 mb-3">
          Gender
        </h4>
        <div className="space-y-2">
          {genderOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.gender.includes(opt.value)}
                onChange={() => handleGenderToggle(opt.value)}
                className="w-4 h-4 accent-charcoal-950 rounded cursor-pointer"
              />
              <span className="text-charcoal-700 group-hover:text-charcoal-950 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900 mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category.includes(cat.name.replace("'s Watches", ""))}
                onChange={() => handleCategoryToggle(cat.name.replace("'s Watches", ""))}
                className="w-4 h-4 accent-charcoal-950 rounded cursor-pointer"
              />
              <span className="text-charcoal-700 group-hover:text-charcoal-950 transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900">
            Max Price
          </h4>
          <span className="text-xs font-bold text-charcoal-900">
            ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="5000"
          value={filters.priceRange[1]}
          onChange={e => handlePriceChange(Number(e.target.value))}
          className="w-full accent-charcoal-950 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-charcoal-400 mt-1">
          <span>₹10,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Collection */}
      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900 mb-3">
          Collection
        </h4>
        <div className="space-y-2">
          {collections.map(col => (
            <label key={col.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.collection.includes(col.name)}
                onChange={() => handleCollectionToggle(col.name)}
                className="w-4 h-4 accent-charcoal-950 rounded cursor-pointer"
              />
              <span className="text-charcoal-700 group-hover:text-charcoal-950 transition-colors">
                {col.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900 mb-3">
          Customer Rating
        </h4>
        <div className="space-y-2">
          {ratingOptions.map(r => (
            <label key={r.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.rating === r.value}
                onChange={() => handleRatingChange(r.value)}
                className="w-4 h-4 accent-charcoal-950 rounded cursor-pointer"
              />
              <span className="text-charcoal-700 group-hover:text-charcoal-950 transition-colors">
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile Drawer
  if (isOpenMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black/50" onClick={onCloseMobile} />
        <div className="relative w-80 max-w-full bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-6">
              <span className="font-serif text-xl text-charcoal-950">Refine Results</span>
              <button onClick={onCloseMobile} className="p-2 text-charcoal-500 hover:text-charcoal-950">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
          <div className="pt-6 border-t border-charcoal-100">
            <button
              onClick={onCloseMobile}
              className="w-full py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return <aside className="hidden lg:block w-64 shrink-0">{content}</aside>;
}
