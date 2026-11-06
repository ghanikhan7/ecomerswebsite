import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="border-b border-[#171614]/10 pb-6 mb-8 text-center max-w-xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block mb-1">
          Private Curation
        </span>
        <h1 className="font-editorial text-3xl md:text-5xl font-normal text-[#171614]">
          Your Saved Creations
        </h1>
        <p className="text-xs text-[#171614]/65 font-light mt-2">
          Keep track of bespoke silhouettes for your upcoming festivities and gatherings.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[#171614]/10 bg-white/50 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#E8DFD2]/40 flex items-center justify-center text-[#B69A70] mx-auto mb-4">
            <Heart className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h3 className="font-editorial text-2xl text-[#171614]">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#171614]/60 mt-2 leading-relaxed">
            Click the heart icon on any abaya, kaftan, or khimar in our catalogue to curate your personal collection.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
