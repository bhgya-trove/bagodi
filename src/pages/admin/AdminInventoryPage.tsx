import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Edit2,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { formatINR } from '../../utils/formatCurrency';
import { toast } from '../../store/useToastStore';

export const AdminInventoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const { products, updateVariantStock } = useProductStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>(
    initialFilter === 'low' ? 'low' : 'all'
  );
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  // Flatten all variants with product metadata
  const allVariants = useMemo(() => {
    return products.flatMap((product) =>
      product.variants.map((v) => ({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        category: product.category,
        subcategory: product.subcategory,
        image: product.images[0],
        price: product.price,
        sku: v.sku,
        color: v.color,
        size: v.size,
        stock: v.stock,
      }))
    );
  }, [products]);

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return allVariants.filter((item) => {
      // Stock status filter
      if (stockFilter === 'low' && item.stock > 3) return false;
      if (stockFilter === 'out' && item.stock !== 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchName = item.productName.toLowerCase().includes(q);
        const matchColor = item.color.toLowerCase().includes(q);
        const matchSize = item.size.toLowerCase().includes(q);
        return matchSku || matchName || matchColor || matchSize;
      }

      return true;
    });
  }, [allVariants, stockFilter, searchQuery]);

  const handleQuickAddStock = (
    productId: string,
    sku: string,
    currentStock: number,
    addition: number
  ) => {
    const newStock = Math.max(0, currentStock + addition);
    updateVariantStock(productId, sku, newStock);
    toast.success(`Updated SKU ${sku} to ${newStock} units.`);
  };

  const handleSaveCustomStock = (productId: string, sku: string) => {
    updateVariantStock(productId, sku, Math.max(0, editStockValue));
    setEditingSku(null);
    toast.success(`Updated SKU ${sku} stock to ${Math.max(0, editStockValue)} units.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-gold">
              Stock Control
            </span>
            <span className="text-[10px] bg-charcoal text-white font-mono px-2 py-0.5 rounded">
              Size Matrix Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Size & Colour Variant Stock
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Every garment size and colour combination maintains independent stock levels.
          </p>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-400 font-semibold uppercase">
              Total Managed Variants
            </span>
            <p className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">
              {allVariants.length} Combinations
            </p>
          </div>
          <Boxes className="w-8 h-8 text-gold" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-semibold uppercase">
              Low Stock Variants (≤ 3)
            </span>
            <p className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">
              {allVariants.filter((v) => v.stock <= 3 && v.stock > 0).length} Variants
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-gold" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-semibold uppercase">
              Out of Stock (0 units)
            </span>
            <p className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">
              {allVariants.filter((v) => v.stock === 0).length} Variants
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-charcoal-100 text-charcoal-800 flex items-center justify-center font-bold text-sm">
            0
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, Product, Size or Colour..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              stockFilter === 'all'
                ? 'bg-charcoal text-white'
                : 'bg-warmWhite text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
            }`}
          >
            All Variants ({allVariants.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              stockFilter === 'low'
                ? 'bg-gold text-charcoal-950 font-bold'
                : 'bg-warmWhite text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock ({allVariants.filter((v) => v.stock <= 3 && v.stock > 0).length})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              stockFilter === 'out'
                ? 'bg-charcoal text-white font-bold'
                : 'bg-warmWhite text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
            }`}
          >
            Out of Stock ({allVariants.filter((v) => v.stock === 0).length})
          </button>
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="bg-white rounded-xl border border-charcoal-100 shadow-subtle overflow-hidden">
        {allVariants.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 space-y-2">
            <Boxes className="w-10 h-10 text-charcoal-300 mx-auto" />
            <p className="font-medium text-charcoal-700 text-sm">No inventory records found.</p>
            <p className="text-charcoal-400">
              Add garments in the Products section to automatically generate size and colour inventory rows.
            </p>
          </div>
        ) : filteredVariants.length === 0 ? (
          <div className="p-8 text-center text-charcoal-500 text-xs">
            No variants match your search or filter condition.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-charcoal-50/70 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-200">
                  <th className="py-3 px-4">Garment / Style</th>
                  <th className="py-3 px-4">Variant SKU</th>
                  <th className="py-3 px-4">Colour</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Restock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                {filteredVariants.map((item) => {
                  const isLow = item.stock <= 3 && item.stock > 0;
                  const isOut = item.stock === 0;
                  const isEditing = editingSku === item.sku;

                  return (
                    <tr
                      key={item.sku}
                      className="hover:bg-charcoal-50/50 transition"
                    >
                      {/* Style / Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-12 rounded object-cover border border-charcoal-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-charcoal-900 line-clamp-1">
                              {item.productName}
                            </p>
                            <span className="text-[10px] text-charcoal-400 uppercase tracking-wider">
                              {item.category} • {item.subcategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-bold text-charcoal-700">
                        {item.sku}
                      </td>

                      {/* Colour */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-charcoal-900">
                          {item.color}
                        </span>
                      </td>

                      {/* Size */}
                      <td className="py-3 px-4">
                        <span className="inline-block bg-charcoal-100 text-charcoal-900 font-bold px-2 py-0.5 rounded text-xs">
                          {item.size}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-medium text-charcoal-900">
                        {formatINR(item.price)}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(Number(e.target.value))}
                              className="w-16 p-1 text-xs border border-charcoal-300 rounded font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveCustomStock(item.productId, item.sku)}
                              className="p-1 bg-charcoal text-white rounded hover:bg-gold hover:text-charcoal-950"
                              title="Save"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-sm font-bold ${
                                isOut
                                  ? 'text-charcoal-400'
                                  : isLow
                                  ? 'text-gold'
                                  : 'text-charcoal-950'
                              }`}
                            >
                              {item.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingSku(item.sku);
                                setEditStockValue(item.stock);
                              }}
                              className="text-charcoal-300 hover:text-charcoal-700 p-0.5"
                              title="Edit exact stock"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="bg-charcoal-100 text-charcoal-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-gold/20 text-charcoal-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gold/40">
                            Low Stock ({item.stock})
                          </span>
                        ) : (
                          <span className="bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Available ({item.stock})
                          </span>
                        )}
                      </td>

                      {/* Quick Restock Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleQuickAddStock(item.productId, item.sku, item.stock, 5)
                            }
                            className="px-2 py-1 rounded bg-charcoal-50 hover:bg-gold hover:text-charcoal-950 border border-charcoal-200 text-[11px] font-bold transition"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() =>
                              handleQuickAddStock(item.productId, item.sku, item.stock, 10)
                            }
                            className="px-2 py-1 rounded bg-charcoal-50 hover:bg-gold hover:text-charcoal-950 border border-charcoal-200 text-[11px] font-bold transition"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          {item.stock > 0 && (
                            <button
                              onClick={() =>
                                handleQuickAddStock(item.productId, item.sku, item.stock, -1)
                              }
                              className="px-2 py-1 rounded bg-charcoal-50 hover:bg-charcoal-200 text-charcoal-700 border border-charcoal-200 text-[11px] font-bold transition"
                              title="Decrement 1 unit"
                            >
                              -1
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
