import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 4,
  emptyMessage = 'No luxury silhouettes match your current criteria.',
}) => {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-[#171614]/10 bg-white/50 p-8">
        <h3 className="font-editorial text-2xl text-[#171614]">Atelier Silence</h3>
        <p className="text-xs text-[#171614]/60 max-w-sm mx-auto mt-2 leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const gridColsClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-x-6 gap-y-10`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
