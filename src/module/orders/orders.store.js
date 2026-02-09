import { create } from "zustand";

export const useOrdersStore = create((set) => ({
  orders: JSON.parse(localStorage.getItem("kot_orders") || "[]"),

  addOrder: (order) => {
    set((state) => {
      const newOrders = [...state.orders, order];
      localStorage.setItem("kot_orders", JSON.stringify(newOrders));
      return { orders: newOrders };
    });
  },

  updateStatus: (id, status) => {
    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: Date.now() } : o,
      );
      localStorage.setItem("kot_orders", JSON.stringify(newOrders));
      return { orders: newOrders };
    });
  },

  clearOrders: () => {
    set({ orders: [] });
    localStorage.removeItem("kot_orders");
  },
}));
