import axios from 'axios';
import {
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceResponse,
  InvoicesResponse,
  InvoiceStatsResponse,
} from '../types/invoice';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class InvoiceService {
  // Get all invoices
  static async getAll(params?: { status?: string; projectId?: string }): Promise<InvoicesResponse> {
    try {
      const response = await api.get('/invoices', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch invoices' };
    }
  }

  // Get invoice by ID
  static async getById(id: string): Promise<InvoiceResponse> {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch invoice' };
    }
  }

  // Get invoice statistics
  static async getStats(): Promise<InvoiceStatsResponse> {
    try {
      const response = await api.get('/invoices/stats');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch statistics' };
    }
  }

  // Create invoice
  static async create(data: CreateInvoiceData): Promise<InvoiceResponse> {
    try {
      const response = await api.post('/invoices', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to create invoice' };
    }
  }

  // Update invoice
  static async update(id: string, data: UpdateInvoiceData): Promise<InvoiceResponse> {
    try {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update invoice' };
    }
  }

  // Delete invoice
  static async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete invoice' };
    }
  }
}

