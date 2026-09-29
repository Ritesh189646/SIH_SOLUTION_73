import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('skyguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    // Demo Authentication Flow
    if (username.trim() === 'admin' && password === 'admin123') {
      const userData = {
        username: 'admin',
        name: 'System Operator',
        role: 'Operations Administrator',
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('skyguard_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password. (Demo credentials: admin / admin123)' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skyguard_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
