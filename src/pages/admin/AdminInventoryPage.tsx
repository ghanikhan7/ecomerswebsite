import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import { formatCurrency } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import { Search, Save } from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { products, updateInventoryStock, showToast } = useStore();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [search, setSearch] = useState('');

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleStockChange = (
    colorName: string,
    size: string,
    delta: number
  ) => {
    if (!activeProduct) return;
    updateInventoryStock(activeProduct.id, colorName, size, delta, true);
  };

  const handleStockInput = (
    colorName: string,
    size: string,
    value: string
  ) => {
    if (!activeProduct) return;
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      updateInventoryStock(activeProduct.id, colorName, size, Math.max(0, num), false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-[#171614]/10 pb-4">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
          Matrix Stock Control
        </span>
        <h1 className="font-editorial text-3xl font-medium text-[#171614]">
          Color & Size Inventory Matrix
        </h1>
        <p className="text-xs text-[#171614]/65 mt-1">
          Adjust stock levels per specific colorway and length dimension. Edits update storefront availability and live out-of-stock badges in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Selector List */}
        <div className="lg:col-span-4 bg-white p-5 border border-[#171614]/10 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 bg-[#F8F6F1] border border-[#171614]/15 px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-[#B69A70] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search silhouette..."
              className="w-full bg-transparent focus:outline-hidden text-xs"
            />
          </div>

          <div className="divide-y divide-[#171614]/10 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProductId(p.id)}
                className={`w-full text-left p-3 flex items-center space-x-3 transition-colors ${
                  activeProduct?.id === p.id
                    ? 'bg-[#171614] text-white'
                    : 'hover:bg-[#E8DFD2]/20 text-[#171614]'
                }`}
              >
                <SafeImage
                  src={p.images[0]}
                  alt={p.name}
                  category={p.category}
                  className="w-10 h-14 object-cover border border-black/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-editorial text-sm truncate font-medium">
                    {p.name}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      activeProduct?.id === p.id ? 'text-[#B69A70]' : 'text-[#171614]/50'
                    }`}
                  >
                    {p.category} • Total: {p.totalStock} pcs
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Product Matrix Card */}
        {activeProduct && (
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#171614]/10 pb-4 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B69A70] font-semibold">
                  Active Silhouette
                </span>
                <h2 className="font-editorial text-2xl text-[#171614]">
                  {activeProduct.name}
                </h2>
                <div className="text-xs text-[#171614]/60 font-mono mt-0.5">
                  SKU: {activeProduct.sku} • Selling: {formatCurrency(activeProduct.price)}
                </div>
              </div>

              <div className="bg-[#E8DFD2]/50 border border-[#B69A70]/30 p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
                  Total Aggregate Stock
                </span>
                <span className="font-editorial text-2xl font-bold text-[#171614]">
                  {activeProduct.totalStock} units
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="space-y-6">
              <h3 className="font-editorial text-lg text-[#171614]">
                Colorway × Length Dimensions
              </h3>

              {activeProduct.colors.map((color) => (
                <div
                  key={color.name}
                  className="border border-[#171614]/10 p-5 bg-[#F8F6F1] space-y-4"
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <h4 className="font-semibold text-xs text-[#171614]">
                      Color: {color.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {activeProduct.sizes.map((size) => {
                      const qty =
                        activeProduct.stockMatrix?.[color.name]?.[size] ?? 0;
                      const isLow = qty <= 2;

                      return (
                        <div
                          key={size}
                          className="bg-white p-3 border border-[#171614]/10 text-center space-y-2 shadow-xs"
                        >
                          <div className="text-xs font-semibold text-[#171614]">
                            Length {size}"
                          </div>

                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleStockChange(color.name, size, -1)}
                              className="w-6 h-6 rounded-xs bg-[#171614]/5 hover:bg-[#171614] hover:text-white flex items-center justify-center text-xs transition-colors"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min={0}
                              value={qty}
                              onChange={(e) => handleStockInput(color.name, size, e.target.value)}
                              className="w-12 text-center text-xs font-bold border border-[#171614]/15 py-0.5 focus:outline-hidden focus:border-[#B69A70]"
                            />

                            <button
                              type="button"
                              onClick={() => handleStockChange(color.name, size, 1)}
                              className="w-6 h-6 rounded-xs bg-[#171614]/5 hover:bg-[#171614] hover:text-white flex items-center justify-center text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-[10px]">
                            {qty === 0 ? (
                              <span className="text-red-700 font-bold uppercase tracking-wider">
                                Sold Out
                              </span>
                            ) : isLow ? (
                              <span className="text-amber-700 font-semibold">
                                Low ({qty} left)
                              </span>
                            ) : (
                              <span className="text-emerald-700">Healthy</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#171614]/10 flex items-center justify-between text-xs text-[#171614]/60">
              <span>All quantity adjustments persist instantly to browser LocalStorage.</span>
              <button
                type="button"
                onClick={() => showToast('Inventory counts saved successfully.')}
                className="bg-[#171614] hover:bg-[#B69A70] text-white px-5 py-2 uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Matrix</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
