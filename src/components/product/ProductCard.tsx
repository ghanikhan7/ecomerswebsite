import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useStore } from '../../context/useStore';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, openQuickView, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const discount = calculateDiscount(product.price, product.originalPrice);
  const primaryImg = product.images[0];
  const secondaryImg = product.images[1] || product.images[0];
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors[selectedColorIndex] || product.colors[0];
    const size = product.sizes[0] || '56';
    addToCart(product, color, size, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E8DFD2]/30 border border-[#171614]/5">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          {/* Primary image */}
          <SafeImage
            src={primaryImg}
            alt={product.name}
            category={product.category}
            loading="lazy"
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered && secondaryImg ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {/* Secondary hover image */}
          {secondaryImg && (
            <SafeImage
              src={secondaryImg}
              alt={`${product.name} alternate view`}
              category={product.category}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-[#171614] text-[#F8F6F1] text-[9px] uppercase tracking-widest px-2.5 py-1 font-medium">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#B69A70] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-[#B69A70] text-white'
              : 'bg-white/90 text-[#171614] hover:bg-[#171614] hover:text-white'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : 'stroke-[1.5]'}`} />
        </button>

        {/* Quick Action Overlay (slides up on hover on desktop) */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 flex gap-2 transition-all duration-300 ${
            isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none md:flex hidden'
          }`}
        >
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 bg-white/95 hover:bg-[#171614] hover:text-white text-[#171614] py-2.5 px-2 text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] p-2.5 text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center shadow-sm"
            title="Add directly to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col">
        <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#B69A70] mb-1">
          <span>{product.category}</span>
          {/* Color swatch dots */}
          {product.colors.length > 1 && (
            <div className="flex items-center space-x-1">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full border ${
                    selectedColorIndex === idx ? 'border-[#171614] scale-125' : 'border-black/20'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <Link
          to={`/product/${product.id}`}
          className="font-editorial text-lg text-[#171614] hover:text-[#B69A70] transition-colors leading-snug line-clamp-1 font-normal"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-xs font-semibold text-[#171614] tracking-wide">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#171614]/40 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
