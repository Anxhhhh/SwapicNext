'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import CreateListingPage from '@/src/components/CreateListingPage';
import { useAuthStore } from '@/src/store/authStore';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login?redirect=/create');
    }
  }, [isAuthenticated, router]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/explore');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F2] flex items-center justify-center text-[#654332]">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      <Navbar activeNav="Explore" />
      <CreateListingPage
        onBack={handleBack}
        onSuccess={() => router.push('/explore')}
      />
    </div>
  );
}

