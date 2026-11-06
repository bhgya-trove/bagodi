import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // product IDs
  toggleWishlist: (productId: string) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [], // empty by default; genuine items added by user actions

      toggleWishlist: (productId) => {
        const exists = get().items.includes(productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((id) => id !== productId),
          }));
          return false;
        } else {
          set((state) => ({
            items: [...state.items, productId],
          }));
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'bagodi_wishlist_v3',
    }
  )
);

