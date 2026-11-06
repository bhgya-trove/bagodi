import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/products/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Product, ProductSize, MainCategory } from '../../types/product';
import { formatINR } from '../../utils/formatCurrency';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: pathCategory } = useParams<{ category?: string }>();
  const { products } = useProductStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active category: from URL path or param
  const activeCategory = (pathCategory || searchParams.get('category') || 'all') as string;
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('newest');

  const allSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // Filter products by selected criteria
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter: strictly men, women, kids
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }

        // Price filter
        if (p.price > maxPrice) return false;

        // Size filter
        if (
          selectedSizes.length > 0 &&
          !selectedSizes.some((s) => p.sizes.includes(s))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, activeCategory, maxPrice, selectedSizes, sortBy]);

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setMaxPrice(10000);
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = selectedSizes.length + (maxPrice < 10000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Title & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-charcoal-400 uppercase tracking-widest mb-1">
            <Link to="/home" className="hover:text-charcoal-900">Home</Link>
            <span>/</span>
            <span className="text-charcoal-800 font-bold uppercase">
              {activeCategory === 'all' ? 'All Garments' : `${activeCategory}'s Clothing`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            {activeCategory === 'men'
              ? "Men's Collection"
              : activeCategory === 'women'
              ? "Women's Collection"
              : activeCategory === 'kids'
              ? "Kids' Collection"
              : 'Garment Catalogue'}
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {filteredProducts.length} items available in store
          </p>
        </div>

        {/* Sort & Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold py-2 px-3.5 rounded border border-charcoal-200 bg-white"
          >
            <Filter className="w-3.5 h-3.5 text-gold" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-charcoal-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 text-xs border border-charcoal-200 rounded bg-white text-charcoal-900 font-medium focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6">
          {/* Category Tabs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Department
            </h4>
            <div className="space-y-1 text-xs">
              {[
                { label: 'All Garments', val: 'all', path: '/shop' },
                { label: "Men's Clothing", val: 'men', path: '/category/men' },
                { label: "Women's Clothing", val: 'women', path: '/category/women' },
                { label: "Kids' Clothing", val: 'kids', path: '/category/kids' },
              ].map((c) => (
                <Link
                  key={c.val}
                  to={c.path}
                  className={`block py-1.5 px-2.5 rounded transition ${
                    activeCategory === c.val
                      ? 'bg-charcoal text-white font-bold'
                      : 'text-charcoal-700 hover:bg-warmWhite'
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-charcoal-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Available Sizes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                      } else {
                        setSelectedSizes([...selectedSizes, sz]);
                      }
                    }}
                    className={`min-w-9 px-2 py-1 text-xs font-medium rounded border transition ${
                      isSelected
                        ? 'border-charcoal-900 bg-charcoal text-white'
                        : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-4 border-t border-charcoal-200">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-charcoal-900">
              <span>Max Price</span>
              <span className="text-gold font-sans">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1 pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-charcoal-200 p-12 text-center space-y-3">
              <h3 className="font-serif font-bold text-xl text-charcoal-900">
                No products available at the moment.
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
                There are currently no items matching your criteria. Genuine store inventory is added directly by BAGODI store administrators in Bidar.
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="btn-gold text-xs py-2 px-5 rounded font-bold uppercase tracking-wider mt-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 flex flex-col justify-between z-50">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-200">
                <h3 className="font-serif font-bold text-lg text-charcoal-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-charcoal-500" />
                </button>
              </div>

              {/* Department */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-charcoal-900">Department</h4>
                <div className="space-y-1">
                  {[
                    { label: 'All Garments', val: 'all', path: '/shop' },
                    { label: "Men's Clothing", val: 'men', path: '/category/men' },
                    { label: "Women's Clothing", val: 'women', path: '/category/women' },
                    { label: "Kids' Clothing", val: 'kids', path: '/category/kids' },
                  ].map((c) => (
                    <Link
                      key={c.val}
                      to={c.path}
                      onClick={() => setMobileFilterOpen(false)}
                      className={`block py-2 px-3 rounded ${
                        activeCategory === c.val
                          ? 'bg-charcoal text-white font-bold'
                          : 'text-charcoal-800 hover:bg-warmWhite'
                      }`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2 text-xs pt-4 border-t border-charcoal-200">
                <h4 className="font-bold uppercase tracking-wider text-charcoal-900">Sizes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                          } else {
                            setSelectedSizes([...selectedSizes, sz]);
                          }
                        }}
                        className={`min-w-9 px-2 py-1 text-xs rounded border ${
                          isSelected
                            ? 'bg-charcoal text-white'
                            : 'bg-white text-charcoal-700 border-charcoal-200'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full btn-gold text-xs py-2.5 rounded font-bold uppercase"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
