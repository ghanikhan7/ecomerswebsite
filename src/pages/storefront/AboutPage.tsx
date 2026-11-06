import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SafeImage } from '../../components/common/SafeImage';
import { ArrowRight, ArrowUpRight, Scissors, Sparkles, Shield, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { brand } = useStore();

  return (
    <div className="space-y-20 pb-24">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'The Atelier' }]} />

        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#B69A70] font-semibold block">
            Haute Modesty Atelier
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-[#171614] leading-[1.1]">
            Architecting Modest Elegance into an Heirloom Art Form
          </h1>
          <p className="text-sm md:text-base text-[#171614]/75 font-light leading-relaxed">
            Founded on the principle that modesty is the ultimate expression of sovereignty, {brand.brandName} creates artisanal abayas and modest couture that unite Gulf heritage with contemporary international luxury.
          </p>
        </div>
      </div>

      {/* Hero Image Spread - High-Res Modest Fashion Editorial */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#171614] border border-[#171614]/10 shadow-xl">
          <img
            src="/images/collections/atelier-hero.png"
            alt="Abaya Attire Haute Modesty Editorial"
            className="w-full h-full object-cover object-top opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171614]/85 via-transparent to-transparent flex flex-col justify-end p-8 sm:p-12">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B69A70] font-semibold mb-1">
              Atelier Abaya Attire • Mumbai & Dubai
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#F8F6F1] font-light max-w-2xl">
              Where Ancient Gulf Textile Traditions Meet Precision Contemporary Tailoring
            </span>
          </div>
        </div>
      </div>

      {/* Philosophy Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
              The Philosophy
            </span>
            <h2 className="font-editorial text-3xl md:text-4xl text-[#171614] leading-tight">
              Modesty as an Uncompromising Stance of Grace & Dignity
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-[#171614]/75 font-light leading-relaxed">
              <p>
                At {brand.brandName}, we reject the notion that modest fashion is a compromise. We view the abaya as one of the most noble garments ever conceived — an architectural silhouette characterized by cascading waterfall drapes, regal kimono profiles, and statuesque double shrugs.
              </p>
              <p>
                Every silhouette is drafted from scratch to achieve balanced proportions that glide effortlessly with the wearer's movement. Rather than mass-produced fast fashion, each piece is individually cut, tailored with reinforced French seams, and finished with discreet luxury magnetic closures or silk-covered buttons.
              </p>
              <p>
                Our master tailors offer bespoke length customization from 50" to 60", ensuring every patron experiences a hemline that falls with impeccable poise.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#171614] hover:text-[#B69A70] font-semibold transition-colors group"
              >
                <span>Discover The Permanent Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="group relative aspect-[3/4] overflow-hidden bg-[#171614] border border-[#171614]/10 shadow-md">
              <SafeImage
                src="https://cdn.shopify.com/s/files/1/0601/2534/7980/files/MonogrammedBlackAbayaPortrait_1.png?v=1793604956"
                fallbackSrc="/images/collections/premium-abayas.png"
                alt="Signature Noir Onyx Abaya"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] text-white tracking-widest uppercase font-light">
                  Noir Onyx • Monogrammed Atelier Cut
                </span>
              </div>
            </div>
            <div className="group relative aspect-[3/4] overflow-hidden bg-[#171614] mt-8 border border-[#171614]/10 shadow-md">
              <SafeImage
                src="https://cdn.shopify.com/s/files/1/0601/2534/7980/files/LayeredChocolateBrownAbayainaModernInterior.png?v=1793425764"
                fallbackSrc="/images/collections/double-shrug-abayas.png"
                alt="Layered Modest Couture"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] text-white tracking-widest uppercase font-light">
                  Chocolate Earth • Layered Silhouette
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Craftsmanship Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#171614]/10 pt-16">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
              The Atelier Standard
            </span>
            <h2 className="font-editorial text-3xl md:text-4xl font-normal text-[#171614]">
              Four Pillars of Modest Haute Couture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 bg-white border border-[#171614]/10 shadow-xs">
              <Scissors className="w-6 h-6 text-[#B69A70]" />
              <h4 className="font-editorial text-lg text-[#171614] uppercase tracking-wider">
                Precision Pattern Cutting
              </h4>
              <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
                Engineered with calculated flare and sleeve ratios that drape fluidly without pulling, clinging, or losing structural silhouette integrity.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white border border-[#171614]/10 shadow-xs">
              <Sparkles className="w-6 h-6 text-[#B69A70]" />
              <h4 className="font-editorial text-lg text-[#171614] uppercase tracking-wider">
                Artisanal Hand Zardozi
              </h4>
              <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
                Intricate wirework and crystal embellishments placed by master artisans with over two decades of dedicated modest couture experience.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white border border-[#171614]/10 shadow-xs">
              <Shield className="w-6 h-6 text-[#B69A70]" />
              <h4 className="font-editorial text-lg text-[#171614] uppercase tracking-wider">
                100% Opaque Assurance
              </h4>
              <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
                Every fabric roll is rigorously tested against direct backlighting to ensure complete modesty, durability, and cool-touch breathability.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white border border-[#171614]/10 shadow-xs">
              <Heart className="w-6 h-6 text-[#B69A70]" />
              <h4 className="font-editorial text-lg text-[#171614] uppercase tracking-wider">
                Bespoke Hem Tailoring
              </h4>
              <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
                Personalized sizing adjustments available for each client order to accommodate specific heights and footwear choices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Manifesto (Dark Section) */}
      <div className="bg-[#171614] text-[#F8F6F1] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
              Textile Mastery
            </span>
            <h2 className="font-editorial text-3xl md:text-4xl font-normal text-[#F8F6F1]">
              The Rare Fabrics of {brand.brandName}
            </h2>
            <p className="text-xs text-[#E8DFD2]/70 font-light">
              Carefully sourced from specialized mills in Dubai, Medina, and Japan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 space-y-3">
              <div className="font-editorial text-2xl text-[#B69A70]">01. Prime Dubai Nida</div>
              <h4 className="text-sm uppercase tracking-wider font-medium text-white">
                Grade-1 Imported Microfiber Silk
              </h4>
              <p className="text-xs text-[#E8DFD2]/70 font-light leading-relaxed">
                The gold standard of Gulf abaya tailoring. Coveted for its cool-touch hand feel, dense wrinkle-resistant drape, and graceful fluid movement that falls cleanly from the shoulder.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 space-y-3">
              <div className="font-editorial text-2xl text-[#B69A70]">02. Medina Silk & Irani Firdaus</div>
              <h4 className="text-sm uppercase tracking-wider font-medium text-white">
                Ultra-Breathable Textured Crepe
              </h4>
              <p className="text-xs text-[#E8DFD2]/70 font-light leading-relaxed">
                A breathable, matte weave engineered for warm climates without sacrificing opacity. Its subtle micro-texture creates a statuesque fall perfect for flowing kaftans and daily abayas.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 space-y-3">
              <div className="font-editorial text-2xl text-[#B69A70]">03. French Bullion & Zardozi</div>
              <h4 className="text-sm uppercase tracking-wider font-medium text-white">
                Metallic Hand-Coiled Wire & Crystals
              </h4>
              <p className="text-xs text-[#E8DFD2]/70 font-light leading-relaxed">
                Heritage metallic wirework hand-sewn onto cuffs, necklines, and borders. Catches the light with regal, understated brilliance suitable for private weddings and festive salons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Credits - AlisTech */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3 pt-8 border-t border-[#171614]/10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
          Digital Architecture
        </span>
        <h3 className="font-editorial text-2xl text-[#171614]">
          Engineered & Crafted by AlisTech
        </h3>
        <p className="text-xs text-[#171614]/65 max-w-md mx-auto leading-relaxed">
          {brand.developerCredit}. Built as an enterprise luxury e-commerce engine with reusable headless architecture, local persistence, and ready for full backend integration.
        </p>
        <div className="pt-2">
          <a
            href={brand.developerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-[#B69A70] hover:text-[#171614] font-medium uppercase tracking-wider"
          >
            <span>Visit AlisTech Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};