"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/app/components/auth/auth-form';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: User) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => false,
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

  const login = useCallback(async (userData: User) => {
    localStorage.setItem('fp_current_user', JSON.stringify(userData));
    setUser(userData);
    const targetPath = userData.email === 'admin@fuqaro.uz' ? '/dashboard' : '/ariza';
    await router.push(targetPath);
  }, [router]);

  const logout = useCallback(async () => {
    localStorage.removeItem('fp_current_user');
    setUser(null);
    await router.push('/');
  }, [router]);

  const register = useCallback(async (userData: User): Promise<boolean> => {
    try {
      const existingUsers: User[] = JSON.parse(localStorage.getItem('fp_users') || '[]');
      if (existingUsers.some(u => u.email === userData.email)) {
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Bu email bilan ro'yxatdan o'tilgan.",
        });
        return false;
      }
      const newUsers = [...existingUsers, userData];
      localStorage.setItem('fp_users', JSON.stringify(newUsers));
      toast({
        title: "Muvaffaqiyatli!",
        description: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Profilingizga yo'naltirilmoqda...",
      });
      await login(userData);
      return true;
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Ro'yxatdan o'tishda xatolik yuz berdi.",
        });
        return false;
    }
  }, [toast, login]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
