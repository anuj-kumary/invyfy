import axios from 'axios';
import {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectResponse,
  ProjectsResponse,
} from '../types/project';

// Create axios instance (reuse from authService pattern)
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

export class ProjectService {
  // Get all projects
  static async getAll(): Promise<ProjectsResponse> {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch projects' };
    }
  }

  // Get project by ID
  static async getById(id: string): Promise<ProjectResponse> {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch project' };
    }
  }

  // Create project
  static async create(data: CreateProjectData): Promise<ProjectResponse> {
    try {
      const response = await api.post('/projects', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to create project' };
    }
  }

  // Update project
  static async update(id: string, data: UpdateProjectData): Promise<ProjectResponse> {
    try {
      const response = await api.put(`/projects/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update project' };
    }
  }

  // Delete project
  static async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete project' };
    }
  }
}

