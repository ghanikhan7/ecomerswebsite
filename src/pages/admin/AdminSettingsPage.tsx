import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import { Save, RotateCcw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { brand, updateBrandSettings, resetDemoData, showToast } = useStore();

  const [storeName, setStoreName] = useState(brand.brandName);
  const [logoText, setLogoText] = useState(brand.logoText);
  const [tagline, setTagline] = useState(brand.tagline);
  const [contactEmail, setContactEmail] = useState(brand.contact.email);
  const [contactPhone, setContactPhone] = useState(brand.contact.phone);
  const [whatsapp, setWhatsapp] = useState(brand.contact.whatsapp);
  const [announcementText, setAnnouncementText] = useState(brand.announcement.text);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(brand.shipping.freeThreshold);
  const [standardRate, setStandardRate] = useState(brand.shipping.standardRate);
  const [expressRate, setExpressRate] = useState(brand.shipping.expressRate);
  const [taxRate, setTaxRate] = useState(brand.taxRatePercentage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandSettings({
      brandName: storeName,
      logoText,
      tagline,
      contact: {
        ...brand.contact,
        email: contactEmail,
        phone: contactPhone,
        whatsapp,
      },
      announcement: {
        ...brand.announcement,
        text: announcementText,
      },
      shipping: {
        ...brand.shipping,
        freeThreshold: Number(freeShippingThreshold),
        standardRate: Number(standardRate),
        expressRate: Number(expressRate),
      },
      taxRatePercentage: Number(taxRate),
    });
    showToast('Atelier settings updated and saved to LocalStorage.');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Page Title */}
      <div className="border-b border-[#171614]/10 pb-4">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
          System Configuration
        </span>
        <h1 className="font-editorial text-3xl font-medium text-[#171614]">
          Atelier & Brand Settings
        </h1>
        <p className="text-xs text-[#171614]/65 mt-1">
          AlisTech white-label starter settings. Updating parameters here customizes the brand identity, rates, and contact details across the entire storefront in real-time.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Identity & Wordmark */}
        <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl text-[#171614] border-b border-[#171614]/10 pb-3">
            Brand Identity & Monogram
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Full Brand Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Header Wordmark / Monogram Text *
              </label>
              <input
                type="text"
                required
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[#171614] font-medium mb-1">
              Atelier Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[#171614] font-medium mb-1">
              Storefront Announcement Bar Broadcast
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
            />
          </div>
        </div>

        {/* 2. Client Concierge Coordinates */}
        <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl text-[#171614] border-b border-[#171614]/10 pb-3">
            Concierge & Communication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Telephone Concierge
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                WhatsApp Desk Number
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>
          </div>
        </div>

        {/* 3. Rates, Thresholds & Taxes */}
        <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl text-[#171614] border-b border-[#171614]/10 pb-3">
            Shipping & Tax Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Free Shipping Over (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardRate}
                onChange={(e) => setStandardRate(Number(e.target.value))}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                VIP Priority Express (₹)
              </label>
              <input
                type="number"
                value={expressRate}
                onChange={(e) => setExpressRate(Number(e.target.value))}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>

            <div>
              <label className="block text-[#171614] font-medium mb-1">
                GST / Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>
          </div>
        </div>

        {/* Save and Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#171614]/10">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Persist Configurations</span>
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="w-full sm:w-auto bg-white border border-red-800 text-red-800 hover:bg-red-50 px-6 py-3 text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Defaults</span>
          </button>
        </div>
      </form>
    </div>
  );
};
