"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/auth-provider';
import AuthForm from '@/app/components/auth/auth-form';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const targetPath = user.email === 'admin@fuqaro.uz' ? '/dashboard' : '/ariza';
      router.replace(targetPath);
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }
  
  return <AuthForm />;
}
