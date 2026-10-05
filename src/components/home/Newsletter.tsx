import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { validateEmail } from '../../utils/validators';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-charcoal-100" aria-labelledby="newsletter-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 bg-charcoal-50 border border-charcoal-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600">
          <Mail className="w-5 h-5" />
        </div>

        <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
          JOIN THE TITANOVA GUILD
        </span>
        <h2 id="newsletter-heading" className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-light mb-4">
          Receive Exclusive Invitations & Pre-Orders
        </h2>
        <p className="text-charcoal-500 text-sm max-w-lg mx-auto mb-8 font-light leading-relaxed">
          Be the first to secure limited-edition batch serials, private previews of novelties, and horological insights directly from our chief designer.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 p-4 bg-charcoal-50 border border-gold-500/30 text-charcoal-900 rounded-md">
            <CheckCircle className="w-5 h-5 text-gold-600" />
            <span className="text-sm font-medium">Thank you. You have been added to our private register.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950 text-charcoal-900 placeholder:text-charcoal-400 bg-white"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 transition-colors shrink-0 cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </div>
            {error && <p className="text-red-600 text-xs mt-2 text-left">{error}</p>}
            <p className="text-[11px] text-charcoal-400 mt-3">
              We respect your privacy. Unsubscribe anytime with a single click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
