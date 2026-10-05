import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Shield, Truck, RefreshCw, Award, Gem } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal-950 text-white" aria-label="Site Footer">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-charcoal-900 bg-charcoal-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">Free Shipping</span>
              <span className="text-[11px] text-charcoal-400">Orders above ₹10,000</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">Secure Checkout</span>
              <span className="text-[11px] text-charcoal-400">Encrypted payment demo</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">2-Year Warranty</span>
              <span className="text-[11px] text-charcoal-400">Comprehensive coverage</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">Easy Returns</span>
              <span className="text-[11px] text-charcoal-400">30-day trial window</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
              <Gem className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">Authentic Products</span>
              <span className="text-[11px] text-charcoal-400">Certified precision quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="font-serif text-3xl tracking-[0.25em] text-white block font-bold">
              TITANOVA
            </Link>
            <p className="text-charcoal-400 text-sm leading-relaxed max-w-sm">
              TIME, REFINED. Masterfully designed timepieces celebrating Swiss-inspired tradition, modern architectural design, and enduring mechanical precision.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#instagram"
                className="w-9 h-9 border border-charcoal-800 flex items-center justify-center text-charcoal-400 hover:text-white hover:border-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-9 h-9 border border-charcoal-800 flex items-center justify-center text-charcoal-400 hover:text-white hover:border-gold-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 border border-charcoal-800 flex items-center justify-center text-charcoal-400 hover:text-white hover:border-gold-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 mb-5">
              Collections
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/collections/classic" className="text-charcoal-400 hover:text-white transition-colors">
                  Classic
                </Link>
              </li>
              <li>
                <Link to="/collections/urban" className="text-charcoal-400 hover:text-white transition-colors">
                  Urban
                </Link>
              </li>
              <li>
                <Link to="/collections/chronograph" className="text-charcoal-400 hover:text-white transition-colors">
                  Chronograph
                </Link>
              </li>
              <li>
                <Link to="/collections/automatic" className="text-charcoal-400 hover:text-white transition-colors">
                  Automatic
                </Link>
              </li>
              <li>
                <Link to="/collections/luxury" className="text-charcoal-400 hover:text-white transition-colors">
                  Luxury
                </Link>
              </li>
              <li>
                <Link to="/collections/smart" className="text-charcoal-400 hover:text-white transition-colors">
                  Smart Connected
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-charcoal-400 hover:text-white transition-colors">
                  About TITANOVA
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-charcoal-400 hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-charcoal-400 hover:text-white transition-colors">
                  FAQs & Shipping
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-charcoal-400 hover:text-white transition-colors">
                  Warranty & Servicing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-charcoal-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400 mb-5">
              The Newsletter
            </h3>
            <p className="text-xs text-charcoal-400 mb-4 leading-relaxed">
              Subscribe for private invitations to new release debuts and horological stories.
            </p>
            {subscribed ? (
              <p className="text-gold-400 text-xs py-2">Thank you for subscribing to TITANOVA.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-charcoal-900 border border-charcoal-800 px-3 py-2 text-xs text-white placeholder-charcoal-500 focus:outline-none focus:border-gold-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gold-500 text-white text-[11px] font-semibold tracking-widest uppercase hover:bg-gold-600 transition-colors"
                >
                  Join the Circle
                </button>
              </form>
            )}
            <div className="mt-6 space-y-2 text-xs text-charcoal-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Heritage Square, High District</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>+91 1800 200 8482</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>concierge@titanova.luxury</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="border-t border-charcoal-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>&copy; {new Date().getFullYear()} TITANOVA. All rights reserved. Fictional brand demo store.</p>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-charcoal-300 transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-charcoal-300 transition-colors">Terms of Service</Link>
            <Link to="/faq" className="hover:text-charcoal-300 transition-colors">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
