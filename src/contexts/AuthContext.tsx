'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Definir el tipo para el usuario
type User = {
  id: string;
  nickname?: string;
  walletAddress?: string;
  profilePicture?: string;
  professionalInfo?: {
    hourlyRate: number;
  };
  statistics?: {
    linksGenerated: number;
    rating: number;
  };
};

// Definir el tipo para el contexto
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Cargar la sesión desde localStorage al iniciar
  useEffect(() => {
    const loadStoredSession = () => {
      setIsLoading(true);
      try {
        // Verificar si estamos en el cliente (browser)
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');

          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error loading authentication from storage:', error);
        // Si hay error, limpiar todo
        setToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  // Función para iniciar sesión
 // En src/contexts/AuthContext.tsx, busca la función login y asegúrate de que sea así:

const login = (newToken: string, newUser: User) => {
  console.log('Setting auth state:', { token: newToken, user: newUser });
  
  // Actualizar estado inmediatamente
  setToken(newToken);
  setUser(newUser);
  
  // Guardar en localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('Auth data saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Redirigir al inicio
    router.push('/auth/login');
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Actualizar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};