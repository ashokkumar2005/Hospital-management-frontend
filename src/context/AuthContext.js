import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const saveAuth = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.login({ email, password });
      saveAuth(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally { setLoading(false); }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.register(formData);
      saveAuth(data.user, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally { setLoading(false); }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.getMe();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch { }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logout, refreshUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
