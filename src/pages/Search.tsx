import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import ProductGrid from '../components/products/ProductGrid';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(rawQuery);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { results, count } = useSearch(rawQuery);

  useEffect(() => {
    setSearchTerm(rawQuery);
    document.title = rawQuery ? `Search for "${rawQuery}" | TITANOVA` : 'Search Watches | TITANOVA';
    window.scrollTo(0, 0);
  }, [rawQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Search Input Banner */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div>
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
              HOROLOGICAL DIRECTORY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
              Search Timepieces
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by watch name, automatic, ceramic, gold..."
                className="w-full pl-11 pr-4 py-3.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {rawQuery && (
            <p className="text-xs text-charcoal-500">
              Found <strong className="text-charcoal-900">{count}</strong> timepiece{count === 1 ? '' : 's'} matching "{rawQuery}"
            </p>
          )}
        </div>

        {/* Results */}
        <div>
          {!rawQuery ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-charcoal-500 font-light">
                Popular suggestions: <strong>Chronograph</strong>, <strong>Automatic</strong>, <strong>Minimal</strong>, <strong>Rose Gold</strong>, <strong>Diver</strong>
              </p>
            </div>
          ) : count === 0 ? (
            <EmptyState
              icon={<SearchIcon className="w-8 h-8 text-charcoal-400" />}
              title={`No Results for "${rawQuery}"`}
              description="We couldn't find any watches matching your search terms. Check your spelling or browse our signature collections."
              action={
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
                >
                  <span>Explore All Watches</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          ) : (
            <ProductGrid products={results} onToast={msg => setToastMessage(msg)} />
          )}
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
