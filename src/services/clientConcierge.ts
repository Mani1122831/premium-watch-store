import { products } from '../data/products';
import { Product } from '../types/product';

export interface ConciergeResponse {
  message: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category?: string;
    gender?: string;
    collection?: string;
    description?: string;
    image: string;
    movement?: string;
    material?: string;
    features?: string[];
    rating?: number;
  }>;
}

function mapProductToChatCard(p: Product) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    gender: p.gender,
    collection: p.collection,
    description: p.description,
    image: p.images?.[0] || '/images/watches/hero-watch.jpg',
    movement: p.movement,
    material: p.material,
    features: p.features,
    rating: p.rating,
  };
}

export function queryClientConcierge(query: string): ConciergeResponse {
  const q = query.toLowerCase().trim();

  // 1. Warranty Inquiry
  if (q.includes('warranty') || q.includes('guarantee')) {
    return {
      message:
        'Every TITANOVA timepiece is covered by our complimentary 2-Year International Atelier Warranty. This guarantees the precision calibration of the movement, calibre mechanics, and structural casing integrity. Each watch arrives with an individually serial-numbered warranty certificate.',
      products: products.filter(p => p.isFeatured).slice(0, 2).map(mapProductToChatCard),
    };
  }

  // 2. Shipping & Delivery
  if (q.includes('shipping') || q.includes('delivery') || q.includes('return') || q.includes('dispatch')) {
    return {
      message:
        'We provide complimentary, tamper-evident insured delivery across India on all orders exceeding ₹10,000. Orders are dispatched from our Mumbai atelier within 24 hours via express courier with signature verification upon delivery. We also offer a 30-day effortless return policy.',
      products: products.filter(p => p.isBestSeller).slice(0, 2).map(mapProductToChatCard),
    };
  }

  // 3. Movement Comparison: Automatic vs Quartz
  if (q.includes('automatic') && q.includes('quartz') || q.includes('compare')) {
    const autoWatch = products.find(p => p.category.toLowerCase() === 'automatic');
    const quartzWatch = products.find(p => p.category.toLowerCase() === 'analog');
    const matched = [autoWatch, quartzWatch].filter(Boolean) as Product[];

    return {
      message:
        'Automatic movements are self-winding mechanical calibres powered naturally by the kinetic motion of your wrist, celebrated for their exhibition casebacks and sweeping second hands. Quartz calibres utilize battery-regulated quartz crystals for extreme grab-and-go precision and slimmer case profiles.',
      products: matched.map(mapProductToChatCard),
    };
  }

  // 4. Specific Product Inquiry
  const specificMatch = products.find(
    p => q.includes(p.name.toLowerCase()) || q.includes(p.id.toLowerCase())
  );
  if (specificMatch) {
    return {
      message: `The ${specificMatch.name} is an exceptional timepiece from our ${specificMatch.collection || 'Atelier'} collection. Featuring ${specificMatch.movement}, ${specificMatch.material}, and ${specificMatch.waterResistance} water resistance, it exemplifies our pursuit of horological refinement.`,
      products: [mapProductToChatCard(specificMatch)],
    };
  }

  // 5. Price filtering (e.g., under 30000, under ₹30,000, under 20k)
  const priceUnderMatch = q.match(/under\s*(?:rs\.?|₹)?\s*(\d+)(?:k|000)?/i);
  let maxPrice: number | null = null;
  if (priceUnderMatch) {
    const rawVal = priceUnderMatch[1];
    maxPrice = parseInt(rawVal, 10);
    if (q.includes(rawVal + 'k')) {
      maxPrice = maxPrice * 1000;
    } else if (maxPrice < 100) {
      maxPrice = maxPrice * 1000;
    }
  } else if (q.includes('budget') || q.includes('affordable')) {
    maxPrice = 25000;
  }

  let candidates: Product[] = [...products];

  if (maxPrice !== null) {
    candidates = candidates.filter(p => p.price <= (maxPrice as number));
  }

  // 6. Keywords Filtering
  if (q.includes('gold')) {
    candidates = candidates.filter(
      p =>
        p.material.toLowerCase().includes('gold') ||
        p.name.toLowerCase().includes('gold') ||
        p.description.toLowerCase().includes('gold')
    );
  } else if (q.includes('smart')) {
    candidates = candidates.filter(
      p => p.category.toLowerCase().includes('smart') || p.name.toLowerCase().includes('smart')
    );
  } else if (q.includes('automatic')) {
    candidates = candidates.filter(
      p => p.category.toLowerCase().includes('automatic') || p.movement.toLowerCase().includes('automatic')
    );
  } else if (q.includes('chrono')) {
    candidates = candidates.filter(
      p => p.category.toLowerCase().includes('chronograph') || p.movement.toLowerCase().includes('chronograph')
    );
  } else if (q.includes('diver') || q.includes('water')) {
    candidates = candidates.filter(
      p => p.name.toLowerCase().includes('diver') || p.waterResistance.includes('100m') || p.waterResistance.includes('200m')
    );
  } else if (q.includes('office') || q.includes('work') || q.includes('formal') || q.includes('business')) {
    candidates = candidates.filter(
      p =>
        p.category === 'Minimal' ||
        p.category === 'Analog' ||
        p.name.includes('Classic') ||
        p.name.includes('Urban')
    );
  } else if (q.includes('women') || q.includes('ladies') || q.includes('female')) {
    candidates = candidates.filter(p => p.gender === 'women');
  } else if (q.includes('men') || q.includes('gentleman') || q.includes('male')) {
    candidates = candidates.filter(p => p.gender === 'men');
  }

  // Fallback if empty
  if (candidates.length === 0) {
    candidates = products.filter(p => p.isFeatured || p.isBestSeller);
  }

  const selectedProducts = candidates.slice(0, 3).map(mapProductToChatCard);

  let introMessage = 'I have curated these distinguished selections from our atelier for you:';
  if (q.includes('gold')) {
    introMessage = 'Our gold timepieces showcase 18K Gold PVD craftsmanship, sapphire crystal glass, and regal presence:';
  } else if (maxPrice) {
    introMessage = `Here are our finest handcrafted timepieces under ₹${maxPrice.toLocaleString('en-IN')}:`;
  } else if (q.includes('office') || q.includes('formal')) {
    introMessage = 'For business and professional elegance, these understated classics balance sophistication and presence:';
  } else if (q.includes('smart')) {
    introMessage = 'Blending aerospace-grade metallurgy with smart connectivity, here are our luxury connected timepieces:';
  } else if (q.includes('women')) {
    introMessage = 'Delicate profiles, mother-of-pearl accents, and exquisite proportions define our women\'s collection:';
  } else if (q.includes('men')) {
    introMessage = 'Engineered with commanding dials and robust Swiss & Japanese calibres, here are our men\'s references:';
  }

  return {
    message: introMessage,
    products: selectedProducts,
  };
}
