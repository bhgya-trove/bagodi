import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Star,
  Check,
  ChevronRight,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { ProductCard } from '../../components/products/ProductCard';
import { SizeGuideModal } from '../../components/common/SizeGuideModal';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product, ProductColor, ProductSize } from '../../types/product';
import { formatINR } from '../../utils/formatCurrency';
import { toast } from '../../store/useToastStore';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { products, getProductBySlug } = useProductStore();
  const product = getProductBySlug(slug || '');

  const { addItem, setCartDrawerOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Pincode delivery simulation
  const [pincode, setPincode] = useState('585401');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(
    'Free Same-Day Delivery available for Bidar (585401)!'
  );

  const { productIds: recentlyViewedIds, addProduct: addRecentlyViewed } = useRecentlyViewedStore();

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes[0] || null);
      setQuantity(1);
      setActiveImageIdx(0);
      addRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, slug, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal-900">
          Product Not Found
        </h2>
        <p className="text-xs text-charcoal-500">
          The requested garment could not be found or has been archived from our catalogue.
        </p>
        <Link to="/shop" className="btn-gold inline-block text-xs py-2.5 px-6 rounded uppercase tracking-wider">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Variant matching
  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor?.name && v.size === selectedSize
  );

  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = (openDrawer = true) => {
    if (!selectedColor) {
      toast.warning('Please select a colour.');
      return false;
    }
    if (!selectedSize) {
      toast.warning('Please select a size.');
      return false;
    }
    if (isOutOfStock) {
      toast.error('The selected variant is currently out of stock.');
      return false;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      selectedColor,
      selectedSize,
      quantity,
      sku: currentVariant?.sku || product.sku,
      maxStock: currentStock,
    });

    toast.success(`Added ${product.name} to bag!`);
    if (openDrawer) {
      setCartDrawerOpen(true);
    }
    return true;
  };

  const handleBuyNow = () => {
    const success = handleAddToCart(false);
    if (success) {
      navigate('/checkout');
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      toast.error('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (cleanPin === '585401' || cleanPin.startsWith('585')) {
      setDeliveryResult('⚡ Express Local Delivery: Delivered within 24 hours from BAGODI Bidar Mall! (Cash on Delivery available)');
    } else {
      setDeliveryResult('🚚 Standard Express Shipping: Estimated delivery within 2–4 business days.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this beautiful ${product.name} at BAGODI Shopping Mall!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Product link copied to clipboard.');
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-400 uppercase tracking-widest mb-6 font-medium">
        <Link to="/home" className="hover:text-charcoal-900 transition">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          to={`/category/${product.category}`}
          className="hover:text-charcoal-900 transition"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-charcoal-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Media Gallery (Left) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 md:w-20 py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx
                      ? 'border-gold ring-2 ring-gold/20 scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100 bg-charcoal-50'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[3/4] bg-charcoal-50 rounded-xl overflow-hidden border border-charcoal-100 shadow-subtle group">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-charcoal text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded">
                {product.discountPercent}% OFF
              </span>
            )}

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-charcoal-600 p-2.5 rounded-full shadow-sm transition"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Attributes & Buy Box (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                SKU: {currentVariant ? currentVariant.sku : product.sku}
              </span>
              {product.rating && product.reviewCount ? (
                <div className="flex items-center gap-1.5 text-xs text-charcoal-600 font-sans">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span className="font-bold text-charcoal-900">{product.rating}</span>
                  <span className="text-charcoal-400">({product.reviewCount} reviews)</span>
                </div>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-charcoal-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-charcoal-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-xs font-semibold text-charcoal-900 bg-warmWhite border border-charcoal-200 px-2.5 py-1 rounded">
                  Save {formatINR(product.originalPrice - product.price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-charcoal-400 mt-1 font-sans">
              Inclusive of all taxes. Free express shipping in Bidar.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Colour Selection */}
          <div className="space-y-2 pt-2 border-t border-charcoal-100">
            <div className="flex justify-between items-center text-xs font-semibold text-charcoal-800 uppercase tracking-wider">
              <span>
                Colour:{' '}
                <strong className="text-charcoal-950 font-normal">
                  {selectedColor?.name}
                </strong>
              </span>
            </div>

            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedColor?.name === c.name
                      ? 'border-charcoal-900 ring-2 ring-gold/50 scale-110 shadow-sm'
                      : 'border-charcoal-200 hover:border-charcoal-400'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor?.name === c.name && (
                    <Check
                      className={`w-4 h-4 ${
                        c.hex.toLowerCase() === '#ffffff'
                          ? 'text-charcoal-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection with Real-time Variant Inventory */}
          <div className="space-y-2 pt-2 border-t border-charcoal-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal-800 uppercase tracking-wider">
                Select Size:{' '}
                <strong className="text-charcoal-950 font-normal">
                  {selectedSize}
                </strong>
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-gold font-medium hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const variant = product.variants.find(
                  (v) => v.color === selectedColor?.name && v.size === s
                );
                const stock = variant ? variant.stock : 0;
                const isAvailable = stock > 0;

                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    disabled={!isAvailable}
                    className={`min-w-12 py-2 px-3 text-xs font-medium rounded border transition flex flex-col items-center justify-center ${
                      selectedSize === s
                        ? 'border-charcoal-900 bg-charcoal text-white shadow-sm'
                        : isAvailable
                        ? 'border-charcoal-200 text-charcoal-800 hover:border-charcoal-400 bg-white'
                        : 'border-charcoal-100 bg-charcoal-50 text-charcoal-300 line-through cursor-not-allowed'
                    }`}
                  >
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>

            {/* Inventory Stock Indicator */}
            <div className="text-xs pt-1 font-medium">
              {isOutOfStock ? (
                <span className="text-charcoal-500">
                  Currently Out of Stock in {selectedColor?.name} ({selectedSize})
                </span>
              ) : currentStock <= 3 ? (
                <span className="text-gold font-bold">
                  Limited stock: {currentStock} units remaining
                </span>
              ) : (
                <span className="text-charcoal-700">
                  {currentStock} units available in Bidar store inventory
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-semibold text-charcoal-800 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-charcoal-200 rounded-md bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="px-3.5 py-1.5 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold text-charcoal-900 min-w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock || isOutOfStock}
                className="px-3.5 py-1.5 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-3">
            <div className="flex gap-3">
              <button
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock}
                className="flex-1 btn-gold flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold py-3.5 rounded shadow-premium disabled:bg-charcoal-200 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>

              <button
                onClick={() => {
                  const added = toggleWishlist(product.id);
                  if (added) toast.success(`Saved to wishlist: ${product.name}`);
                  else toast.info(`Removed from wishlist: ${product.name}`);
                }}
                className={`p-3.5 rounded border transition ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400 bg-white'
                }`}
                title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full btn-charcoal text-xs uppercase tracking-widest font-bold py-3.5 rounded shadow-sm disabled:bg-charcoal-200 disabled:cursor-not-allowed"
            >
              Buy It Now with 1-Click
            </button>
          </div>

          {/* Delivery Availability Check */}
          <div className="p-4 rounded-xl bg-warmWhite border border-charcoal-200/80 space-y-2.5 font-sans">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Check Delivery Availability in Bidar & India</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
                className="flex-1 px-3 py-2 text-xs rounded border border-charcoal-200 focus:outline-none focus:border-gold bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-charcoal text-white hover:bg-gold text-xs font-semibold rounded uppercase tracking-wider transition"
              >
                Verify
              </button>
            </form>

            {deliveryResult && (
              <p className="text-xs text-charcoal-700 font-medium leading-relaxed">
                {deliveryResult}
              </p>
            )}
          </div>

          {/* Specifications Accordion / Details */}
          <div className="pt-4 border-t border-charcoal-100 space-y-3 font-sans">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Product Specifications
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded border border-charcoal-100">
                <span className="block text-charcoal-400 text-[10px] uppercase tracking-wider">
                  Fabric
                </span>
                <span className="font-medium text-charcoal-900">{product.fabric}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-charcoal-100">
                <span className="block text-charcoal-400 text-[10px] uppercase tracking-wider">
                  Fit Type
                </span>
                <span className="font-medium text-charcoal-900">{product.fit}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-charcoal-100">
                <span className="block text-charcoal-400 text-[10px] uppercase tracking-wider">
                  Pattern
                </span>
                <span className="font-medium text-charcoal-900">{product.pattern}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-charcoal-100">
                <span className="block text-charcoal-400 text-[10px] uppercase tracking-wider">
                  Origin
                </span>
                <span className="font-medium text-charcoal-900">{product.origin}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-charcoal-100 text-xs text-charcoal-600">
              <span className="block font-semibold text-charcoal-900 mb-0.5">
                Care Instructions:
              </span>
              <span>{product.careInstructions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-charcoal-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-charcoal-900">
              You May Also Admire
            </h2>
            <Link
              to={`/category/${product.category}`}
              className="text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-gold transition flex items-center gap-1"
            >
              <span>Explore More {product.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

