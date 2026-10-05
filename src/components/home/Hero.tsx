import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-charcoal-950 text-white overflow-hidden">
      {/* Background radial gradients & subtle geometric lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-charcoal-900/40 blur-2xl" />
        {/* Subtle dial concentric circles */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-white/[0.04] hidden lg:block" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-gold-500/[0.08] hidden lg:block" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/[0.04] hidden lg:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-gold-500/30 bg-gold-500/10 rounded-full text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>TIME, REFINED</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] text-balance">
              Discover watches designed for <span className="font-normal italic text-gold-400">every moment</span>.
            </h1>

            <p className="text-charcoal-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Explore exquisite Swiss-inspired mechanics, surgical-grade stainless steel, and uncompromising craftsmanship engineered for those who value every second.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/men"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-charcoal-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white transition-all shadow-xl group cursor-pointer"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/women"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/40 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-charcoal-950 transition-all cursor-pointer"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs text-charcoal-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>2-Year Global Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Certified Swiss Calibre</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Column (Hero Watch SVG Graphic) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-84 md:w-96 aspect-[3/4] rounded-2xl bg-gradient-to-b from-charcoal-900 to-charcoal-950 p-6 border border-white/10 shadow-2xl flex flex-col items-center justify-between group hover:border-gold-500/40 transition-colors">
              <div className="w-full flex justify-between items-center text-[10px] tracking-[0.25em] text-gold-400 uppercase font-semibold">
                <span>TITANOVA ATELIER</span>
                <span>LIMITED RUN</span>
              </div>

              {/* Master Watch Realistic Luxury Photography Render with Subtle Float Animation & Golden Glow */}
              <div className="relative my-auto w-full flex items-center justify-center py-4">
                {/* Subtle Luxury Golden Glow Behind Watch */}
                <div className="absolute w-56 h-56 rounded-full bg-gold-500/15 blur-2xl pointer-events-none transition-all duration-700 group-hover:bg-gold-500/25 group-hover:scale-110" />
                <img
                  src="/images/watches/hero-watch.jpg"
                  alt="Titanova Meridian Classic Gold Luxury Wristwatch"
                  className="relative z-10 w-64 sm:w-72 md:w-80 max-h-[320px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-float-slow transition-transform duration-700 group-hover:scale-105 select-none"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/watches/fallback-watch.svg';
                  }}
                />
              </div>

              <div className="w-full text-center">
                <span className="text-white font-serif text-lg tracking-wide block">Meridian Classic Gold</span>
                <span className="text-xs text-gold-400 font-medium">Automatic Calibre • 42mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
