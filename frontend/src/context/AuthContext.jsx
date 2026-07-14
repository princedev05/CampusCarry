import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getErrorMessage, setAuthHandlers } from "../api";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutLocal = () => {
    clearAccessToken();
    setUser(null);
  };

  useEffect(() => {
    setAuthHandlers({
      onAuthFailed: logoutLocal,
    });
  }, []);

  const bootstrap = async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.currentUser();
      setUser(currentUser);
    } catch {
      logoutLocal();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    const token = data?.accessToken;
    const loggedInUser = data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Unexpected login response from server");
    }

    setAccessToken(token);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network/logout failures and clear local state regardless.
    } finally {
      logoutLocal();
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const currentUser = await authApi.currentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      throw new Error(getErrorMessage(error), { cause: error });
    }
  };

  const value = useMemo(
    () => ({
      user,
      token: getAccessToken(),
      loading,
      isAuthenticated: Boolean(user && getAccessToken()),
      login,
      logout,
      refreshCurrentUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
