import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Coupon } from '../types/cart';
import { INITIAL_COUPONS } from '../data/demoCoupons';
import { STORE_SETTINGS } from '../data/storeInfo';
import { ProductColor, ProductSize } from '../types/product';

import { useAdminStore } from './useAdminStore';

interface CartStore {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isCartDrawerOpen: boolean;

  setCartDrawerOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemVariant: (
    id: string,
    newColor: ProductColor,
    newSize: ProductSize,
    newSku: string,
    maxStock: number
  ) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;

  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryCharge: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponError: null,
      isCartDrawerOpen: false,

      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),

      addItem: (itemData) => {
        const id = `${itemData.productId}-${itemData.selectedColor.name}-${itemData.selectedSize}`;
        const existingItem = get().items.find((i) => i.id === id);

        if (existingItem) {
          const newQty = Math.min(
            existingItem.quantity + itemData.quantity,
            existingItem.maxStock
          );
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: newQty } : i
            ),
          }));
        } else {
          const newItem: CartItem = {
            ...itemData,
            id,
          };
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const safeQty = Math.min(quantity, item.maxStock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
        }));
      },

      updateItemVariant: (id, newColor, newSize, newSku, maxStock) => {
        const newId = `${id.split('-')[0]}-${newColor.name}-${newSize}`;

        set((state) => {
          const otherItems = state.items.filter((i) => i.id !== id);
          const currentItem = state.items.find((i) => i.id === id);
          if (!currentItem) return state;

          // Check if destination variant already exists in cart
          const existingTarget = otherItems.find((i) => i.id === newId);
          if (existingTarget) {
            const combinedQty = Math.min(
              existingTarget.quantity + currentItem.quantity,
              maxStock
            );
            return {
              items: otherItems.map((i) =>
                i.id === newId ? { ...i, quantity: combinedQty } : i
              ),
            };
          }

          const updatedItem: CartItem = {
            ...currentItem,
            id: newId,
            selectedColor: newColor,
            selectedSize: newSize,
            sku: newSku,
            maxStock,
            quantity: Math.min(currentItem.quantity, maxStock),
          };

          return {
            items: [...otherItems, updatedItem],
          };
        });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        // Look up in admin coupons
        const adminCoupons = useAdminStore.getState().coupons || [];
        const allCoupons = [...INITIAL_COUPONS, ...adminCoupons];
        const found = allCoupons.find(
          (c) => c.code.toUpperCase() === cleanCode && c.isActive
        );

        if (!found) {
          set({ couponError: 'Invalid or expired coupon code.' });
          return { success: false, message: 'Invalid or expired coupon code.' };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < found.minOrderValue) {
          const msg = `This coupon requires a minimum cart value of ₹${found.minOrderValue}.`;
          set({ couponError: msg });
          return { success: false, message: msg };
        }

        set({ appliedCoupon: found, couponError: null });
        return {
          success: true,
          message: `Coupon ${found.code} applied successfully! You save ${found.discountPercent}%.`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, couponError: null });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponError: null });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        const subtotal = get().getSubtotal();
        const calculatedDiscount = Math.round(
          (subtotal * appliedCoupon.discountPercent) / 100
        );
        if (appliedCoupon.maxDiscount) {
          return Math.min(calculatedDiscount, appliedCoupon.maxDiscount);
        }
        return calculatedDiscount;
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= STORE_SETTINGS.freeShippingThreshold
          ? 0
          : STORE_SETTINGS.standardShippingFee;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const delivery = get().getDeliveryCharge();
        return Math.max(0, subtotal - discount + delivery);
      },
    }),
    {
      name: 'bagodi_cart_v3',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);

