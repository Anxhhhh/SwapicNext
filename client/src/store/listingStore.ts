import { create } from 'zustand';
import api from '../utils/api';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  rentPerDay: number;
  type: 'Sell' | 'Rent' | 'Barter' | 'Buy';
  category: string;
  condition: string;
  images: string[];
  location: string;
  seller: { _id: string; name: string; avatarUrl?: string };
  savedBy: string[];
  views: number;
  createdAt: string;
}

interface ListingState {
  listings: Listing[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchListings: (params?: Record<string, string>) => Promise<void>;
  createListing: (data: Partial<Listing>) => Promise<Listing>;
  toggleSave: (id: string) => Promise<void>;
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  total: 0,
  loading: false,
  error: null,

  fetchListings: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/listings', { params });
      set({ listings: res.data.listings, total: res.data.total, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createListing: async (data) => {
    const res = await api.post('/listings', data);
    return res.data;
  },

  toggleSave: async (id: string) => {
    await api.post(`/listings/${id}/save`);
    // Update locally
    set(state => ({
      listings: state.listings, // re-fetch handled by caller
    }));
  },
}));
