import { apiClient } from "./client";
import { unwrapResponse } from "./response";

export const authApi = {
  register: async (payload) => {
    const res = await apiClient.post("/auth/register", payload);
    return unwrapResponse(res);
  },
  login: async (payload) => {
    const res = await apiClient.post("/auth/login", payload);
    return unwrapResponse(res);
  },
  verifyEmail: async (token) => {
    const res = await apiClient.get(`/auth/verify-email/${token}`);
    return unwrapResponse(res);
  },
  forgotPassword: async (payload) => {
    const res = await apiClient.post("/auth/forgot-password", payload);
    return unwrapResponse(res);
  },
  resetPassword: async (token, payload) => {
    const res = await apiClient.post(`/auth/reset-password/${token}`, payload);
    return unwrapResponse(res);
  },
  currentUser: async () => {
    const res = await apiClient.get("/auth/current-user");
    return unwrapResponse(res);
  },
  changePassword: async (payload) => {
    const res = await apiClient.post("/auth/change-password", payload);
    return unwrapResponse(res);
  },
  resendVerification: async () => {
    const res = await apiClient.post("/auth/resend-email-verification");
    return unwrapResponse(res);
  },
  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return unwrapResponse(res);
  },
};
