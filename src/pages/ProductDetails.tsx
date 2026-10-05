import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import ProductGallery from '../components/products/ProductGallery';
import ProductInfo from '../components/products/ProductInfo';
import ProductReviews from '../components/products/ProductReviews';
import RelatedProducts from '../components/products/RelatedProducts';
import Toast from '../components/common/Toast';
import NotFound from './NotFound';

type TabKey = 'description' | 'specifications' | 'features' | 'reviews' | 'shipping' | 'warranty';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | TITANOVA`;
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return <NotFound />;
  }

  const related = getRelatedProducts(product, 4);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'features', label: 'Features' },
    { key: 'reviews', label: `Reviews (${product.reviews})` },
    { key: 'shipping', label: 'Shipping & Delivery' },
    { key: 'warranty', label: 'Warranty & Care' },
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-charcoal-400">
          <Link to="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-charcoal-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/collections/${product.collection?.toLowerCase()}`} className="hover:text-charcoal-900 transition-colors">
            {product.collection || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ProductGallery
              media={product.media}
              images={product.images}
              productName={product.name}
              product={product}
            />
          </div>

          <div className="lg:col-span-5">
            <ProductInfo product={product} onToast={msg => setToastMessage(msg)} />
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="pt-8 border-t border-charcoal-100">
          {/* Tab Navigation */}
          <div className="flex border-b border-charcoal-200 overflow-x-auto scrollbar-hide gap-1 sm:gap-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-3 sm:px-4 text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab.key
                    ? 'border-charcoal-950 text-charcoal-950'
                    : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="py-8 max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-4 text-charcoal-700 leading-relaxed font-light text-sm sm:text-base">
                <p>{product.description}</p>
                <p>
                  Handcrafted in small batches, every watch is subjected to rigorous 168-hour chronometric rate testing and water-pressure verification before it is assigned an individualized case serial number.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Movement & Calibre
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.movement}</span>
                </div>
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Case Construction
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.material}</span>
                </div>
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Bracelet & Clasp
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.strap}</span>
                </div>
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Water Resistance
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.waterResistance}</span>
                </div>
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Warranty Duration
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.warranty}</span>
                </div>
                <div className="p-4 bg-[#faf9f7] border border-charcoal-100 rounded">
                  <span className="text-charcoal-400 uppercase tracking-widest text-[10px] block mb-1">
                    Stock & Availability
                  </span>
                  <span className="font-semibold text-charcoal-900">{product.stock} pieces remaining</span>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-3 text-sm text-charcoal-700 font-light">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews
                productId={product.id}
                rating={product.rating}
                totalReviews={product.reviews}
              />
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
                <h4 className="font-serif text-base text-charcoal-950 font-normal">
                  Insured White-Glove Dispatch
                </h4>
                <p>
                  Every TITANOVA delivery is prepared in an anti-magnetic, climate-controlled vault, packaged inside our lacquered wooden presentation box, and transported via sealed armoring couriers with tamper-proof security seals.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Standard Insured Delivery:</strong> 3-5 business days across all Tier-1 and Tier-2 Indian cities.</li>
                  <li><strong>Complimentary Delivery:</strong> Auto-applied on all orders exceeding ₹10,000.</li>
                  <li><strong>Signature Required:</strong> For your security, valid OTP confirmation or photo ID required on delivery.</li>
                </ul>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-4 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
                <h4 className="font-serif text-base text-charcoal-950 font-normal">
                  2-Year International Horological Warranty
                </h4>
                <p>
                  Your TITANOVA watch is guaranteed against all manufacturing defects for 24 months from the registered date of receipt. Each watch is accompanied by an embossed warranty card matching the serialized caseback.
                </p>
                <p>
                  Warranty includes complimentary movement calibration, gasket pressure resealing, and battery replacements within the warranty period at any of our authorized service partners.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Watches */}
        <RelatedProducts products={related} onToast={msg => setToastMessage(msg)} />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
