import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { Product, ProductColor, ProductSize } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, brand } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: brand.categories[0]?.name || 'Everyday Abayas',
    price: 4999,
    originalPrice: 6499,
    description: '',
    fabricDetails: 'Pure Dubai Nida (Grade-1), breathable weave.',
    careInstructions: 'Specialist dry clean only. Steam with low heat.',
    imagesStr: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/WhatsAppImage2026-11-02at1.03.09PM.webp?v=1793605107\n/images/collections/everyday-abayas.png',
    colorsStr: 'Noir Onyx:#171614, Champagne Gold:#CBB490',
    sizesStr: '52, 54, 56, 58, 60',
    badge: 'New Season',
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    isPublished: true,
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `AA-NEW-${Math.floor(100 + Math.random() * 900)}`,
      category: brand.categories[0]?.name || 'Everyday Abayas',
      price: 5499,
      originalPrice: 6999,
      description: 'Handcrafted luxury silhouette tailored from prime Dubai textiles with fluid drape and concealed seams.',
      fabricDetails: 'Pure Dubai Nida (Grade-1), breathable weave.',
      careInstructions: 'Specialist dry clean only. Cool iron on reverse.',
      imagesStr: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/WhatsAppImage2026-11-02at1.03.09PM.webp?v=1793605107\n/images/collections/everyday-abayas.png',
      colorsStr: 'Noir Onyx:#171614, Desert Sand:#D2BA9C',
      sizesStr: '52, 54, 56, 58, 60',
      badge: 'New Season',
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      fabricDetails: product.fabricDetails,
      careInstructions: product.careInstructions,
      imagesStr: product.images.join('\n'),
      colorsStr: product.colors.map((c) => `${c.name}:${c.hex}`).join(', '),
      sizesStr: product.sizes.join(', '),
      badge: product.badge || '',
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestseller: product.isBestseller,
      isPublished: product.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse images
    const images = formData.imagesStr
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // Parse colors
    const colors: ProductColor[] = formData.colorsStr
      .split(',')
      .map((pair) => {
        const [cName, cHex] = pair.split(':').map((s) => s.trim());
        return { name: cName || 'Noir', hex: cHex || '#171614' };
      })
      .filter((c) => c.name.length > 0);

    // Parse sizes
    const sizes = formData.sizesStr
      .split(',')
      .map((s) => s.trim() as ProductSize)
      .filter((s) => s.length > 0);

    if (editingProduct) {
      // Update existing
      const updated: Product = {
        ...editingProduct,
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        careInstructions: formData.careInstructions,
        images: images.length > 0 ? images : editingProduct.images,
        colors: colors.length > 0 ? colors : editingProduct.colors,
        sizes: sizes.length > 0 ? sizes : editingProduct.sizes,
        badge: formData.badge || undefined,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestseller: formData.isBestseller,
        isPublished: formData.isPublished,
      };
      updateProduct(updated);
    } else {
      // Generate initial stock matrix for new product
      const stockMatrix: Record<string, Record<string, number>> = {};
      let totalStock = 0;
      colors.forEach((c) => {
        stockMatrix[c.name] = {};
        sizes.forEach((s) => {
          stockMatrix[c.name][s] = 5;
          totalStock += 5;
        });
      });

      addProduct({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        careInstructions: formData.careInstructions,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'],
        colors,
        sizes,
        stockMatrix,
        totalStock,
        badge: formData.badge || undefined,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestseller: formData.isBestseller,
        isPublished: formData.isPublished,
        rating: 5.0,
        reviewCount: 1,
      });
    }

    setIsModalOpen(false);
  };

  const togglePublish = (product: Product) => {
    updateProduct({
      ...product,
      isPublished: !product.isPublished,
    });
  };

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#171614]/10 pb-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
            Catalogue Architecture
          </span>
          <h1 className="font-editorial text-3xl font-medium text-[#171614]">
            Product Management ({products.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Silhouette</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#171614]/10 flex flex-col sm:flex-row justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-md bg-[#F8F6F1] border border-[#171614]/15 px-3 py-2">
          <Search className="w-4 h-4 text-[#B69A70] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search silhouettes by title, category, or SKU..."
            className="w-full bg-transparent focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-[#171614]/60 uppercase tracking-wider text-[11px]">
            Filter:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F8F6F1] border border-[#171614]/20 py-2 px-3 text-xs"
          >
            <option value="all">All Categories ({products.length})</option>
            {brand.categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#171614]/10 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#171614] text-[#F8F6F1] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Silhouette</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Badges</th>
              <th className="py-3.5 px-4">Visibility</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171614]/10">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#E8DFD2]/15 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <SafeImage
                      src={prod.images[0]}
                      alt={prod.name}
                      category={prod.category}
                      className="w-10 h-14 object-cover border border-[#171614]/15 shrink-0"
                    />
                    <div>
                      <div className="font-editorial text-base font-medium text-[#171614] line-clamp-1">
                        {prod.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#171614]/40">{prod.sku}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[#171614]/80">{prod.category}</td>

                <td className="py-3.5 px-4 font-semibold text-[#171614]">
                  {formatCurrency(prod.price)}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                      prod.totalStock <= 25
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {prod.totalStock} pieces
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {prod.badge && (
                      <span className="bg-[#171614] text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wider">
                        {prod.badge}
                      </span>
                    )}
                    {prod.isFeatured && (
                      <span className="bg-[#B69A70] text-[#171614] text-[9px] px-1.5 py-0.5 uppercase font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => togglePublish(prod)}
                    className={`flex items-center space-x-1 text-[11px] font-medium px-2 py-1 border transition-colors ${
                      prod.isPublished
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {prod.isPublished ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-[#171614]/70 hover:text-[#B69A70] transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove "${prod.name}" permanently from catalogue?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 text-[#171614]/40 hover:text-red-700 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-[#F8F6F1] border border-[#171614]/15 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B69A70] font-bold">
                    {editingProduct ? 'Update Creation' : 'New Atelier Creation'}
                  </span>
                  <h3 className="font-editorial text-2xl text-[#171614]">
                    {editingProduct ? editingProduct.name : 'Add Product to Catalogue'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#171614]/60 hover:text-[#171614]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. The Royal Zahra Embroidered Abaya"
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="AA-PRM-009"
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    >
                      {brand.categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Selling Price (INR ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Original / Strike Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Image URLs (One URL per line — First is Main, Second is Hover) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.imagesStr}
                    onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
                    className="w-full bg-white border border-[#171614]/20 p-2.5 font-mono text-[11px] focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>

                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Description & Silhouette Story *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Available Colors (Format: Name:#HEX, Name:#HEX)
                    </label>
                    <input
                      type="text"
                      value={formData.colorsStr}
                      onChange={(e) => setFormData({ ...formData, colorsStr: e.target.value })}
                      placeholder="Noir Onyx:#171614, Desert Sand:#D2BA9C"
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Available Sizes (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.sizesStr}
                      onChange={(e) => setFormData({ ...formData, sizesStr: e.target.value })}
                      placeholder="52, 54, 56, 58, 60"
                      className="w-full bg-white border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="accent-[#B69A70] w-4 h-4"
                    />
                    <span className="font-medium text-[#171614]">Publish Live to Storefront</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#B69A70] w-4 h-4"
                    />
                    <span>Featured in Highlights</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#B69A70] w-4 h-4"
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#171614]/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#171614]/20 text-[#171614] text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    {editingProduct ? 'Save Modifications' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
