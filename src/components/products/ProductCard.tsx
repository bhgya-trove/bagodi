import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { formatINR } from '../../utils/formatCurrency';
import { useWishlistStore } from '../../store/useWishlistStore';
import { toast } from '../../store/useToastStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      toast.success(`Saved to favourites: ${product.name}`);
    } else {
      toast.info(`Removed from favourites: ${product.name}`);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-lg border border-charcoal-200 overflow-hidden shadow-subtle hover:shadow-premium transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-fashion w-full bg-charcoal-50 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={
              isHovered && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.discountPercent > 0 && (
            <span className="bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase font-sans shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge Overlay if 0 */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="bg-charcoal text-white text-xs font-bold px-3 py-1 rounded tracking-wider uppercase border border-white/20">
              Out of Stock
            </span>
          </div>
        )}

        {/* Add to Favourites Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
            isWishlisted
              ? 'bg-charcoal text-gold scale-105'
              : 'bg-white/95 text-charcoal-600 hover:text-gold hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from favourites' : 'Add to favourites'}
          title={isWishlisted ? 'In Favourites' : 'Add to Favourites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-current text-gold' : 'text-charcoal-600'
            }`}
          />
        </button>

        {/* Desktop Quick View Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex transition-all duration-200 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleQuickViewClick}
            className="w-full bg-white/95 backdrop-blur-xs text-charcoal-900 hover:bg-gold hover:text-charcoal-950 text-xs font-bold py-2 px-3 rounded shadow-md flex items-center justify-center gap-1.5 tracking-wider uppercase transition font-sans"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick Select
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col flex-1 justify-between font-sans">
        <div className="space-y-2">
          {/* Category & Stock Indicator */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-charcoal-400 uppercase tracking-widest font-semibold truncate">
              {product.category}'s {product.subcategory}
            </span>

            {/* Stock Availability */}
            {isOutOfStock ? (
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider shrink-0">
                Out of Stock
              </span>
            ) : totalStock < 5 ? (
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider shrink-0">
                Only {totalStock} left
              </span>
            ) : (
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> In Stock
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-charcoal-900 hover:text-gold transition line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Available Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] text-charcoal-400 font-medium">Sizes:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.2 bg-warmWhite border border-charcoal-200 rounded text-charcoal-700 font-mono"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Colours */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-charcoal-400 font-medium">Colours:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="w-3 h-3 rounded-full border border-charcoal-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-charcoal-500 font-semibold">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price & Actions Row */}
        <div className="pt-3 mt-2 border-t border-charcoal-100 space-y-2">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-charcoal-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] text-charcoal-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* View Details Link */}
            <Link
              to={`/product/${product.slug}`}
              className="text-[11px] font-semibold text-charcoal-700 hover:text-gold flex items-center gap-0.5 transition"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickViewClick}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
              isOutOfStock
                ? 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed'
                : 'btn-gold shadow-sm hover:shadow-md'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};