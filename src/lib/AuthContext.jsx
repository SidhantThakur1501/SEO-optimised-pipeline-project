import React, { createContext, useContext, useMemo } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      user: {
        id: "local-user",
        name: "Local User",
        email: "local@example.com",
        role: "admin",
      },
      isAuthenticated: true,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      logout: () => undefined,
      navigateToLogin: () => undefined,
      checkAppState: async () => undefined,
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
