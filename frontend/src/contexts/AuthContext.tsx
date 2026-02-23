import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import type { User, AuthContextData } from '../types/auth';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@HoraExtra:user');
    const token = localStorage.getItem('@HoraExtra:token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user: userData } = response.data;

    localStorage.setItem('@HoraExtra:token', access_token);
    localStorage.setItem('@HoraExtra:user', JSON.stringify(userData));

    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@HoraExtra:token');
    localStorage.removeItem('@HoraExtra:user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
