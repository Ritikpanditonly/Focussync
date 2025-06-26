import React, { createContext, useState, useEffect } from 'react';

// 1️⃣ Create context for auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 2️⃣ Store: token, user object, isLoggedIn flag
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // 3️⃣ Login / Logout functions
  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  // Keep isLoggedIn in sync if token changes elsewhere
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
