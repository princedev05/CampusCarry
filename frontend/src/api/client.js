import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/token";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7900/api/v1";

let isRefreshing = false;
let queue = [];

const processQueue = (token) => {
  queue.forEach((item) => item.resolve(token));
  queue = [];
};

const processQueueWithError = (error) => {
  queue.forEach((item) => item.reject(error));
  queue = [];
};

let authHandlers = {
  onAuthFailed: null,
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export const setAuthHandlers = (handlers) => {
  authHandlers = {
    ...authHandlers,
    ...handlers,
  };
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      clearAccessToken();
      authHandlers.onAuthFailed?.();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await apiClient.post("/auth/refresh-token");
      const nextToken = refreshResponse?.data?.data?.accessToken;

      if (!nextToken) {
        throw new Error("No access token returned on refresh");
      }

      setAccessToken(nextToken);
      processQueue(nextToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueueWithError(refreshError);
      clearAccessToken();
      authHandlers.onAuthFailed?.();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
