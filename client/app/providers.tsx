'use client';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '@/src/store/authStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </>
  );
}

