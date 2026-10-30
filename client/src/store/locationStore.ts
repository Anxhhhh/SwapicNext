import { create } from 'zustand';

export const POPULAR_INDIAN_CITIES = [
  'All India',
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
  'Kochi',
  'Goa',
  'Indore',
  'Surat',
  'Bhopal',
  'Coimbatore',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Nagpur',
  'Bhubaneswar',
  'Guwahati',
  'Dehradun',
  'Mysuru',
  'Noida',
  'Gurugram',
  'Thane',
  'Nashik',
  'Agra',
  'Varanasi',
  'Amritsar',
  'Ranchi',
  'Raipur',
  'Shimla',
];

interface LocationState {
  selectedLocation: string;
  isDetecting: boolean;
  detectError: string | null;
  setLocation: (loc: string) => void;
  detectCurrentLocation: () => Promise<string | null>;
}

const getStoredLocation = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('swapic_selected_location');
      if (stored) return stored;
    } catch {}
  }
  return 'All India';
};

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: getStoredLocation(),
  isDetecting: false,
  detectError: null,

  setLocation: (loc: string) => {
    const clean = loc.trim() || 'All India';
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('swapic_selected_location', clean);
      } catch {}
    }
    set({ selectedLocation: clean, detectError: null });
  },

  detectCurrentLocation: async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      set({ detectError: 'Geolocation is not supported by your browser.' });
      return null;
    }

    set({ isDetecting: true, detectError: null });

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Reverse geocode with OpenStreetMap Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  'Accept-Language': 'en',
                },
              }
            );

            if (!response.ok) {
              throw new Error('Reverse geocoding failed');
            }

            const data = await response.json();
            const addr = data.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.state_district ||
              addr.county ||
              addr.state ||
              'India';

            // Clean up common city naming if needed (e.g. Bangalore -> Bengaluru)
            let formattedCity = city;
            if (formattedCity.toLowerCase() === 'bangalore') formattedCity = 'Bengaluru';
            if (formattedCity.toLowerCase() === 'calcutta') formattedCity = 'Kolkata';
            if (formattedCity.toLowerCase() === 'bombay') formattedCity = 'Mumbai';
            if (formattedCity.toLowerCase() === 'madras') formattedCity = 'Chennai';

            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('swapic_selected_location', formattedCity);
              } catch {}
            }

            set({ selectedLocation: formattedCity, isDetecting: false, detectError: null });
            resolve(formattedCity);
          } catch (err: any) {
            set({
              isDetecting: false,
              detectError: 'Unable to detect city name. Please select from the list.',
            });
            resolve(null);
          }
        },
        (error) => {
          let msg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied. Please enable it in browser settings or choose a city below.';
          }
          set({ isDetecting: false, detectError: msg });
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  },
}));
