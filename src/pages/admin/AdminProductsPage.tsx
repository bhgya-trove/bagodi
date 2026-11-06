import React, { useState } from 'react';
import {
  Shirt,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Boxes,
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { formatINR } from '../../utils/formatCurrency';
import { Product, MainCategory, SubCategory } from '../../types/product';
import { toast } from '../../store/useToastStore';

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MainCategory>('men');
  const [formSubcategory, setFormSubcategory] = useState<SubCategory>('Shirts');
  const [formPrice, setFormPrice] = useState(1299);
  const [formOriginalPrice, setFormOriginalPrice] = useState(1999);
  const [formFabric, setFormFabric] = useState('100% Fine Combed Cotton');
  const [formFit, setFormFit] = useState('Tailored Fit');
  const [formDescription, setFormDescription] = useState('Quality garment crafted for elegance.');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80');

  const filtered = products.filter((p) => {
    if (selectedDept !== 'all' && p.category !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory('men');
    setFormSubcategory('Shirts');
    setFormPrice(1299);
    setFormOriginalPrice(1999);
    setFormFabric('100% Fine Cotton');
    setFormFit('Contemporary Fit');
    setFormDescription('Crafted for everyday sophistication in Bidar.');
    setFormImageUrl('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80');
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormFabric(p.fabric);
    setFormFit(p.fit);
    setFormDescription(p.description);
    setFormImageUrl(p.images[0]);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Product title is required.');
      return;
    }

    const discountPercent = Math.round(
      ((formOriginalPrice - formPrice) / formOriginalPrice) * 100
    );

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        subcategory: formSubcategory,
        price: formPrice,
        originalPrice: formOriginalPrice,
        discountPercent: Math.max(0, discountPercent),
        fabric: formFabric,
        fit: formFit,
        description: formDescription,
        images: [formImageUrl, ...editingProduct.images.slice(1)],
      });
      toast.success(`Updated "${formName}".`);
    } else {
      const newId = `prod-${Date.now()}`;
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const sku = `BAG-${formCategory.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

      // Generate initial size variants
      const sizes = ['S', 'M', 'L', 'XL'] as const;
      const initialVariants = sizes.map((sz) => ({
        sku: `${sku}-WHT-${sz}`,
        color: 'Classic White',
        size: sz,
        stock: 10,
      }));

      const newProd: Product = {
        id: newId,
        slug,
        sku,
        name: formName,
        category: formCategory,
        subcategory: formSubcategory,
        price: formPrice,
        originalPrice: formOriginalPrice,
        discountPercent: Math.max(0, discountPercent),
        description: formDescription,
        fabric: formFabric,
        fit: formFit,
        pattern: 'Solid Finish',
        careInstructions: 'Machine wash warm, iron medium',
        origin: 'Crafted in Karnataka, India',
        images: [formImageUrl],
        colors: [{ name: 'Classic White', hex: '#FFFFFF' }],
        sizes: ['S', 'M', 'L', 'XL'],
        variants: initialVariants,
        isNewArrival: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      addProduct(newProd);
      toast.success(`Added new product "${formName}".`);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from store catalogue?`)) {
      deleteProduct(id);
      toast.info(`Deleted "${name}".`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            Catalogue Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Product Catalogue & Styles
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Add garments, configure prices, and organize categories for BAGODI Mall.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-gold flex items-center gap-2 text-xs py-2.5 px-5 rounded font-bold uppercase tracking-wider shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, SKU, or category..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-charcoal-400 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-2 rounded border border-charcoal-200 bg-white font-medium text-charcoal-800"
          >
            <option value="all">All Departments ({products.length})</option>
            <option value="men">Men's Fashion</option>
            <option value="women">Women's Fashion</option>
            <option value="kids">Kids' Fashion</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-charcoal-100 shadow-subtle overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 space-y-3">
            <Shirt className="w-10 h-10 text-charcoal-300 mx-auto" />
            <p className="font-medium text-charcoal-700 text-sm">No products found in catalogue.</p>
            <p className="text-charcoal-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Click "Add New Product" to list your first style.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="btn-gold inline-flex items-center gap-1.5 text-xs py-2 px-4 rounded font-bold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Garment</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-charcoal-50/70 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-200">
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Master SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Colors / Sizes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                {filtered.map((prod) => {
                  const totalStock = prod.variants.reduce((s, v) => s + v.stock, 0);

                  return (
                    <tr key={prod.id} className="hover:bg-charcoal-50/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt=""
                            className="w-10 h-12 rounded object-cover border border-charcoal-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-charcoal-900 line-clamp-1">
                              {prod.name}
                            </p>
                            <span className="text-[10px] text-charcoal-400">
                              {prod.fabric}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-charcoal-800">
                        {prod.sku}
                      </td>

                      <td className="py-3 px-4">
                        <span className="uppercase text-[10px] tracking-wider font-semibold text-charcoal-600 block">
                          {prod.category}
                        </span>
                        <span className="text-charcoal-400 text-[11px]">
                          {prod.subcategory}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <strong className="text-charcoal-900 text-sm block">
                          {formatINR(prod.price)}
                        </strong>
                        {prod.originalPrice > prod.price && (
                          <span className="text-[11px] text-charcoal-400 line-through">
                            {formatINR(prod.originalPrice)} ({prod.discountPercent}% off)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-xs ${
                            totalStock === 0
                              ? 'text-charcoal-400'
                              : totalStock <= 5
                              ? 'text-gold'
                              : 'text-charcoal-900'
                          }`}
                        >
                          {totalStock} units
                        </span>
                        <span className="text-[10px] text-charcoal-400 block">
                          across {prod.variants.length} variants
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[11px]">
                          <span>{prod.colors.length} colour(s)</span>
                          <span className="mx-1">•</span>
                          <span>{prod.sizes.join(', ')}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 rounded hover:bg-charcoal-100 text-charcoal-600 hover:text-charcoal-900"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded hover:bg-charcoal-100 text-charcoal-400 hover:text-charcoal-900"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-float border border-charcoal-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <h3 className="font-serif font-bold text-xl text-charcoal-900">
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalogue'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-charcoal-400 hover:text-charcoal-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Pure Cotton Formal Shirt"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MainCategory)}
                    className="w-full p-2.5 rounded border border-charcoal-200 bg-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Subcategory *
                  </label>
                  <select
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value as SubCategory)}
                    className="w-full p-2.5 rounded border border-charcoal-200 bg-white"
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Sarees">Sarees</option>
                    <option value="T-shirts">T-shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Casual Wear">Casual Wear</option>
                    <option value="Boys Clothing">Boys Clothing</option>
                    <option value="Girls Clothing">Girls Clothing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Selling Price (INR) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Original Price (INR) *
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full p-2.5 rounded border border-charcoal-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Fit Type
                  </label>
                  <input
                    type="text"
                    value={formFit}
                    onChange={(e) => setFormFit(e.target.value)}
                    className="w-full p-2.5 rounded border border-charcoal-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded border border-charcoal-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded border border-charcoal-200 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline-charcoal text-xs py-2 px-5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2.5 px-6 rounded font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
