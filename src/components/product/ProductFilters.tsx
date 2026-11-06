import React from 'react';
import { useStore } from '../../context/useStore';
import { formatCurrency } from '../../utils/formatters';
import { RotateCcw } from 'lucide-react';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  size: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const { brand } = useStore();

  const availableColors = [
    { name: 'Black', hex: '#171614' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Nude', hex: '#D2BA9C' },
    { name: 'Brown', hex: '#6A564A' },
    { name: 'Pink', hex: '#EBB6C2' },
    { name: 'Gray', hex: '#7A7A7A' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Wine', hex: '#581825' },
    { name: 'Blue', hex: '#1E3A8A' },
    { name: 'Green', hex: '#2E8B57' },
  ];

  const availableSizes = ['50', '52', '54', '56', '58', '60'];

  return (
    <div className="space-y-8 bg-white p-6 border border-[#171614]/10 shadow-xs">
      {/* Header with Reset */}
      <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4">
        <h3 className="font-editorial text-xl font-medium tracking-wide uppercase text-[#171614]">
          Refine Pieces
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-[#B69A70] hover:text-[#171614] flex items-center space-x-1 uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* In Stock Only Checkbox */}
      <div>
        <label className="flex items-center space-x-2.5 text-xs text-[#171614] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="accent-[#B69A70] w-4 h-4 cursor-pointer"
          />
          <span className="font-medium">In Stock Only (Ready to Dispatch)</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#171614] font-semibold block mb-3">
          Category
        </label>
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => onChange({ category: 'all' })}
            className={`block w-full text-left py-1 transition-colors ${
              filters.category === 'all'
                ? 'font-semibold text-[#B69A70]'
                : 'text-[#171614]/70 hover:text-[#171614]'
            }`}
          >
            All Collections
          </button>
          {brand.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.name })}
              className={`block w-full text-left py-1 transition-colors ${
                filters.category === cat.name
                  ? 'font-semibold text-[#B69A70]'
                  : 'text-[#171614]/70 hover:text-[#171614]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#171614] font-semibold">
            Max Price
          </label>
          <span className="text-xs font-semibold text-[#B69A70]">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={5000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#B69A70] bg-[#171614]/10 h-1 rounded-xs cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#171614]/40 mt-1">
          <span>{formatCurrency(500)}</span>
          <span>{formatCurrency(5000)}</span>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#171614] font-semibold block mb-3">
          Color Palette {filters.color && `(${filters.color})`}
        </label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() =>
                onChange({ color: filters.color === c.name ? '' : c.name })
              }
              title={c.name}
              className={`w-7 h-7 rounded-full p-0.5 border transition-all ${
                filters.color === c.name
                  ? 'border-[#171614] scale-115'
                  : 'border-transparent hover:border-[#B69A70]'
              }`}
            >
              <span
                className="block w-full h-full rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Length / Size Filter */}
      <div>
        <label className="text-[11px] uppercase tracking-[0.2em] text-[#171614] font-semibold block mb-3">
          Garment Length (Inches)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                onChange({ size: filters.size === s ? '' : s })
              }
              className={`py-1.5 text-xs font-medium border text-center transition-colors ${
                filters.size === s
                  ? 'bg-[#171614] text-white border-[#171614]'
                  : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
              }`}
            >
              {s}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
