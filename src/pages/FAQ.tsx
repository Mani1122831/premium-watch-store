import { useState, useEffect } from 'react';
import { ChevronDown, ShieldCheck, Truck, RefreshCw, Award, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: { category: string; icon: JSX.Element; items: FAQItem[] }[] = [
  {
    category: 'Shipping & Delivery',
    icon: <Truck className="w-5 h-5 text-gold-600" />,
    items: [
      {
        q: 'What are the delivery timelines and coverage in India?',
        a: 'We provide complimentary, fully-insured delivery across all serviceable Indian pincodes on orders above ₹10,000. Typical transit time is 3 to 5 business days via tracked armored courier services.',
      },
      {
        q: 'Is signature confirmation or OTP verification required?',
        a: 'Yes. Due to the high value and serialized nature of TITANOVA timepieces, delivery couriers will require an SMS one-time password (OTP) verification at the doorstep before handing over the sealed package.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We ship to select destinations globally. For international orders, customs clearance documentation and global insured tracking will be provided.',
      },
    ],
  },
  {
    category: 'Warranty & Servicing',
    icon: <ShieldCheck className="w-5 h-5 text-gold-600" />,
    items: [
      {
        q: 'What is covered under the 2-Year International Warranty?',
        a: 'Our 2-year warranty covers all internal manufacturing defects, hands and dial detachment, movement rate deviation beyond factory tolerances, and water-resistance seals.',
      },
      {
        q: 'How do I register or claim warranty service?',
        a: 'Every watch includes an individualized serialized warranty card. You can reach out to our concierge at concierge@titanova.luxury to schedule insured courier pickup for servicing.',
      },
    ],
  },
  {
    category: 'Returns & 30-Day Evaluation',
    icon: <RefreshCw className="w-5 h-5 text-gold-600" />,
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day trial and evaluation window. If you are not completely satisfied, you may return the timepiece in its original, unworn condition with all protective films, tags, and packaging intact.',
      },
      {
        q: 'How quickly are refunds credited?',
        a: 'Once our watchmakers inspect the returned piece and verify original serial numbers, refunds are initiated back to the original payment source within 3-5 business days.',
      },
    ],
  },
  {
    category: 'Authenticity & Craftsmanship',
    icon: <Gem className="w-5 h-5 text-gold-600" />,
    items: [
      {
        q: 'Are TITANOVA watches 100% authentic?',
        a: 'Yes. TITANOVA is an original luxury horological line. Every timepiece is individually serialized with laser-engraved casebacks and backed by verifiable digital certificates.',
      },
      {
        q: 'What materials are utilized in case construction?',
        a: 'We use exclusively surgical-grade 316L stainless steel, Grade 5 titanium, sintered ceramic, and genuine anti-reflective sapphire crystal glass.',
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  useEffect(() => {
    document.title = 'Frequently Asked Questions & Policies | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block">
            PATRON ASSISTANCE & POLICIES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-light max-w-lg mx-auto">
            Everything you need to know regarding shipping, returns, warranty coverage, and horological maintenance.
          </p>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
            <Truck className="w-5 h-5 text-gold-600 mx-auto mb-2" />
            <h4 className="text-xs font-semibold uppercase text-charcoal-900">Free Insured Shipping</h4>
            <p className="text-[11px] text-charcoal-500 mt-1">Orders above ₹10,000</p>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
            <Award className="w-5 h-5 text-gold-600 mx-auto mb-2" />
            <h4 className="text-xs font-semibold uppercase text-charcoal-900">2-Year Warranty</h4>
            <p className="text-[11px] text-charcoal-500 mt-1">Worldwide coverage</p>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
            <RefreshCw className="w-5 h-5 text-gold-600 mx-auto mb-2" />
            <h4 className="text-xs font-semibold uppercase text-charcoal-900">30-Day Returns</h4>
            <p className="text-[11px] text-charcoal-500 mt-1">Hassle-free evaluation</p>
          </div>
          <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
            <Gem className="w-5 h-5 text-gold-600 mx-auto mb-2" />
            <h4 className="text-xs font-semibold uppercase text-charcoal-900">100% Genuine</h4>
            <p className="text-[11px] text-charcoal-500 mt-1">Certified timepieces</p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {faqs.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-charcoal-200 pb-3">
                {cat.icon}
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal-950 font-normal">
                  {cat.category}
                </h2>
              </div>

              <div className="divide-y divide-charcoal-100 border border-charcoal-200/80 rounded bg-white">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === key;

                  return (
                    <div key={item.q} className="p-5">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="font-medium text-sm sm:text-base text-charcoal-900">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-charcoal-500 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-charcoal-950' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <p className="mt-3 text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light animate-slide-up">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="p-8 bg-[#faf9f7] border border-charcoal-200 rounded text-center space-y-3">
          <h3 className="font-serif text-xl text-charcoal-950">Have a Particular Question?</h3>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto">
            Our horological specialists will gladly assist with technical specs or custom queries.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
          >
            Speak with Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
