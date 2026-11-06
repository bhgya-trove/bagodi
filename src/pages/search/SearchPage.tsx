import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/products/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product } from '../../types/product';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products } = useProductStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    const q = initialQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSubcategory = p.subcategory.toLowerCase().includes(q);
      const matchFabric = p.fabric.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchColors = p.colors.some((c) => c.name.toLowerCase().includes(q));
      return (
        matchName ||
        matchCategory ||
        matchSubcategory ||
        matchFabric ||
        matchDesc ||
        matchColors
      );
    });
  }, [products, initialQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal-900">
          Search BAGODI Fashion
        </h1>
        <p className="text-xs text-charcoal-500 font-sans">
          Discover shirts, kurtis, silks, suits, and daily casual wear in Bidar.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-5 h-5 text-charcoal-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type clothing style, fabric or color..."
            className="w-full pl-12 pr-24 py-3.5 text-sm rounded-full border border-charcoal-200 focus:outline-none focus:border-gold bg-white shadow-subtle font-sans"
          />
          <button
            type="submit"
            className="absolute right-2 btn-gold text-xs py-2 px-5 rounded-full uppercase tracking-wider font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-charcoal-500 font-sans pt-1">
          <span className="font-medium text-charcoal-700">Popular:</span>
          {['Cotton Shirt', 'Chanderi Kurti', 'Saree', 'Jeans', 'Trousers', 'Linen'].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  setSearchParams({ q: term });
                }}
                className="bg-white hover:bg-gold-light/40 border border-charcoal-200 text-charcoal-800 px-3 py-1 rounded-full text-[11px] transition"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="pt-4 border-t border-charcoal-100">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-charcoal-600 font-sans">
            {initialQuery ? (
              <span>
                Found <strong>{results.length}</strong> results for "
                <strong className="text-charcoal-900">{initialQuery}</strong>"
              </span>
            ) : (
              <span>Showing all <strong>{results.length}</strong> catalogue garments</span>
            )}
          </p>

          <Link
            to="/shop"
            className="text-xs text-gold font-semibold hover:underline"
          >
            Open Filtered Catalogue →
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl border border-charcoal-100 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-charcoal-50 text-charcoal-400 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              No results found for "{initialQuery}"
            </h3>
            <p className="text-xs text-charcoal-500">
              Check the spelling, try more generic keywords (like "kurti" or "shirt"), or explore our department collections.
            </p>
            <Link
              to="/shop"
              className="btn-gold inline-flex items-center gap-2 text-xs py-2.5 px-6 rounded uppercase tracking-wider font-semibold"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

