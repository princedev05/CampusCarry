import { apiClient } from "./client";
import { unwrapResponse } from "./response";

export const deliveryApi = {
  markArrived: async (payload) => {
    const res = await apiClient.post("/delivery/arrived", payload);
    return unwrapResponse(res);
  },
  confirmPickup: async (payload) => {
    const res = await apiClient.post("/delivery/pickup", payload);
    return unwrapResponse(res);
  },
};