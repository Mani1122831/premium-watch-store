import { ShieldCheck, Truck, RefreshCw, Compass, Award } from 'lucide-react';

export default function TrustSection() {
  const values = [
    {
      icon: <Award className="w-8 h-8 text-gold-500" />,
      title: 'Swiss-Inspired Precision',
      desc: 'Engineered with hand-regulated calibres and surgical-grade 316L stainless steel.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-500" />,
      title: '2-Year Global Warranty',
      desc: 'Full coverage against manufacturing defects with international servicing support.',
    },
    {
      icon: <Truck className="w-8 h-8 text-gold-500" />,
      title: 'Complimentary Delivery',
      desc: 'Free fully-insured delivery across India on every order above ₹10,000.',
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-gold-500" />,
      title: '30-Day Evaluation',
      desc: 'Try your timepiece with complete peace of mind with our 30-day return policy.',
    },
    {
      icon: <Compass className="w-8 h-8 text-gold-500" />,
      title: 'Horological Concierge',
      desc: 'Personal assistance for strap customization, sizing advice, and gift packaging.',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-charcoal-950 text-white" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase block mb-2">
            THE TITANOVA COMMITMENT
          </span>
          <h2 id="trust-heading" className="font-serif text-3xl sm:text-4xl font-light">
            Why Discerning Watch Lovers Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-charcoal-900/50 border border-charcoal-800/80 hover:border-gold-500/40 transition-colors"
            >
              <div className="mb-4 p-3 bg-charcoal-950 rounded-full border border-charcoal-800">
                {v.icon}
              </div>
              <h3 className="font-serif text-lg font-normal mb-2 text-white">{v.title}</h3>
              <p className="text-xs text-charcoal-400 leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
