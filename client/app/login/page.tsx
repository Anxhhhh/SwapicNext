'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/src/components/LoginPage';

export default function Page() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return <LoginPage onBack={handleBack} />;
}

