import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedStore {
  productIds: string[];
  addProduct: (id: string) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      productIds: [],
      addProduct: (id: string) => {
        set((state) => {
          const filtered = state.productIds.filter((pId) => pId !== id);
          return {
            productIds: [id, ...filtered].slice(0, 8),
          };
        });
      },
      clearRecentlyViewed: () => set({ productIds: [] }),
    }),
    {
      name: 'bagodi_recently_viewed_v2',
    }
  )
);

