import { useEffect } from 'react';
import { Award, Compass, ShieldCheck, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    document.title = 'About The Brand | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.3em] uppercase block">
            THE ATELIER STORY
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-950 font-light">
            Crafting Heritage in Modern Time
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 font-light max-w-2xl mx-auto leading-relaxed">
            TITANOVA was conceived on a singular premise: that horological excellence should not simply commemorate the past, but enrich the moments of the present.
          </p>
        </div>

        {/* Philosophy Card */}
        <div className="bg-[#faf9f7] border border-charcoal-200/80 p-8 sm:p-12 rounded-lg space-y-6 text-charcoal-700 font-light leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
            Our Philosophy: Time, Refined
          </h2>
          <p>
            In a world inundated with ephemeral digital distractions, a fine mechanical wristwatch represents an anchor to tangible reality. Each component inside our calibres — from the balance wheel pulsating 28,800 vibrations per hour to the mirror-polished bevelling on our bridges — is a celebration of human ingenuity.
          </p>
          <p>
            We balance Swiss-inspired horological traditions with geometric restraint and modern materials: surgical 316L stainless steel, Grade 5 titanium, high-tech sintered ceramic, and scratch-proof sapphire crystal treated with multi-layer anti-reflective coatings.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-6 border border-charcoal-200 rounded space-y-3">
            <Award className="w-6 h-6 text-gold-600" />
            <h3 className="font-serif text-lg text-charcoal-950">In-House Quality Standards</h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              Every production batch undergoes 168 hours of continuous 5-position accuracy checks, shock absorption evaluations, and thermal tolerance tests.
            </p>
          </div>

          <div className="p-6 border border-charcoal-200 rounded space-y-3">
            <Gem className="w-6 h-6 text-gold-600" />
            <h3 className="font-serif text-lg text-charcoal-950">Pure Material Integrity</h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              We never cut corners with base metals or fragile mineral glass where sapphire belongs. Authenticity, durability, and skin biocompatibility remain paramount.
            </p>
          </div>

          <div className="p-6 border border-charcoal-200 rounded space-y-3">
            <Compass className="w-6 h-6 text-gold-600" />
            <h3 className="font-serif text-lg text-charcoal-950">Modern Architectural Design</h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              Clean dial typography, proportioned lugs, and bespoke hands calculated down to fractions of a millimeter to ensure legibility and ergonomic wrist comfort.
            </p>
          </div>

          <div className="p-6 border border-charcoal-200 rounded space-y-3">
            <ShieldCheck className="w-6 h-6 text-gold-600" />
            <h3 className="font-serif text-lg text-charcoal-950">Global 2-Year Warranty</h3>
            <p className="text-xs text-charcoal-600 font-light leading-relaxed">
              We stand unconditionally behind every serialized piece that leaves our workshop, with full warranty servicing and complimentary calibration.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-charcoal-100">
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 transition-colors"
          >
            Explore The Timepieces
          </Link>
        </div>
      </div>
    </div>
  );
}
