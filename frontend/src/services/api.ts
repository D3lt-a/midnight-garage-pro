import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ==================== CARS ====================
export const carService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/cars/list');
    return response.data;
  },

  getByPlate: async (plate: string) => {
    const response = await api.get<ApiResponse<any>>(`/cars/get/${plate}`);
    return response.data;
  },

  create: async (car: {
    num: string;
    type: string;
    model: string;
    year: number;
    phone: string;
    name: string;
  }) => {
    const response = await api.post<ApiResponse<any>>('/cars/create', car);
    return response.data;
  },
};

// ==================== SERVICES ====================
export const serviceService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/services/list');
    return response.data;
  },

  getByCode: async (code: string) => {
    const response = await api.get<ApiResponse<any>>(`/services/list/${code}`);
    return response.data;
  },

  create: async (service: { code: string; name: string; price: number }) => {
    const response = await api.post<ApiResponse<any>>('/services/add', service);
    return response.data;
  },
};

// ==================== SERVICE RECORDS ====================
export const recordService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/records/list');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<any>>(`/records/get/${id}`);
    return response.data;
  },

  create: async (record: { servID: number; carID: number; recDate?: string }) => {
    const response = await api.post<ApiResponse<any>>('/records/add', record);
    return response.data;
  },

  update: async (id: number, record: { servID: number; carID: number; recDate?: string }) => {
    const response = await api.put<ApiResponse<any>>(`/records/update/${id}`, record);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<any>>(`/records/delete/${id}`);
    return response.data;
  },

  getDailyReport: async (date: string) => {
    const response = await api.get<ApiResponse<any[]>>(`/records/report/daily?date=${date}`);
    return response.data;
  },

  getCarBill: async (plate: string) => {
    const response = await api.get<ApiResponse<any>>(`/records/report/bill/${plate}`);
    return response.data;
  },
};

// ==================== PAYMENTS ====================
export const paymentService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/payments/list');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<any>>(`/payments/get/${id}`);
    return response.data;
  },

  getByRecordId: async (recID: number) => {
    const response = await api.get<ApiResponse<any[]>>(`/payments/record/${recID}`);
    return response.data;
  },

  create: async (payment: { recID: number; amount: number; payDate?: string }) => {
    const response = await api.post<ApiResponse<any>>('/payments/add', payment);
    return response.data;
  },
};

// ==================== USERS ====================
export const userService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<any>>('/users/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post<ApiResponse<any>>('/users/create', { name, email, password });
    return response.data;
  },
};

export default api;
