import { apiClient } from "./client";
import { unwrapResponse } from "./response";

const postWithFallback = async (paths, payload) => {
  let lastError;
  for (const path of paths) {
    try {
      const res = await apiClient.post(path, payload);
      return unwrapResponse(res);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const tokenApi = {
  generate: async (orderId) => {
    return postWithFallback(["/tokens/generate", "/token/generate"], { orderId });
  },
  verify: async (token) => {
    return postWithFallback(["/tokens/verify", "/token/verify"], { token });
  },
};
