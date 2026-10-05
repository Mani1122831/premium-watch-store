import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { collections, Collection } from '../data/collections';
import { products, getProductsByCollection } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';

export default function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const activeCollection = slug ? collections.find((c: Collection) => c.slug.toLowerCase() === slug.toLowerCase()) : null;

  useEffect(() => {
    if (activeCollection) {
      document.title = `${activeCollection.name} Collection | TITANOVA`;
    } else {
      document.title = 'Signature Collections | TITANOVA';
    }
    window.scrollTo(0, 0);
  }, [activeCollection]);

  // If a specific collection slug is active, show its banner and filtered products
  if (activeCollection) {
    const colProducts = getProductsByCollection(activeCollection.name);

    return (
      <div className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-charcoal-400">
            <Link to="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/collections" className="hover:text-charcoal-900 transition-colors">Collections</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal-900 font-medium">{activeCollection.name}</span>
          </nav>

          {/* Large Hero Banner for this Collection */}
          <div
            className="relative overflow-hidden p-8 sm:p-14 text-white rounded-lg shadow-2xl flex flex-col justify-end min-h-[320px] sm:min-h-[380px]"
            style={{ backgroundColor: activeCollection.color }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 80% 20%, ${activeCollection.accentColor} 0%, transparent 60%)`,
              }}
            />
            {/* Outline ring */}
            <div
              className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10 hidden md:block pointer-events-none"
              style={{ borderColor: `${activeCollection.accentColor}40` }}
            />

            <div className="relative z-10 max-w-2xl space-y-3">
              <span
                className="text-xs font-semibold tracking-[0.25em] uppercase block"
                style={{ color: activeCollection.accentColor }}
              >
                {activeCollection.tagline}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-light" style={{ color: activeCollection.textColor }}>
                The {activeCollection.name} Series
              </h1>
              <p className="text-sm sm:text-base text-charcoal-300 font-light leading-relaxed">
                {activeCollection.description}
              </p>
            </div>
          </div>

          {/* Products in this collection */}
          <div>
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-4 mb-8">
              <h2 className="font-serif text-2xl text-charcoal-950 font-normal">
                {colProducts.length} Timepieces in this Series
              </h2>
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 hover:text-charcoal-950"
              >
                View Complete Catalogue →
              </Link>
            </div>

            <ProductGrid products={colProducts.length > 0 ? colProducts : products.slice(0, 4)} />
          </div>
        </div>
      </div>
    );
  }

  // All collections showcase
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            THE ARCHITECTURE OF TIME
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-950 font-light mb-4">
            Signature Collections
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 font-light leading-relaxed">
            Seven horological chapters. From the understated discipline of our Minimal series to the multi-complication mechanics of the Chronograph atelier.
          </p>
        </div>

        {/* Large Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col: Collection) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative overflow-hidden text-white min-h-[380px] p-8 flex flex-col justify-between border border-charcoal-900 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500"
              style={{ backgroundColor: col.color }}
            >
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 75% 25%, ${col.accentColor} 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex justify-between items-start">
                <span
                  className="text-xs font-semibold tracking-[0.25em] uppercase"
                  style={{ color: col.accentColor }}
                >
                  {col.tagline}
                </span>
                <span className="text-xs font-mono text-charcoal-400 opacity-60">
                  REF. {col.id.toUpperCase()}
                </span>
              </div>

              <div className="relative z-10 space-y-3">
                <h2 className="font-serif text-3xl sm:text-4xl font-light" style={{ color: col.textColor }}>
                  {col.name}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-300 font-light leading-relaxed line-clamp-3">
                  {col.description}
                </p>
                <div
                  className="inline-flex items-center gap-2 pt-2 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3"
                  style={{ color: col.accentColor }}
                >
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
