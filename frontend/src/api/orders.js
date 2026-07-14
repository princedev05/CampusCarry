import { apiClient } from "./client";
import { unwrapResponse } from "./response";

export const ordersApi = {
  create: async (payload) => {
    const res = await apiClient.post("/orders", payload);
    return unwrapResponse(res);
  },
  myOrders: async () => {
    const res = await apiClient.get("/orders/my-orders");
    return unwrapResponse(res);
  },
  byId: async (orderId) => {
    const res = await apiClient.get(`/orders/${orderId}`);
    return unwrapResponse(res);
  },
  cancel: async (orderId) => {
    const res = await apiClient.delete(`/orders/${orderId}`);
    return unwrapResponse(res);
  },
  all: async () => {
    const paths = ["/admin/orders", "/orders", "/guard/deliveries"];
    for (const path of paths) {
      try {
        const res = await apiClient.get(path);
        return unwrapResponse(res) || [];
      } catch {
        continue;
      }
    }
    return [];
  },
};
