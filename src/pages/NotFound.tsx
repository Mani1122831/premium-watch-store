import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-20 sm:py-32 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-[#faf9f7] border border-charcoal-200 rounded-full flex items-center justify-center mx-auto text-gold-600">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-charcoal-400 font-semibold tracking-widest uppercase">
            ERROR 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-light">
            Lost to Time
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-light leading-relaxed">
            The page or timepiece reference you are attempting to view no longer exists or has shifted coordinates.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 border border-charcoal-300 text-charcoal-800 text-xs font-bold tracking-widest uppercase hover:bg-charcoal-100 transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
