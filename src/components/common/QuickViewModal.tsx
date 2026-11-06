import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { Product, ProductColor, ProductSize } from '../../types/product';
import { formatINR } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { toast } from '../../store/useToastStore';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { addItem, setCartDrawerOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes[0] || null);
      setQuantity(1);
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor?.name && v.size === selectedSize
  );

  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock === 0;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.warning('Please select a colour.');
      return;
    }
    if (!selectedSize) {
      toast.warning('Please select a size.');
      return;
    }
    if (isOutOfStock) {
      toast.error('Selected variant is out of stock.');
      return;
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

    toast.success(`Added ${product.name} to cart.`);
    setCartDrawerOpen(true);
    onClose();
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product.id);
    if (added) {
      toast.success(`Saved to wishlist: ${product.name}`);
    } else {
      toast.info(`Removed from wishlist: ${product.name}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-float border border-charcoal-100 overflow-hidden relative max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full text-charcoal-500 hover:text-charcoal-900 shadow-sm transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media */}
        <div className="md:w-1/2 bg-warmWhite p-6 flex flex-col items-center justify-center relative">
          <div className="relative aspect-fashion w-full max-h-[420px] rounded-lg overflow-hidden bg-white shadow-sm border border-charcoal-100">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] tracking-wider uppercase font-semibold px-2 py-1 rounded">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-14 rounded overflow-hidden border-2 transition ${
                    activeImageIdx === idx ? 'border-gold scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-charcoal-400 uppercase tracking-widest mb-1 font-medium">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.subcategory}</span>
            </div>

            <h2 className="text-xl font-serif font-bold text-charcoal-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-charcoal-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-charcoal-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
                  Save {formatINR(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* Colour Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                  Colour:{' '}
                  <span className="text-charcoal-900 font-normal">
                    {selectedColor?.name}
                  </span>
                </span>
              </div>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor?.name === c.name
                        ? 'border-charcoal-900 ring-2 ring-gold/40 scale-110'
                        : 'border-charcoal-200 hover:border-charcoal-400'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor?.name === c.name && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.hex.toLowerCase() === '#ffffff' ? 'text-charcoal-900' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                  Size:{' '}
                  <span className="text-charcoal-900 font-normal">
                    {selectedSize}
                  </span>
                </span>
                <span className="text-[11px] text-charcoal-500">
                  {isOutOfStock ? (
                    <span className="text-charcoal-500 font-medium">Sold Out</span>
                  ) : (
                    <span className="text-charcoal-700 font-medium">{currentStock} available</span>
                  )}
                </span>
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
                      className={`min-w-10 px-3 py-1.5 text-xs font-medium rounded border transition ${
                        selectedSize === s
                          ? 'border-charcoal bg-charcoal text-white'
                          : isAvailable
                          ? 'border-charcoal-200 text-charcoal-800 hover:border-charcoal-400 bg-white'
                          : 'border-charcoal-100 bg-charcoal-50 text-charcoal-300 line-through cursor-not-allowed'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-charcoal-200 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-1 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-charcoal-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-1 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-charcoal-100">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 btn-gold flex items-center justify-center gap-2 text-xs uppercase tracking-wider py-3 rounded-md disabled:bg-charcoal-200 disabled:cursor-not-allowed font-bold"
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Variant Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-md border transition ${
                  isWishlisted
                    ? 'border-gold bg-gold/15 text-charcoal-900'
                    : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                }`}
                title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-gold' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-gold" />
                Bidar store delivery available
              </span>
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="text-charcoal-900 font-semibold hover:text-gold flex items-center gap-1 transition"
              >
                Full Product Details
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
