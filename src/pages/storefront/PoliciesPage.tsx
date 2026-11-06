import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Shield, Truck, RotateCcw, FileText, Lock } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const location = useLocation();
  const { brand } = useStore();

  const currentPath = location.pathname;

  const tabs = [
    { name: 'Shipping & Insured Transit', path: '/shipping-policy', icon: Truck },
    { name: 'Exchanges & Alterations', path: '/returns', icon: RotateCcw },
    { name: 'Privacy & Data Ethics', path: '/privacy-policy', icon: Lock },
    { name: 'Terms of Service', path: '/terms', icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">
      <Breadcrumbs items={[{ label: 'Legal & Policies' }]} />

      {/* Policy Navigation Tabs */}
      <div className="flex flex-wrap border-b border-[#171614]/10 gap-2 sm:gap-6">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center space-x-2 py-3 border-b-2 text-xs uppercase tracking-wider font-medium transition-colors ${
                isActive
                  ? 'border-[#B69A70] text-[#171614]'
                  : 'border-transparent text-[#171614]/50 hover:text-[#171614]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#B69A70]" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Demo Notice */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2 font-light">
        <Shield className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Atelier Notice:</strong> The following policy documentation represents realistic operational protocols for demo purposes. Final client-approved commercial terms will be ratified prior to production payment gateway activation.
        </span>
      </div>

      {/* 1. Shipping Policy */}
      {currentPath === '/shipping-policy' && (
        <div className="bg-white p-8 sm:p-12 border border-[#171614]/10 space-y-6 text-xs sm:text-sm text-[#171614]/80 font-light leading-relaxed">
          <h1 className="font-editorial text-3xl md:text-4xl text-[#171614] font-normal">
            Insured Shipping & Delivery Policy
          </h1>
          <p>
            Every piece crafted at {brand.brandName} is dispatched in tamper-evident luxury keepsake packaging, designed to protect delicate Dubai Nida weaves and bullion wire embroidery during international transit.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Domestic Shipping (India)</h3>
          <p>
            - <strong>Complimentary Shipping:</strong> Orders valued at ₹{brand.shipping.freeThreshold.toLocaleString()} or above qualify for complimentary insured surface or express air delivery.
            <br />
            - <strong>Standard Shipping:</strong> A flat rate of ₹{brand.shipping.standardRate} is applied to orders below ₹{brand.shipping.freeThreshold.toLocaleString()}.
            <br />
            - <strong>Estimated Transit Time:</strong> Metro cities: 2–3 business days. Non-metro locations: 3–5 business days.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Worldwide Express Dispatch</h3>
          <p>
            - We service clients globally including the UAE, Saudi Arabia, Qatar, Kuwait, the UK, the USA, and Canada.
            <br />
            - International transit is executed via DHL Express or FedEx Priority. Expected delivery is 4–7 business days following atelier dispatch.
            <br />
            - Customs duties and local import taxes are the responsibility of the recipient based on country regulations.
          </p>
        </div>
      )}

      {/* 2. Returns & Exchanges */}
      {currentPath === '/returns' && (
        <div className="bg-white p-8 sm:p-12 border border-[#171614]/10 space-y-6 text-xs sm:text-sm text-[#171614]/80 font-light leading-relaxed">
          <h1 className="font-editorial text-3xl md:text-4xl text-[#171614] font-normal">
            Exchanges & Alterations Protocol
          </h1>
          <p>
            Due to the bespoke and hygienic nature of modest couture, we provide an exchange window to guarantee that every garment fits with sovereign poise.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">7-Day Sizing Exchange Window</h3>
          <p>
            - If your garment requires a different length or silhouette size, notify our atelier concierge within 7 calendar days of receipt.
            <br />
            - The garment must remain unworn, unwashed, unaltered, and with all atelier security seals and fabric tags intact.
            <br />
            - Items exhibiting perfume scents, deodorant marks, or handling creases cannot be approved for exchange.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Bespoke Tailored Hem Adjustments</h3>
          <p>
            Garments that have received custom length alterations prior to dispatch (e.g. customized to a non-standard length such as 53" or 57") are crafted specifically to your coordinates and are non-refundable, though alterations guidance can be provided by our stylists.
          </p>
        </div>
      )}

      {/* 3. Privacy Policy */}
      {currentPath === '/privacy-policy' && (
        <div className="bg-white p-8 sm:p-12 border border-[#171614]/10 space-y-6 text-xs sm:text-sm text-[#171614]/80 font-light leading-relaxed">
          <h1 className="font-editorial text-3xl md:text-4xl text-[#171614] font-normal">
            Privacy & Client Data Discretion
          </h1>
          <p>
            At {brand.brandName}, client confidentiality is held in highest esteem. We treat your personal coordinates and measurements with unwavering discretion.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Information Collected</h3>
          <p>
            We collect standard order fulfillment data: name, shipping address, contact phone/WhatsApp, and email address for order status communication and tracking updates.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Payment Security</h3>
          <p>
            We never store complete payment card credentials on our servers. All transactions will be handled through RBI-regulated payment aggregators (such as Razorpay) utilizing bank-grade 256-bit encryption.
          </p>
        </div>
      )}

      {/* 4. Terms of Service */}
      {currentPath === '/terms' && (
        <div className="bg-white p-8 sm:p-12 border border-[#171614]/10 space-y-6 text-xs sm:text-sm text-[#171614]/80 font-light leading-relaxed">
          <h1 className="font-editorial text-3xl md:text-4xl text-[#171614] font-normal">
            Terms of Service
          </h1>
          <p>
            Welcome to the digital atelier of {brand.brandName}. By accessing this platform or acquiring our modest couture collections, you agree to the conditions stated herein.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Product Authenticity & Color Accuracy</h3>
          <p>
            While every effort is made to display the authentic drape, texture, and tones of our Dubai Nida and Medina silk textiles, variations in individual client display settings may yield subtle tonal differences.
          </p>

          <h3 className="font-editorial text-xl text-[#171614] pt-2">Intellectual Property</h3>
          <p>
            All architectural patterns, editorial imagery, copywriting, and the {brand.brandName} monogram remain the intellectual property of the brand and its engineering studio, AlisTech.
          </p>
        </div>
      )}
    </div>
  );
};
