import { apiClient } from "./client";
import { unwrapResponse } from "./response";

const getWithFallback = async (paths) => {
  for (const path of paths) {
    try {
      const res = await apiClient.get(path);
      return unwrapResponse(res) || [];
    } catch {
      continue;
    }
  }
  return [];
};

export const adminApi = {
  users: async () => {
    return getWithFallback(["/admin/users", "/users", "/auth/current-user"]);
  },
  orders: async () => {
    return getWithFallback(["/admin/orders", "/orders", "/guard/deliveries"]);
  },
};
