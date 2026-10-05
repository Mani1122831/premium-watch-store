import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections } from '../../data/collections';

const collectionImages: Record<string, string> = {
  classic: '/images/watches/men-1.jpg',
  urban: '/images/watches/men-5.jpg',
  chronograph: '/images/watches/men-2.jpg',
  automatic: '/images/watches/men-4.jpg',
  minimal: '/images/watches/men-3.jpg',
  luxury: '/images/watches/women-1.jpg',
  smart: '/images/watches/smart-1.jpg',
};

export default function Collections() {
  return (
    <section className="py-20 lg:py-28 bg-[#fbfaf8]" aria-labelledby="collections-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            SIGNATURE LINES
          </span>
          <h2 id="collections-heading" className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light mb-4">
            Curated Collections
          </h2>
          <p className="text-charcoal-500 text-sm sm:text-base font-light">
            Distinctive design languages shaped around personal style, athletic endurance, and horological heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.slice(0, 6).map(collection => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="group relative overflow-hidden bg-charcoal-950 text-white min-h-[320px] flex flex-col justify-end p-8 border border-charcoal-900 transition-all duration-500 hover:shadow-2xl rounded-sm"
              style={{ backgroundColor: collection.color }}
            >
              {/* Decorative radial overlay */}
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 80% 20%, ${collection.accentColor} 0%, transparent 60%)`,
                }}
              />

              {/* Watch Image Shadow & Thumbnail */}
              {collectionImages[collection.slug] && (
                <img
                  src={collectionImages[collection.slug]}
                  alt=""
                  className="absolute -right-6 -top-4 w-40 h-40 sm:w-48 sm:h-48 object-contain opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 pointer-events-none select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                  loading="lazy"
                />
              )}

              {/* Minimal watch ring outline */}
              <div
                className="absolute right-4 top-4 w-40 h-40 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                style={{ borderColor: `${collection.accentColor}33` }}
              />

              <div className="relative z-10 space-y-2">
                <span
                  className="text-[11px] font-semibold tracking-[0.25em] uppercase block"
                  style={{ color: collection.accentColor }}
                >
                  {collection.tagline}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-light" style={{ color: collection.textColor }}>
                  {collection.name}
                </h3>

                <p className="text-xs text-charcoal-300 line-clamp-2 font-light leading-relaxed">
                  {collection.description}
                </p>

                <div
                  className="inline-flex items-center gap-2 pt-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3"
                  style={{ color: collection.accentColor }}
                >
                  <span>Explore Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-10 py-4 border border-charcoal-950 text-charcoal-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-charcoal-950 hover:text-white transition-all"
          >
            Explore All 7 Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
