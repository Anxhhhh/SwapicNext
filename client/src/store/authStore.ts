import { create } from 'zustand';
import api from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  fetchUser: async () => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
