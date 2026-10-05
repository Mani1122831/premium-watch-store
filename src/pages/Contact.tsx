import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Concierge & Contact | TITANOVA';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block">
            PERSONAL HOROLOGICAL CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-light">
            Contact Concierge
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 font-light leading-relaxed">
            Whether you require sizing guidance, bespoke strap consultations, or order inquiries, our horological advisors are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#faf9f7] border border-charcoal-200/80 p-8 rounded-lg space-y-8">
            <h2 className="font-serif text-2xl text-charcoal-950 font-normal">
              Atelier Coordinates
            </h2>

            <div className="space-y-6 text-xs sm:text-sm text-charcoal-600 font-light">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-900 block font-medium">TITANOVA Experience Flagship</strong>
                  <p>Heritage Horology Quarter, Suite 400</p>
                  <p>Bandra West, Mumbai 400050, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-900 block font-medium">Telephone Enquiries</strong>
                  <p>+91 1800 200 8482 (Toll Free)</p>
                  <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-900 block font-medium">Electronic Mail</strong>
                  <p>concierge@titanova.luxury</p>
                  <p>orders@titanova.luxury</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-900 block font-medium">Bespoke Fitting Hours</strong>
                  <p>Private appointments available upon reservation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white border border-charcoal-200/80 p-8 rounded-lg space-y-6">
            <h2 className="font-serif text-2xl text-charcoal-950 font-normal">
              Send a Transmission
            </h2>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you. Your message has reached our concierge desk. We will respond within 4 business hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Arjun Mehta"
                    className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="arjun@domain.com"
                    className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Subject / Nature of Inquiry
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Sizing inquiry regarding Meridian Classic"
                  className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  placeholder="How may our horological concierge assist your search?"
                  className="w-full px-3.5 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
                />
              </div>

              <button
                type="submit"
                className="px-10 py-3.5 bg-charcoal-950 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-500 transition-colors cursor-pointer"
              >
                Transmit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
