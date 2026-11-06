import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { brand, cartTotalCount, wishlist, setIsCartOpen, setIsSearchOpen, adminUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on click
  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setCollectionsDropdown(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F6F1]/95 backdrop-blur-md shadow-xs py-3 border-b border-[#171614]/8'
          : 'bg-[#F8F6F1] py-5 border-b border-[#171614]/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171614] hover:text-[#B69A70] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#171614] hover:text-[#B69A70] transition-colors ml-1"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation Left */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-widest uppercase">
            <Link
              to="/shop"
              className={`hover:text-[#B69A70] transition-colors pb-0.5 ${
                location.pathname === '/shop' && !location.search ? 'text-[#B69A70] border-b border-[#B69A70]' : 'text-[#171614]'
              }`}
            >
              Shop All
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsDropdown(true)}
              onMouseLeave={() => setCollectionsDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#B69A70] transition-colors uppercase tracking-widest text-xs py-2"
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {collectionsDropdown && (
                <div className="absolute top-full left-0 w-64 bg-[#F8F6F1] shadow-xl border border-[#171614]/10 py-3 z-50">
                  <div className="px-4 py-2 border-b border-[#171614]/5 text-[10px] tracking-widest text-[#B69A70] uppercase font-semibold">
                    Curated Silhouettes
                  </div>
                  {brand.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-xs font-normal hover:bg-[#E8DFD2]/30 hover:text-[#B69A70] transition-colors capitalize tracking-normal"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Central Luxury Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block group text-center">
              <span className="block text-[11px] tracking-[0.35em] uppercase text-[#B69A70] font-medium leading-none mb-1">
                Haute Couture
              </span>
              <span className="font-editorial text-2xl sm:text-3xl md:text-3xl tracking-[0.18em] font-normal uppercase text-[#171614] group-hover:text-[#B69A70] transition-colors">
                {brand.logoText}
              </span>
            </Link>
          </div>

          {/* Right Navigation & Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-widest uppercase mr-3">
              <Link
                to="/about"
                className={`hover:text-[#B69A70] transition-colors pb-0.5 ${
                  location.pathname === '/about' ? 'text-[#B69A70] border-b border-[#B69A70]' : 'text-[#171614]'
                }`}
              >
                The Atelier
              </Link>
              <Link
                to="/contact"
                className={`hover:text-[#B69A70] transition-colors pb-0.5 ${
                  location.pathname === '/contact' ? 'text-[#B69A70] border-b border-[#B69A70]' : 'text-[#171614]'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 text-xs text-[#171614] hover:text-[#B69A70] transition-colors"
              title="Search collection"
            >
              <Search className="w-4 h-4" />
              <span className="tracking-widest uppercase text-[11px]">Search</span>
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1.5 text-[#171614] hover:text-[#B69A70] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B69A70] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-[#171614] hover:text-[#B69A70] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#171614] text-[#F8F6F1] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Admin Portal Quick Link */}
            <Link
              to={adminUser ? '/admin/dashboard' : '/admin/login'}
              className="hidden sm:flex items-center p-1.5 text-[#171614]/70 hover:text-[#B69A70] transition-colors"
              title={adminUser ? 'Admin Dashboard' : 'Admin Login'}
            >
              {adminUser ? (
                <Shield className="w-4 h-4 text-[#B69A70]" />
              ) : (
                <User className="w-4 h-4 stroke-[1.5]" />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[108px] z-50 bg-[#171614]/60 backdrop-blur-xs lg:hidden">
          <div className="bg-[#F8F6F1] h-full w-4/5 max-w-sm p-6 overflow-y-auto shadow-2xl border-r border-[#171614]/10">
            <div className="space-y-6">
              <div className="border-b border-[#171614]/10 pb-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-2">
                  Navigation
                </span>
                <nav className="flex flex-col space-y-3.5 text-sm font-medium tracking-widest uppercase">
                  <Link to="/shop" onClick={handleNavClick} className="hover:text-[#B69A70] transition-colors">
                    Shop All
                  </Link>
                  <Link to="/about" onClick={handleNavClick} className="hover:text-[#B69A70] transition-colors">
                    The Atelier
                  </Link>
                  <Link to="/contact" onClick={handleNavClick} className="hover:text-[#B69A70] transition-colors">
                    Contact
                  </Link>
                </nav>
              </div>

              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-3">
                  Categories
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {brand.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={handleNavClick}
                      className="text-xs text-[#171614]/80 hover:text-[#B69A70] transition-colors py-1 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#B69A70]">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#171614]/10 pt-5 space-y-3">
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-2 text-xs text-[#171614] hover:text-[#B69A70] transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#B69A70]" />
                  <span>Atelier CMS Portal</span>
                </Link>
                <div className="text-[11px] text-[#171614]/60 pt-2">
                  <p>Concierge WhatsApp: {brand.contact.phone}</p>
                  <p>{brand.contact.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
