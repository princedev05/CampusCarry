import { apiClient } from "./client";
import { unwrapResponse } from "./response";

export const guardApi = {
  deliveries: async () => {
    const res = await apiClient.get("/guard/deliveries");
    return unwrapResponse(res);
  },
  acceptDelivery: async (payload) => {
    const res = await apiClient.post("/guard/accept-delivery", payload);
    return unwrapResponse(res);
  },
  verifyDelivery: async (payload) => {
    const res = await apiClient.post("/guard/verify-delivery", payload);
    return unwrapResponse(res);
  },
  handover: async (payload) => {
    const res = await apiClient.post("/guard/handover", payload);
    return unwrapResponse(res);
  },
};
