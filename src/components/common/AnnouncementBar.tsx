import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { brand } = useStore();

  if (!brand.announcement.enabled) return null;

  return (
    <div className="bg-[#171614] text-[#F8F6F1] text-[11px] md:text-xs tracking-widest uppercase py-2.5 px-4 border-b border-[#B69A70]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden lg:flex items-center space-x-2 text-[#B69A70]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-medium tracking-wider">Atelier Verified Quality</span>
        </div>

        <div className="flex-1 text-center font-medium px-2 flex items-center justify-center space-x-2">
          <Sparkles className="w-3 h-3 text-[#B69A70] hidden sm:inline" />
          <span>{brand.announcement.text}</span>
          {brand.announcement.linkText && (
            <Link
              to={brand.announcement.linkUrl || '/shop'}
              className="underline underline-offset-4 hover:text-[#B69A70] transition-colors ml-1 font-semibold"
            >
              {brand.announcement.linkText}
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-4 text-[10px] text-[#E8DFD2]/80">
          <span>INR (₹)</span>
          <span className="text-[#B69A70]/50">•</span>
          <Link to="/admin/login" className="hover:text-[#B69A70] transition-colors">
            Staff Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
