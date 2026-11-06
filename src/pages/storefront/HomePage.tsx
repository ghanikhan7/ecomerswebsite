import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { ProductCard } from '../../components/product/ProductCard';
import { SafeImage } from '../../components/common/SafeImage';
import {
  ArrowRight,
  Shield,
  Sparkles,
  Scissors,
  Truck,
  ArrowUpRight,
  Star,
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';

export const HomePage: React.FC = () => {
  const { products, brand } = useStore();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  // Signature Haute Modesty Colorway Palettes for Hero Editorial
  const heroPalettes = [
    {
      name: 'Mocha Earth',
      shade: 'Mocha',
      hex: '#6A564A',
      img: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/LayeredChocolateBrownAbayainaModernInterior.png?v=1793425764',
    },
    {
      name: 'Atelier Burgundy',
      shade: 'Burgundy',
      hex: '#5A1827',
      img: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/ChatGPTImageOct8_2026_11_01_55AM.png?v=1791437764',
    },
    {
      name: 'Noir Onyx',
      shade: 'Black',
      hex: '#171614',
      img: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/MonogrammedBlackAbayaPortrait_1.png?v=1793604956',
    },
    {
      name: 'Olive Grove',
      shade: 'Olive Green',
      hex: '#4A5320',
      img: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/ChatGPTImageOct6_2026_03_36_13PM.png?v=1791281315',
    },
    {
      name: 'Imperial Plum',
      shade: 'Plum',
      hex: '#4B2D44',
      img: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/PlumAbayainanElegantStudio.png?v=1792487540',
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. Grand Editorial Hero Section — Multi-Colorway Abaya Editorial */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#171614]">
        {/* Full-Length Abaya Editorial Background Lineup: Mocha, Burgundy, Black, Olive Green, Plum */}
        <div className="absolute inset-0 z-0 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 overflow-hidden">
          {heroPalettes.map((palette, idx) => (
            <div
              key={idx}
              className={`relative h-full overflow-hidden border-r border-[#171614]/30 ${
                idx === 2
                  ? 'block'
                  : idx === 0 || idx === 1
                  ? 'hidden sm:block'
                  : 'hidden lg:block'
              }`}
            >
              <SafeImage
                src={palette.img}
                fallbackSrc="/images/collections/everyday-abayas.png"
                alt={`${palette.name} Abaya`}
                className="w-full h-full object-cover object-top opacity-60 scale-102 hover:scale-105 hover:opacity-75 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-[#171614]/40 to-transparent" />
            </div>
          ))}

          {/* Vignette Overlays for Perfect Editorial Contrast & Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-[#171614]/50 to-[#171614]/35 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#171614]/35 to-[#171614]/85 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-[#F8F6F1] space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 bg-[#B69A70]/20 border border-[#B69A70]/40 backdrop-blur-md px-4 py-1.5 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#F8F6F1]">
            <Sparkles className="w-3.5 h-3.5 text-[#B69A70]" />
            <span>The 2026 Haute Modesty Edit</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#F8F6F1] leading-[1.05]">
            Transcending Modesty <br />
            <span className="italic font-light text-[#E8DFD2]">Into High Art</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#E8DFD2]/80 font-light tracking-wide leading-relaxed">
            Hand-tailored in authentic imported Dubai Nida, French bullion wire, and Japanese crepe. Made for the modern woman of sovereign grace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-[#F8F6F1] hover:bg-[#B69A70] text-[#171614] hover:text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl"
            >
              Explore Collection
            </Link>
            <Link
              to="/shop?filter=new"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-[#F8F6F1] border border-[#F8F6F1]/40 px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300"
            >
              The Spring Lookbook
            </Link>
          </div>

          {/* Palette Selector Bar — Mocha, Burgundy, Black, Olive Green, Plum */}
          <div className="pt-6 hidden sm:flex items-center justify-center space-x-3 sm:space-x-4">
            {heroPalettes.map((palette, i) => (
              <Link
                key={i}
                to={`/shop?q=${encodeURIComponent(palette.shade)}`}
                className="inline-flex items-center space-x-1.5 bg-[#171614]/70 hover:bg-[#B69A70]/30 border border-[#B69A70]/30 backdrop-blur-xs px-2.5 py-1 text-[10px] tracking-wider uppercase text-[#E8DFD2] transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full border border-white/20"
                  style={{ backgroundColor: palette.hex }}
                />
                <span>{palette.shade}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom subtle indicator */}
        <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#E8DFD2]/60">
            Artisanal Modest Couture • Mumbai & Dubai
          </span>
        </div>
      </section>

      {/* 2. Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-[#171614]/10">
          <div className="flex items-start space-x-3.5">
            <Shield className="w-5 h-5 text-[#B69A70] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-editorial text-base uppercase tracking-wider text-[#171614]">
                100% Prime Dubai Nida
              </h4>
              <p className="text-xs text-[#171614]/65 font-light mt-1">
                Imported Grade-A textiles with fluid, wrinkle-resistant drape.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Scissors className="w-5 h-5 text-[#B69A70] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-editorial text-base uppercase tracking-wider text-[#171614]">
                Bespoke Length Tailoring
              </h4>
              <p className="text-xs text-[#171614]/65 font-light mt-1">
                Precision hem tailoring from 50" to 60" for flawless posture.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Sparkles className="w-5 h-5 text-[#B69A70] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-editorial text-base uppercase tracking-wider text-[#171614]">
                Artisan Hand Zardozi
              </h4>
              <p className="text-xs text-[#171614]/65 font-light mt-1">
                French bullion wire and genuine crystals crafted by master tailors.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Truck className="w-5 h-5 text-[#B69A70] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-editorial text-base uppercase tracking-wider text-[#171614]">
                Insured Global Delivery
              </h4>
              <p className="text-xs text-[#171614]/65 font-light mt-1">
                Complimentary express dispatch on all orders over ₹5,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories - Curated Luxury Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A70] font-semibold block mb-2">
              Curated Silhouettes
            </span>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal text-[#171614]">
              Explore by Collection
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#171614] hover:text-[#B69A70] mt-4 md:mt-0 font-medium group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brand.categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[3/4] overflow-hidden bg-[#171614] flex flex-col justify-end p-6"
            >
              <SafeImage
                src={category.heroImage}
                fallbackSrc="/images/collections/everyday-abayas.png"
                category={category.name}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-[#171614]/30 to-transparent" />

              <div className="relative z-10 space-y-1 text-[#F8F6F1]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-medium block">
                  Atelier Line
                </span>
                <h3 className="font-editorial text-2xl font-normal uppercase tracking-wider text-[#F8F6F1] group-hover:text-[#B69A70] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[#E8DFD2]/70 font-light line-clamp-2">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center space-x-1 text-[11px] uppercase tracking-wider text-[#B69A70] font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. New Season Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A70] font-semibold block mb-2">
              Fresh Off The Atelier Loom
            </span>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal text-[#171614]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#171614] hover:text-[#B69A70] mt-4 md:mt-0 font-medium group"
          >
            <span>View All New Arrivals ({newArrivals.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Editorial Brand Story & Manifesto */}
      <section className="bg-[#171614] text-[#F8F6F1] py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Editorial Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#B69A70]/30 shadow-2xl">
                <SafeImage
                  src="https://cdn.shopify.com/s/files/1/0601/2534/7980/files/Floral-SleevedBlackAbayainBoutique_1.png?v=1793181538"
                  fallbackSrc="/images/collections/embroidered-abayas.png"
                  alt="Abaya Attire Craftsmanship"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Secondary Floating Accent Card */}
              <div className="hidden sm:block absolute -bottom-8 -right-8 bg-[#F8F6F1] text-[#171614] p-6 max-w-xs shadow-2xl border border-[#B69A70]/40">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-1">
                  Pure Origins
                </span>
                <p className="font-editorial text-lg italic text-[#171614]">
                  "Modesty is not about hiding oneself; it is the deliberate elevation of dignity."
                </p>
                <span className="text-[11px] uppercase tracking-wider text-[#171614]/60 block mt-2">
                  — The Atelier Manifesto
                </span>
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#B69A70] font-semibold block">
                The House of Abaya Attire
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#F8F6F1] leading-tight">
                Architecting Grace Through Uncompromising Textile Mastery
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-[#E8DFD2]/80 font-light leading-relaxed">
                <p>
                  Founded to redefine modern luxury modest fashion, Abaya Attire Official fuses traditional Gulf silhouette heritage with contemporary international couture sensibilities.
                </p>
                <p>
                  Every garment begins with unadulterated grade-A Dubai Nida and Medina silks, woven specifically to endure warm climates while maintaining an opaque, stately drape. Our artisans spend up to 48 hours hand-crafting each beaded cuff and wire motif.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-6 border-t border-[#F8F6F1]/10">
                <div>
                  <span className="font-editorial text-3xl md:text-4xl text-[#B69A70] block">
                    100%
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#E8DFD2]/70 font-light">
                    Hand-Inspected Pieces
                  </span>
                </div>
                <div>
                  <span className="font-editorial text-3xl md:text-4xl text-[#B69A70] block">
                    18,000+
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#E8DFD2]/70 font-light">
                    Worldwide Modest Patrons
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 bg-[#B69A70] hover:bg-[#A0835B] text-[#171614] px-7 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Read The Atelier Chronicle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A70] font-semibold block mb-2">
              Client Favorites
            </span>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal text-[#171614]">
              The Bestsellers
            </h2>
          </div>
          <Link
            to="/shop?filter=bestsellers"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#171614] hover:text-[#B69A70] mt-4 md:mt-0 font-medium group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Bespoke Concierge Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8DFD2]/50 border border-[#B69A70]/30 p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
              Private Client Concierge
            </span>
            <h3 className="font-editorial text-2xl md:text-4xl text-[#171614] font-normal">
              Bespoke Bridal & Custom Length Tailoring
            </h3>
            <p className="text-xs md:text-sm text-[#171614]/75 font-light leading-relaxed">
              Seeking a custom wedding silhouette, specific length adjustment, or private trunk consultation? Connect directly with our atelier stylists on WhatsApp.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href={brand.social.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-7 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>WhatsApp Atelier</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="bg-white hover:bg-[#171614] text-[#171614] hover:text-white border border-[#171614]/20 px-7 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors text-center"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Instagram-Inspired Lookbook Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B69A70] font-semibold block">
            Visual Diary
          </span>
          <h2 className="font-editorial text-3xl md:text-4xl font-normal text-[#171614]">
            @abayaattireofficial
          </h2>
          <p className="text-xs text-[#171614]/60 font-light">
            Tag us in your moments of modest grace to be featured in the global salon.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              url: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/MonogrammedBlackAbayaPortrait_1.png?v=1793604956',
              tag: '#AbayaAttireInDubai',
            },
            {
              url: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/LayeredChocolateBrownAbayainaModernInterior.png?v=1793425764',
              tag: '#TheLayeredSilhouette',
            },
            {
              url: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/TaupeMonogramAbayaFashionPortrait.png?v=1793604880',
              tag: '#ModestGrandeur',
            },
            {
              url: 'https://cdn.shopify.com/s/files/1/0601/2534/7980/files/PlumAbayainanElegantStudio.png?v=1792487540',
              tag: '#PureMedinaSilk',
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#171614]"
            >
              <img
                src={item.url}
                alt="Abaya Attire Instagram Look"
                className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center">
                <InstagramIcon className="w-6 h-6 text-[#B69A70] mb-2" />
                <span className="text-[11px] uppercase tracking-wider font-medium">
                  {item.tag}
                </span>
                <span className="text-[10px] text-white/70 mt-1 flex items-center">
                  <span>View Post</span>
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 9. Verified Client Testimonials */}
      <section className="bg-[#E8DFD2]/30 py-16 border-y border-[#171614]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B69A70] font-semibold block mb-1">
              Testimonials
            </span>
            <h2 className="font-editorial text-2xl md:text-3xl font-normal text-[#171614]">
              Words of Modest Elegance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'The weight and drape of the Dubai Nida is beyond anything I have purchased internationally. It falls like liquid silk without clinging.',
                author: 'Dr. Soraya Al-Husseini',
                location: 'Dubai & London',
                product: 'The Royal Zahra Embroidered Abaya',
              },
              {
                quote:
                  'The custom 56" length fits exquisitely with my heels. The French bullion embroidery at the sleeves is subtle yet strikingly noble.',
                author: 'Zainab M.',
                location: 'Mumbai, India',
                product: 'Rawdah Double Shrug Cape',
              },
              {
                quote:
                  'Customer service on WhatsApp tailored my hem before dispatch and insured express shipping arrived within 3 days. Truly a five-star atelier.',
                author: 'Amina Siddiqui',
                location: 'Hyderabad, India',
                product: 'Sovereign Silk Kimono Abaya',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-white p-7 border border-[#171614]/10 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex space-x-1 text-[#B69A70]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="font-editorial text-base text-[#171614] italic leading-relaxed">
                    "{review.quote}"
                  </p>
                </div>
                <div className="border-t border-[#171614]/10 pt-3">
                  <div className="font-medium text-xs text-[#171614]">{review.author}</div>
                  <div className="text-[11px] text-[#171614]/50">{review.location}</div>
                  <div className="text-[10px] text-[#B69A70] mt-1 uppercase tracking-wider">
                    Purchased: {review.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
