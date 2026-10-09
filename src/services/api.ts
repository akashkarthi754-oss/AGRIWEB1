import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('agri_jwt_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('agri_jwt_token', token);
  } else {
    localStorage.removeItem('agri_jwt_token');
  }
};

export const getStoredUser = (): any => {
  const user = localStorage.getItem('agri_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any) => {
  if (user) {
    localStorage.setItem('agri_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('agri_user');
  }
};

// Create configured Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: on 401 clear token & redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setAuthToken(null);
      setStoredUser(null);
      // Only redirect if not already on login or signup
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Unified API layer matching existing frontend shapes & supporting both mock and real backend
export const api = {
  // Auth & Profile
  auth: {
    login: async (identifier: string, password = 'password123') => {
      const res = await apiClient.post('/auth/login', { identifier, password });
      if (res.data?.token) {
        setAuthToken(res.data.token);
        setStoredUser(res.data.user);
      }
      return res.data;
    },
    signup: async (data: any) => {
      const res = await apiClient.post('/auth/signup', data);
      if (res.data?.token) {
        setAuthToken(res.data.token);
        setStoredUser(res.data.user);
      }
      return res.data;
    },
    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Continue clearing client storage regardless
      }
      setAuthToken(null);
      setStoredUser(null);
    },
    me: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data;
    },
    getProfile: async () => {
      const res = await apiClient.get('/users/profile');
      return res.data;
    },
    updateProfile: async (data: any) => {
      const res = await apiClient.put('/users/profile', data);
      if (res.data?.user) {
        setStoredUser(res.data.user);
      }
      return res.data;
    },
  },

  // Admin User Management
  admin: {
    getUsers: async () => (await apiClient.get('/admin/users')).data,
    getUserById: async (id: string) => (await apiClient.get(`/admin/users/${id}`)).data,
    updateUserStatus: async (id: string, isActive: boolean) =>
      (await apiClient.put(`/admin/users/${id}/status`, { isActive })).data,
  },

  // 1. Lots (Farmer produce)
  lots: {
    create: async (data: any) => (await apiClient.post('/lots', data)).data,
    getMine: async () => (await apiClient.get('/lots/mine')).data,
    getById: async (id: string) => (await apiClient.get(`/lots/${id}`)).data,
    update: async (id: string, data: any) => (await apiClient.put(`/lots/${id}`, data)).data,
    delete: async (id: string) => (await apiClient.delete(`/lots/${id}`)).data,
  },

  // 2. Buyer requirements
  requirements: {
    create: async (data: any) => (await apiClient.post('/requirements', data)).data,
    getMine: async () => (await apiClient.get('/requirements/mine')).data,
    getById: async (id: string) => (await apiClient.get(`/requirements/${id}`)).data,
    update: async (id: string, data: any) => (await apiClient.put(`/requirements/${id}`, data)).data,
    delete: async (id: string) => (await apiClient.delete(`/requirements/${id}`)).data,
  },

  // 3. Quality assessment
  quality: {
    assess: async (lotId: string, formData?: any) => {
      const config = formData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      return (await apiClient.post(`/lots/${lotId}/quality`, formData || {}, config)).data;
    },
    get: async (lotId: string) => (await apiClient.get(`/lots/${lotId}/quality`)).data,
  },

  // 4. Market
  market: {
    getPrices: async (params?: { crop?: string; district?: string }) =>
      (await apiClient.get('/market/prices', { params })).data,
    getTrend: async (params?: { crop?: string; days?: number }) =>
      (await apiClient.get('/market/trend', { params })).data,
  },

  // 5. Matching
  matching: {
    getMatches: async (lotId: string) => (await apiClient.get(`/lots/${lotId}/matches`)).data,
  },

  // 6. Net Realisation
  realisation: {
    get: async (lotId: string, buyerId?: string) =>
      (await apiClient.get(`/lots/${lotId}/realisation`, { params: { buyerId } })).data,
  },

  // 7. Storage advice
  storage: {
    getAdvice: async (lotId: string) => (await apiClient.get(`/lots/${lotId}/storage-advice`)).data,
    getFacilities: async () => (await apiClient.get('/storage/facilities')).data,
  },

  // 8. Logistics
  logistics: {
    getVehicleRecommendation: async (lotId: string) =>
      (await apiClient.get(`/lots/${lotId}/vehicle-recommendation`)).data,
    createBooking: async (data: any) => (await apiClient.post('/bookings', data)).data,
    getMyBookings: async () => (await apiClient.get('/bookings/mine')).data,
    updateStatus: async (bookingId: string, status: string) =>
      (await apiClient.put(`/bookings/${bookingId}/status`, { status })).data,
  },

  // 9. Tracking
  tracking: {
    get: async (bookingId: string) => (await apiClient.get(`/bookings/${bookingId}/tracking`)).data,
    updateLocation: async (bookingId: string, lat: number, lng: number) =>
      (await apiClient.put(`/bookings/${bookingId}/location`, { lat, lng })).data,
  },

  // 10. Delivery Receipt
  delivery: {
    confirmReceipt: async (bookingId: string, data: { receivedQty: number; receivedGrade: string }) =>
      (await apiClient.post(`/bookings/${bookingId}/confirm-receipt`, data)).data,
  },

  // 11. Payments
  payments: {
    initiate: async (data: any) => (await apiClient.post('/payments/initiate', data)).data,
    confirm: async (paymentId: string) => (await apiClient.post('/payments/confirm', { paymentId })).data,
    getById: async (id: string) => (await apiClient.get(`/payments/${id}`)).data,
  },

  // 12. Timeline & Analytics
  timeline: {
    getLotTimeline: async (lotId: string) => (await apiClient.get(`/lots/${lotId}/timeline`)).data,
    getAnalyticsSummary: async () => (await apiClient.get('/analytics/summary')).data,
  },

  // 13. Grievances
  grievances: {
    create: async (data: any) => (await apiClient.post('/grievances', data)).data,
    getMine: async () => (await apiClient.get('/grievances/mine')).data,
    getById: async (id: string) => (await apiClient.get(`/grievances/${id}`)).data,
  },

  // Existing Frontend Compat API Methods
  marketplace: {
    getAll: async (params?: any) => (await apiClient.get('/marketplace', { params })).data,
    getById: async (id: string) => (await apiClient.get(`/marketplace/${id}`)).data,
  },
  farmer: {
    getDashboard: async () => (await apiClient.get('/analytics/summary')).data,
    getListings: async () => (await apiClient.get('/lots/mine')).data,
    createListing: async (data: any) => (await apiClient.post('/lots', data)).data,
    updateListing: async (id: string, data: any) => (await apiClient.put(`/lots/${id}`, data)).data,
  },
  procurement: {
    getAll: async () => (await apiClient.get('/requirements/mine')).data,
    approveListing: async (farmerListingId: string, purchasePricePerKg: number, notes?: string) =>
      (await apiClient.post('/payments/initiate', { lotId: farmerListingId, amount: purchasePricePerKg * 100, notes })).data,
    getInventory: async () => (await apiClient.get('/lots/mine')).data,
    updateInventory: async (id: string, data: any) => (await apiClient.put(`/lots/${id}`, data)).data,
    getDashboard: async () => (await apiClient.get('/analytics/summary')).data,
  },
  orders: {
    create: async (orderData: any) => (await apiClient.post('/bookings', orderData)).data,
    getAll: async () => (await apiClient.get('/bookings/mine')).data,
    getById: async (id: string) => (await apiClient.get(`/bookings/${id}`)).data,
    track: async (id: string) => (await apiClient.get(`/bookings/${id}/tracking`)).data,
  },
  transport: {
    getDashboard: async () => (await apiClient.get('/analytics/summary')).data,
    getTrips: async () => (await apiClient.get('/transport/trips')).data,
    updateStatus: async (tripId: string, status: string) =>
      (await apiClient.put(`/bookings/${tripId}/status`, { status })).data,
    getAgencies: async () => (await apiClient.get('/transport/agencies')).data,
    getQuote: async (totalKg: number, distanceKm: number) => ({
      success: true,
      data: { estimatedCost: totalKg * 1.5 + distanceKm * 25 },
    }),
  },
  notifications: {
    getAll: async () => (await apiClient.get('/notifications')).data,
    markRead: async (id: string) => (await apiClient.put(`/notifications/${id}/read`)).data,
    markAllRead: async () => (await apiClient.put('/notifications/read-all')).data,
  },
};
