import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import type { ProductSize } from '../../types';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import type { FilterState } from '../../components/product/ProductFilters';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SafeImage } from '../../components/common/SafeImage';
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid3X3,
  Grid2X2,
  X,
  Sparkles,
  Flame,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, brand } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const filterParam = searchParams.get('filter'); // 'new' | 'bestsellers' | null
  const categoryParam = searchParams.get('category'); // category name or slug
  const searchQuery = searchParams.get('q') || '';
  const availabilityParam = searchParams.get('availability');

  // Match category slug to category name if necessary
  const resolvedCategory = useMemo(() => {
    if (!categoryParam) return 'all';
    const matchBySlug = brand.categories.find(
      (c) => c.slug.toLowerCase() === categoryParam.toLowerCase()
    );
    if (matchBySlug) return matchBySlug.name;
    const matchByName = brand.categories.find(
      (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
    );
    if (matchByName) return matchByName.name;
    return categoryParam;
  }, [categoryParam, brand.categories]);

  // Sidebar / Local filter state
  const [filters, setFilters] = useState<FilterState>({
    category: resolvedCategory,
    minPrice: 500,
    maxPrice: 5000,
    color: '',
    size: '',
    inStockOnly: availabilityParam === 'in-stock',
    sortBy: 'featured',
  });

  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category state when URL parameter changes
  const activeCategory = categoryParam ? resolvedCategory : filters.category;

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    if (updated.category) {
      if (updated.category === 'all') {
        searchParams.delete('category');
      } else {
        searchParams.set('category', updated.category);
      }
      setSearchParams(searchParams);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 500,
      maxPrice: 5000,
      color: '',
      size: '',
      inStockOnly: false,
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  // Determine current page title and subtitle from URL
  const { title, subtitle, bannerCategory } = useMemo(() => {
    if (filterParam === 'new') {
      return {
        title: 'New Season Arrivals',
        subtitle: 'Fresh off the atelier loom — discover the latest contemporary modest silhouettes.',
        bannerCategory: null,
      };
    }
    if (filterParam === 'bestsellers') {
      return {
        title: 'Atelier Bestsellers',
        subtitle: 'Our most sought-after signature creations, revered by patrons across the globe.',
        bannerCategory: null,
      };
    }
    if (activeCategory !== 'all') {
      const catObj = brand.categories.find((c) => c.name === activeCategory);
      return {
        title: activeCategory,
        subtitle: catObj?.description || 'Handcrafted modest couture in authentic imported fabrics.',
        bannerCategory: catObj || null,
      };
    }
    return {
      title: 'The Complete Modest Atelier',
      subtitle: 'Explore our full luxury catalogue of 100 authentic modest abayas, kaftans, and khimars.',
      bannerCategory: null,
    };
  }, [filterParam, activeCategory, brand.categories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Must be published
        if (p.isPublished === false) return false;

        // URL filter: New Arrivals
        if (filterParam === 'new' && !p.isNewArrival) {
          return false;
        }

        // URL filter: Bestsellers
        if (filterParam === 'bestsellers' && !p.isBestseller) {
          return false;
        }

        // Category filter
        if (activeCategory !== 'all' && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }

        // In Stock Only filter
        if (filters.inStockOnly && (p.totalStock || 0) <= 0) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesSku = p.sku.toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesDesc && !matchesSku) return false;
        }

        // Price filter
        if (p.price > filters.maxPrice) return false;

        // Color filter
        if (filters.color) {
          const colQ = filters.color.toLowerCase();
          const hasColor = p.colors.some((c) =>
            c.name.toLowerCase().includes(colQ)
          ) || p.name.toLowerCase().includes(colQ);
          if (!hasColor) return false;
        }

        // Size filter
        if (filters.size) {
          if (!p.sizes.includes(filters.size as ProductSize)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, filterParam, activeCategory, filters, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop', url: '/shop' },
          ...(filterParam === 'new' ? [{ label: 'New Arrivals' }] : []),
          ...(filterParam === 'bestsellers' ? [{ label: 'Bestsellers' }] : []),
          ...(activeCategory !== 'all' ? [{ label: activeCategory }] : []),
        ]}
      />

      {/* Primary Category Banner (if viewing specific category with image) */}
      {bannerCategory ? (
        <div className="relative mb-10 overflow-hidden bg-[#171614] text-white p-8 md:p-12 border border-[#B69A70]/20 shadow-md">
          <SafeImage
            src={bannerCategory.heroImage}
            fallbackSrc="/images/collections/everyday-abayas.png"
            category={bannerCategory.name}
            alt={bannerCategory.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold">
              Atelier Silhouette Collection
            </span>
            <h1 className="font-editorial text-3xl md:text-5xl font-normal">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-[#E8DFD2]/80 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2 pt-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold">
            {filterParam === 'new'
              ? '2026 Collection'
              : filterParam === 'bestsellers'
              ? 'Client Favorites'
              : 'Haute Modesty'}
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal text-[#171614]">
            {title}
          </h1>
          <p className="text-xs text-[#171614]/65 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}

      {/* Top Quick Navigation Filter Tabs (Shop All, New Arrivals, Bestsellers) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-[#171614]/10 pb-4">
        <Link
          to="/shop"
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors border ${
            !filterParam && activeCategory === 'all'
              ? 'bg-[#171614] text-white border-[#171614]'
              : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
          }`}
        >
          Shop All (100)
        </Link>
        <Link
          to="/shop?filter=new"
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors border flex items-center space-x-1.5 ${
            filterParam === 'new'
              ? 'bg-[#171614] text-white border-[#171614]'
              : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B69A70]" />
          <span>New Arrivals</span>
        </Link>
        <Link
          to="/shop?filter=bestsellers"
          className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors border flex items-center space-x-1.5 ${
            filterParam === 'bestsellers'
              ? 'bg-[#171614] text-white border-[#171614]'
              : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#B69A70]" />
          <span>Bestsellers</span>
        </Link>

        {/* Category Pills */}
        {brand.categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${encodeURIComponent(cat.name)}`}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider transition-colors border ${
              activeCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-[#B69A70] text-[#171614] font-semibold border-[#B69A70]'
                : 'bg-white/60 text-[#171614]/80 border-[#171614]/15 hover:border-[#B69A70]'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Control Bar: Filter toggle on mobile, Results count, Sorting, Columns */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-y border-[#171614]/10 py-4 mb-8 gap-4">
        {/* Left: Mobile Filter Button & Results Count */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 text-xs uppercase tracking-wider font-medium text-[#171614] bg-white border border-[#171614]/20 px-3.5 py-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B69A70]" />
            <span>Refine Pieces</span>
          </button>

          <span className="text-xs text-[#171614]/70 font-light">
            Showing <strong className="font-semibold text-[#171614]">{filteredProducts.length}</strong> creations
          </span>
        </div>

        {/* Right: Sorting & Grid switchers */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <label className="text-[#171614]/60 uppercase tracking-wider text-[11px] hidden sm:inline">
              Sort by:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
              }
              className="bg-white border border-[#171614]/20 text-xs py-2 px-3 focus:outline-hidden focus:border-[#B69A70]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals First</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Desktop Grid Switcher */}
          <div className="hidden lg:flex items-center space-x-1 border-l border-[#171614]/10 pl-3">
            <button
              type="button"
              onClick={() => setColumns(2)}
              className={`p-1.5 transition-colors ${
                columns === 2 ? 'text-[#B69A70]' : 'text-[#171614]/40 hover:text-[#171614]'
              }`}
              title="2 Columns View"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setColumns(3)}
              className={`p-1.5 transition-colors ${
                columns === 3 ? 'text-[#B69A70]' : 'text-[#171614]/40 hover:text-[#171614]'
              }`}
              title="3 Columns View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setColumns(4)}
              className={`p-1.5 transition-colors ${
                columns === 4 ? 'text-[#B69A70]' : 'text-[#171614]/40 hover:text-[#171614]'
              }`}
              title="4 Columns View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <ProductFilters
            filters={{ ...filters, category: activeCategory }}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {/* Active Filter Chips */}
          {(activeCategory !== 'all' || filters.color || filters.size || filters.inStockOnly || searchQuery || filterParam) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-[#171614]/50">
                Active:
              </span>
              {filterParam && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>Filter: {filterParam === 'new' ? 'New Arrivals' : 'Bestsellers'}</span>
                  <Link to="/shop" className="hover:text-red-700 ml-1">
                    <X className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {activeCategory !== 'all' && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>Category: {activeCategory}</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ category: 'all' })}
                    className="hover:text-red-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.inStockOnly && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>In Stock Only</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ inStockOnly: false })}
                    className="hover:text-red-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.color && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>Color: {filters.color}</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ color: '' })}
                    className="hover:text-red-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.size && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>Length: {filters.size}"</span>
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ size: '' })}
                    className="hover:text-red-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 bg-white border border-[#171614]/15 px-2.5 py-1 text-xs text-[#171614]">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      searchParams.delete('q');
                      setSearchParams(searchParams);
                    }}
                    className="hover:text-red-700 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#B69A70] hover:underline underline-offset-2 ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          <ProductGrid products={filteredProducts} columns={columns} />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-[#171614]/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#F8F6F1] shadow-2xl overflow-y-auto p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4 mb-4">
                  <h3 className="font-editorial text-xl uppercase tracking-wider text-[#171614]">
                    Refine Collection
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-[#171614]/60 hover:text-[#171614]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters
                  filters={{ ...filters, category: activeCategory }}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>

              <div className="pt-6 border-t border-[#171614]/10 mt-6">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#171614] text-[#F8F6F1] py-3 text-xs uppercase tracking-widest font-semibold"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
