"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/app/components/auth/auth-form';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('fp_current_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('fp_current_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem('fp_current_user', JSON.stringify(userData));
    setUser(userData);
    const targetPath = userData.email === 'admin@fuqaro.uz' ? '/dashboard' : '/ariza';
    router.push(targetPath);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('fp_current_user');
    setUser(null);
    router.push('/');
  }, [router]);

  const register = useCallback((userData: User) => {
    try {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('fp_users') || '[]');
      if (existingUsers.some(u => u.email === userData.email)) {
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Bu email bilan ro'yxatdan o'tilgan.",
        });
        return;
      }
      const newUsers = [...existingUsers, userData];
      localStorage.setItem('fp_users', JSON.stringify(newUsers));
      toast({
        title: "Muvaffaqiyatli",
        description: "Siz ro'yxatdan o'tdingiz. Iltimos, tizimga kiring.",
      });
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Ro'yxatdan o'tishda xatolik yuz berdi.",
        });
    }
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
