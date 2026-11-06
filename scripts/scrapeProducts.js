import fs from 'fs';

async function main() {
  console.log('Fetching products from ovaisabayacollection.in...');
  const res = await fetch('https://ovaisabayacollection.in/products.json?limit=250');
  const data = await res.json();
  const rawList = data.products.filter(p => p.images && p.images.length > 0).slice(0, 100);
  console.log(`Fetched ${rawList.length} products with valid photography.`);

  const colorMap = {
    'WHITE': '#FFFFFF',
    'BLACK': '#171614',
    'NUDE': '#D2BA9C',
    'BROWN': '#6A564A',
    'DARK GRAY': '#4A4A4A',
    'GRAY': '#7A7A7A',
    'SLASH GRAY': '#686868',
    'BABY PINK': '#EBB6C2',
    'DUSTY PINK': '#CFA3AD',
    'GOLDEN': '#D4AF37',
    'COLLER BROWN': '#5C4033',
    'COFFEE': '#4B3621',
    'FLAMINGO': '#F07D8B',
    'MAROON': '#800000',
    'WINE': '#581825',
    'BLUE': '#1E3A8A',
    'NAVY': '#1B2A4A',
    'SEA GREEN': '#2E8B57',
    'LAVENDER': '#9F8CB8',
    'MAUVE': '#8C7782',
    'RUST': '#B7410E',
    'BURGUNDY': '#540D1E',
    'OLIVE': '#4B5242',
    'BEIGE': '#D9CDB8',
    'CREAM': '#F5F2EB',
    'TEAL': '#005F60'
  };

  const getCategory = (title, type) => {
    const t = (title + ' ' + (type || '')).toUpperCase();
    if (t.includes('DOUBLE SHRUG') || t.includes('DS ')) return 'Double Shrug Abayas';
    if (t.includes('FRONT OPEN') || t.includes('OPEN ')) return 'Front Open Abayas';
    if (t.includes('KAFTAN')) return 'Kaftans';
    if (t.includes('EMBROIDERY') || t.includes('EMBROIDERED') || t.includes('HANDWORK') || t.includes('LACE')) return 'Embroidered Abayas';
    if (t.includes('LAYER') || t.includes('TIER')) return '3 Layer Abayas';
    if (t.includes('KIMONO')) return 'Kimono Abayas';
    if (t.includes('KHIMAR') || t.includes('HIJAB')) return 'Khimars';
    if (t.includes('PASHMINA') || t.includes('SILK') || t.includes('NIDA') || t.includes('PREMIUM')) return 'Premium Abayas';
    return 'Everyday Abayas';
  };

  const cleanDescription = (html) => {
    if (!html) return 'Elevate your modest wardrobe with this beautifully designed abaya, crafted from premium imported fabric for a comfortable feel, graceful fall, and sophisticated finish.';
    let text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 280) text = text.substring(0, 277) + '...';
    return text;
  };

  const products = rawList.map((p, idx) => {
    const title = p.title.trim();
    let colorName = 'Noir Black';
    if (title.includes('|')) {
      colorName = title.split('|')[1].trim();
    } else if (title.includes('-') && !title.toUpperCase().includes('SHADE')) {
      colorName = title.split('-')[1].trim();
    } else if (title.toUpperCase().includes('SHADE')) {
      colorName = 'Earth Shade ' + (idx % 12 + 1);
    }
    
    const upperCol = colorName.toUpperCase();
    let hex = '#171614';
    for (const [k, v] of Object.entries(colorMap)) {
      if (upperCol.includes(k)) {
        hex = v;
        break;
      }
    }

    const category = getCategory(p.title, p.product_type);
    const firstVariant = p.variants?.[0] || {};
    const price = firstVariant.price ? Math.round(parseFloat(firstVariant.price)) : 1899;
    const originalPrice = firstVariant.compare_at_price ? Math.round(parseFloat(firstVariant.compare_at_price)) : Math.round(price * 1.5);
    
    const sizes = ['50', '52', '54', '56', '58', '60'];
    const stockMatrix = {
      [colorName]: {
        '50': (idx % 5) + 3,
        '52': (idx % 7) + 5,
        '54': (idx % 6) + 8,
        '56': (idx % 8) + 6,
        '58': (idx % 4) + 2,
        '60': (idx % 3) + 1,
      }
    };
    const totalStock = Object.values(stockMatrix[colorName]).reduce((a, b) => a + b, 0);

    const isNew = idx < 25;
    const isBestseller = idx % 3 === 0;
    const isFeatured = idx % 4 === 0;

    let badge = undefined;
    if (idx % 7 === 0) badge = 'Bestseller';
    else if (idx % 5 === 0) badge = 'New Season';
    else if (idx % 9 === 0) badge = 'Trending';
    else if (idx % 11 === 0) badge = 'Premium Nida';

    return {
      id: 'prod-' + p.id,
      sku: 'AA-' + String(p.id).slice(-6),
      name: title,
      category,
      price,
      originalPrice,
      description: cleanDescription(p.body_html),
      fabricDetails: 'Prime Imported Fabric / Dubai Nida, cool-touch, graceful fall, and elegant silhouette.',
      careInstructions: 'Shampoo Wash or Specialist Dry Clean. Do not bleach. Cool iron on reverse side.',
      images: p.images.map(img => img.src),
      colors: [{ name: colorName, hex }],
      sizes,
      stockMatrix,
      totalStock,
      isFeatured,
      isNewArrival: isNew,
      isBestseller,
      isPublished: true,
      badge,
      rating: +(4.6 + (idx % 5) * 0.08).toFixed(1),
      reviewCount: 15 + (idx % 45) * 2,
      createdAt: p.created_at || new Date().toISOString()
    };
  });

  const fileContent = 'import type { Product } from "../types";\n\nexport const initialProducts: Product[] = ' + JSON.stringify(products, null, 2) + ';\n';
  fs.writeFileSync('src/data/initialProducts.ts', fileContent, 'utf8');
  console.log(`Successfully generated src/data/initialProducts.ts with ${products.length} products.`);
}

main().catch(err => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
