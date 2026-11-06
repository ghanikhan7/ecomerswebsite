import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-[#171614]/60 py-4">
      <Link to="/" className="hover:text-[#B69A70] transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-[#171614]/30" />
          {item.url ? (
            <Link to={item.url} className="hover:text-[#B69A70] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#171614] font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

