import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types/order';
import { INITIAL_ORDERS } from '../data/demoOrders';
import { useProductStore } from './useProductStore';

interface OrderStore {
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,

      placeOrder: (order) => {
        useProductStore.getState().deductStockForOrder(order.items);
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) =>
            ord.id === orderId ? { ...ord, orderStatus: status } : ord
          ),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find((o) => o.orderNumber === orderNumber);
      },

      resetOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'bagodi_orders_v3',
    }
  )
);
