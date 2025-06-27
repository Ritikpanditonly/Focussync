import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // 🔐 Login function
  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 🔓 Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  // 🔁 After focus session complete
  const updateCoins = (newCoinCount) => {
    if (user) {
      const updatedUser = { ...user, focusCoins: newCoinCount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        login,
        logout,
        updateCoins  // 🆕 Expose updater
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
