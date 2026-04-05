import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Regions API
export const regionsApi = {
  getAll: () => apiClient.get('/regions'),
  getByCode: (code: string) => apiClient.get(`/regions/${code}`),
  getServiceAreas: (code: string, postcode?: string) =>
    apiClient.get(`/regions/${code}/service-areas`, { params: { postcode } }),
};

// Services API
export const servicesApi = {
  getAll: (params?: { serviceType?: string; regionCode?: string }) =>
    apiClient.get('/services', { params }),
  getById: (id: string) => apiClient.get(`/services/${id}`),
};

// Bookings API
export const bookingsApi = {
  list: (params?: { status?: string; regionCode?: string }) =>
    apiClient.get('/bookings', { params }),
  create: (data: any) => apiClient.post('/bookings', data),
  getById: (id: string) => apiClient.get(`/bookings/${id}`),
  cancel: (id: string) => apiClient.post(`/bookings/${id}/cancel`),
};

// Pricing API
export const pricingApi = {
  calculate: (data: {
    serviceId: string;
    regionCode: string;
    address: any;
    propertySize?: string;
    bedrooms?: number;
    bathrooms?: number;
    addons?: string[];
  }) => apiClient.post('/pricing/calculate', data),
};

// Payments API
export const paymentsApi = {
  createIntent: (data: { bookingId: string; amount: number; paymentMethod?: string }) =>
    apiClient.post('/payments/create-intent', data),
};

// Dispatch API
export const dispatchApi = {
  assignStaff: (data: { bookingId: string; regionCode: string; scheduledAt: string }) =>
    apiClient.post('/dispatch/assign', data),
};

export default apiClient;
