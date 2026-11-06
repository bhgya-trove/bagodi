import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/demoProducts';
import { CartItem } from '../types/cart';

interface ProductStore {
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  updateVariantStock: (productId: string, sku: string, newStock: number) => void;
  deductStockForOrder: (items: CartItem[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefault: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      updateVariantStock: (productId, sku, newStock) => {
        set((state) => ({
          products: state.products.map((prod) => {
            if (prod.id !== productId) return prod;
            const updatedVariants = prod.variants.map((v) =>
              v.sku === sku ? { ...v, stock: Math.max(0, newStock) } : v
            );
            return { ...prod, variants: updatedVariants };
          }),
        }));
      },

      deductStockForOrder: (items) => {
        set((state) => ({
          products: state.products.map((prod) => {
            const purchasedItems = items.filter((item) => item.productId === prod.id);
            if (purchasedItems.length === 0) return prod;

            let updatedVariants = [...prod.variants];
            purchasedItems.forEach((cartItem) => {
              updatedVariants = updatedVariants.map((variant) => {
                if (variant.sku === cartItem.sku) {
                  return {
                    ...variant,
                    stock: Math.max(0, variant.stock - cartItem.quantity),
                  };
                }
                return variant;
              });
            });

            return { ...prod, variants: updatedVariants };
          }),
        }));
      },

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
        }));
      },

      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      resetToDefault: () => {
        set({ products: [] });
      },
    }),
    {
      name: 'bagodi_products_v4',
    }
  )
);
