import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { brand, showToast } = useStore();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Bespoke Tailoring',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your inquiry has reached the Atelier Concierge.');
  };

  const faqs = [
    {
      q: 'How do I choose the right abaya length for my height?',
      a: 'Abayas are sized by length in inches (50" to 60"). As a rule of thumb: 5\'1"–5\'3" wears Size 52; 5\'3"–5\'5" wears Size 54; 5\'5"–5\'7" wears Size 56; 5\'7"–5\'9" wears Size 58. If you wear 3-4 inch luxury heels, consider ordering one size longer.',
    },
    {
      q: 'Can I request custom hem alteration or bespoke sleeve lining?',
      a: 'Yes. Simply leave a note during checkout in the Atelier Instructions box or contact our WhatsApp concierge right after placing your order with your order reference number.',
    },
    {
      q: 'How long does insured international shipping take?',
      a: 'We dispatch all worldwide shipments via tracked DHL Express or BlueDart Air. Delivery to the GCC (UAE, Saudi Arabia, Qatar) takes 3–5 business days. Delivery to the UK, USA, and Europe takes 4–7 business days.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer a complimentary 7-day exchange window for standard unworn sizes with original security ribbons intact. Bespoke altered lengths are subject to individual atelier consultation.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.35em] uppercase text-[#B69A70] font-semibold block">
          Private Assistance
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171614]">
          Contact & Atelier Concierge
        </h1>
        <p className="text-xs sm:text-sm text-[#171614]/70 font-light leading-relaxed">
          Whether you require guidance on bespoke bridal couture, length tailoring, or expedited international transit, our stylists are at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info & WhatsApp Concierge */}
        <div className="lg:col-span-5 space-y-8 bg-white p-8 border border-[#171614]/10 shadow-xs">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-2">
              Instant Stylist Connection
            </span>
            <h3 className="font-editorial text-2xl text-[#171614]">
              VIP WhatsApp Desk
            </h3>
            <p className="text-xs text-[#171614]/70 font-light leading-relaxed mt-1">
              Direct access to our senior tailoring consultants for real-time video consults and fabric swatch previews.
            </p>
            <div className="mt-4">
              <a
                href={brand.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors w-full justify-center"
              >
                <MessageSquare className="w-4 h-4 text-[#B69A70]" />
                <span>Chat via WhatsApp ({brand.contact.phone})</span>
              </a>
            </div>
          </div>

          <div className="border-t border-[#171614]/10 pt-6 space-y-5 text-xs text-[#171614]/80">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#171614] block">Email Inquiries</span>
                <span>{brand.contact.email}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#171614] block">Telephone Concierge</span>
                <span>{brand.contact.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#171614] block">Atelier Location</span>
                <span>{brand.contact.address}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#171614] block">Salon Hours</span>
                <span>{brand.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-[#171614]/10 shadow-xs">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-2">
            Written Inquiry
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#171614] mb-6">
            Dispatch a Note to the Salon
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-3 bg-[#E8DFD2]/20 border border-[#B69A70]/30 p-6">
              <CheckCircle2 className="w-10 h-10 text-[#B69A70] mx-auto" />
              <h3 className="font-editorial text-2xl text-[#171614]">Note Received</h3>
              <p className="text-xs text-[#171614]/70 max-w-sm mx-auto">
                An atelier stylist has been notified and will reply via email or WhatsApp within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs uppercase tracking-wider text-[#B69A70] underline font-medium"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Ayesha Siddiqui"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-3 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="ayesha@example.com"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-3 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+91 98450 77123"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-3 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={formState.inquiryType}
                    onChange={(e) => setFormState({ ...formState, inquiryType: e.target.value })}
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-3 focus:outline-hidden focus:border-[#B69A70]"
                  >
                    <option value="Bespoke Tailoring">Bespoke Tailoring & Custom Lengths</option>
                    <option value="Bridal & Festive Edit">Bridal & Festive Trousseau Order</option>
                    <option value="Existing Order Tracking">Existing Order Status Assistance</option>
                    <option value="Fabric & Sizing Advice">Textile Specification & Fit Advice</option>
                    <option value="Corporate / Wholesale">Corporate & VIP Bulk Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#171614] font-medium mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Share details regarding height, event date, specific fabric preferences, or questions..."
                  className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-3 focus:outline-hidden focus:border-[#B69A70]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Dispatch Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-12 border-t border-[#171614]/10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block mb-1">
            Common Inquiries
          </span>
          <h2 className="font-editorial text-3xl text-[#171614]">
            Frequently Addressed Questions
          </h2>
        </div>

        <div className="divide-y divide-[#171614]/10 border border-[#171614]/10 bg-white">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-editorial text-lg text-[#171614] hover:text-[#B69A70] transition-colors"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#B69A70] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#171614]/40 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <p className="mt-3 text-xs text-[#171614]/70 font-light leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
