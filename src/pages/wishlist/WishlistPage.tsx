import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useProductStore } from '../../store/useProductStore';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product } from '../../types/product';
import { formatINR } from '../../utils/formatCurrency';
import { toast } from '../../store/useToastStore';

export const WishlistPage: React.FC = () => {
  const { items: wishlistIds, removeItem, clearWishlist } = useWishlistStore();
  const { products } = useProductStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-charcoal-100 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-charcoal-500 font-sans mt-0.5">
            {wishlistedProducts.length} favourite garments saved
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all items from your wishlist?')) {
                clearWishlist();
                toast.info('Wishlist cleared.');
              }
            }}
            className="text-xs text-charcoal-400 hover:text-rose-600 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-charcoal-900">
            Your wishlist is empty.
          </h2>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            Save items you love by tapping the heart icon on any product card while browsing our Men's, Women's, and Kids' collections.
          </p>
          <Link
            to="/shop"
            className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-6 rounded shadow-premium"
          >
            <span>Browse Fashion Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => {
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            const isOutOfStock = totalStock === 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-charcoal-200 overflow-hidden shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-fashion w-full bg-charcoal-50 overflow-hidden group">
                  <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      toast.info(`Removed ${product.name} from wishlist.`);
                    }}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 text-charcoal-500 hover:text-rose-600 hover:bg-white flex items-center justify-center shadow-sm transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Out of Stock overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <span className="bg-charcoal text-white text-xs font-bold px-3 py-1 rounded tracking-wider uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-charcoal-400 uppercase tracking-widest font-semibold block mb-1">
                      {product.category}'s {product.subcategory}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-semibold text-charcoal-900 hover:text-gold transition line-clamp-1 text-sm"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Availability */}
                    <div className="mt-1.5">
                      {isOutOfStock ? (
                        <span className="text-[11px] text-rose-600 font-bold uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : totalStock < 5 ? (
                        <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
                          Only {totalStock} left
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-charcoal-100 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-charcoal-900">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-charcoal-400 line-through">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          removeItem(product.id);
                          toast.info(`Removed ${product.name} from wishlist.`);
                        }}
                        className="btn-outline-charcoal py-2 text-[11px] rounded uppercase font-semibold text-center"
                      >
                        Remove
                      </button>

                      <button
                        onClick={() => setQuickViewProduct(product)}
                        disabled={isOutOfStock}
                        className={`py-2 text-[11px] rounded uppercase font-bold text-center flex items-center justify-center gap-1 ${
                          isOutOfStock
                            ? 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed'
                            : 'btn-gold shadow-xs'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View / Variant Select Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};