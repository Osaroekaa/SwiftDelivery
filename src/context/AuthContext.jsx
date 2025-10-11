import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const register = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRegistered', 'true');
    setUser(userData);
  };

  const isFirstTimeUser = () => {
    return !localStorage.getItem('seenOnboarding');
  };

  const hasCompletedOnboarding = () => {
    return localStorage.getItem('seenOnboarding') === 'true';
  };

  const isUserRegistered = () => {
    return localStorage.getItem('userRegistered') === 'true';
  };

  const completeOnboarding = () => {
    localStorage.setItem('seenOnboarding', 'true');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isFirstTimeUser,
    hasCompletedOnboarding,
    isUserRegistered,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
