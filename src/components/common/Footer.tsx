import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { InstagramIcon } from './Icons';

export const Footer: React.FC = () => {
  const { brand } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#171614] text-[#F8F6F1] pt-16 pb-12 border-t border-[#B69A70]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top VIP Newsletter Section */}
        <div className="border-b border-[#F8F6F1]/10 pb-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A70] font-medium">
                The Private Circle
              </span>
              <h3 className="font-editorial text-2xl md:text-3xl font-normal text-[#F8F6F1]">
                Join the Private Salon of Abaya Attire
              </h3>
              <p className="text-xs md:text-sm text-[#E8DFD2]/70 max-w-md font-light leading-relaxed">
                Receive private invitations to limited haute couture drops, bespoke atelier trunk shows, and seasonal edits.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center space-x-2 text-[#B69A70] text-sm bg-[#B69A70]/10 border border-[#B69A70]/30 py-3 px-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Welcome to the Private Circle. An invitation has been dispatched.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your private email address"
                    className="flex-1 bg-transparent border border-[#F8F6F1]/20 px-4 py-3 text-xs text-[#F8F6F1] placeholder-[#F8F6F1]/40 focus:outline-hidden focus:border-[#B69A70] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#B69A70] hover:bg-[#A0835B] text-[#171614] text-xs uppercase tracking-widest px-6 py-3 font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#F8F6F1]/10">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-medium block">
              Haute Modesty
            </span>
            <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#F8F6F1]">
              {brand.brandName}
            </h2>
            <p className="text-xs text-[#E8DFD2]/70 leading-relaxed font-light max-w-sm">
              Handcrafting timeless modest silhouettes from authentic Dubai Nida, French bullion wire, and Japanese silk. Designed for the discerning woman who values discretion, dignity, and uncompromised grandeur.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-xs text-[#B69A70] hover:text-[#F8F6F1] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider">@abayaattireofficial</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Curated Silhouettes */}
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold block">
              Silhouettes
            </span>
            <ul className="space-y-2 text-xs text-[#E8DFD2]/70 font-light">
              {brand.categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="hover:text-[#B69A70] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold block">
              Client Care
            </span>
            <ul className="space-y-2 text-xs text-[#E8DFD2]/70 font-light">
              <li>
                <Link to="/contact" className="hover:text-[#B69A70] transition-colors">
                  Bespoke Sizing & Tailoring
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#B69A70] transition-colors">
                  Shipping & Insured Transit
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#B69A70] transition-colors">
                  Exchanges & Alterations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#B69A70] transition-colors">
                  Atelier Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#B69A70] transition-colors">
                  Contact & Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Admin */}
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold block">
              Legal & Atelier
            </span>
            <ul className="space-y-2 text-xs text-[#E8DFD2]/70 font-light">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#B69A70] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#B69A70] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center space-x-1.5 text-[11px] text-[#B69A70] hover:text-[#F8F6F1] transition-colors py-1 border border-[#B69A70]/30 px-2.5"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin CMS Access</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits with AlisTech signature */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#E8DFD2]/50 font-light space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} {brand.brandName}. All rights reserved.
          </div>

          <div className="flex items-center space-x-1 text-[#E8DFD2]/70">
            <span>Designed & Engineered by</span>
            <a
              href="https://alistech.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B69A70] hover:text-[#F8F6F1] font-medium transition-colors inline-flex items-center"
            >
              AlisTech
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
            <span className="text-[#B69A70]/40 mx-1">•</span>
            <span>Luxury E-Commerce Division</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Domestic & Global Express</span>
            <span className="text-[#B69A70]">•</span>
            <span>100% Certified Authentic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
