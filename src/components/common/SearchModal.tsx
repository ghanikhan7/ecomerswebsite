import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency } from '../../utils/formatters';
import { SafeImage } from './SafeImage';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, brand } = useStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleClose = () => {
    setQuery('');
    setIsSearchOpen(false);
  };

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSelectCategory = (categoryName: string) => {
    setIsSearchOpen(false);
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#171614]/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative min-h-screen flex flex-col items-center pt-20 px-4">
        <div className="w-full max-w-3xl bg-[#F8F6F1] shadow-2xl border border-[#171614]/10 overflow-hidden">
          {/* Search Input Bar */}
          <form
            onSubmit={handleFullSearch}
            className="p-5 border-b border-[#171614]/10 flex items-center bg-white"
          >
            <Search className="w-5 h-5 text-[#B69A70] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by silhouette, fabric (Nida, Silk), or design..."
              className="w-full text-base sm:text-lg bg-transparent text-[#171614] placeholder-[#171614]/40 focus:outline-hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#171614]/40 hover:text-[#171614] mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-[#171614]/60 hover:text-[#171614]"
            >
              <span className="text-xs uppercase tracking-wider">Close</span>
            </button>
          </form>

          {/* Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold block mb-3">
                    Curated Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {brand.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.name)}
                        className="text-xs px-3 py-1.5 bg-white border border-[#171614]/10 hover:border-[#B69A70] hover:text-[#B69A70] transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold block mb-3">
                    Popular Inquiries
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Dubai Nida', 'Zahra Embroidered', 'Front Open', 'Double Shrug', 'Black Kimono', 'Medina Silk'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setQuery(tag)}
                          className="text-[#171614]/70 hover:text-[#B69A70] underline underline-offset-4"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-[#171614]/60">
                  No couture pieces found for "{query}".
                </p>
                <p className="text-xs text-[#171614]/40 mt-1">
                  Try searching for "Nida", "Kaftan", or "Embroidered".
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#B69A70] font-semibold">
                    Matching Silhouettes ({filteredProducts.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleFullSearch}
                    className="text-xs text-[#B69A70] hover:underline flex items-center space-x-1"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.id)}
                      className="cursor-pointer group bg-white border border-[#171614]/5 p-3 flex space-x-3 items-center hover:border-[#B69A70] transition-colors"
                    >
                      <SafeImage
                        src={prod.images[0]}
                        alt={prod.name}
                        category={prod.category}
                        className="w-14 h-18 object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[9px] uppercase tracking-wider text-[#B69A70] block">
                          {prod.category}
                        </span>
                        <h4 className="font-editorial text-sm font-medium text-[#171614] group-hover:text-[#B69A70] transition-colors truncate">
                          {prod.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#171614] mt-0.5 block">
                          {formatCurrency(prod.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
