import { apiClient } from "./client";
import { unwrapResponse } from "./response";

export const chatApi = {
  getPeers: async () => {
    const res = await apiClient.get("/chat/peers");
    return unwrapResponse(res);
  },
  getHistory: async (otherUserId) => {
    const res = await apiClient.get(`/chat/history/${otherUserId}`);
    return unwrapResponse(res);
  },
  sendMessage: async (payload) => {
    const res = await apiClient.post("/chat/send", payload);
    return unwrapResponse(res);
  },
};
