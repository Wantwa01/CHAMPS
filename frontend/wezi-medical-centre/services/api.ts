// Extend ImportMeta to include 'env' property for Vite
declare global {
  interface ImportMeta {
    readonly env: {
      VITE_API_URL?: string;
      [key: string]: any;
    };
  }
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: T;
  token?: string;
  dashboard?: string;
  details?: string[];
}

export interface ApiError {
  message: string;
  details?: string[];
  status?: number;
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'An error occurred',
          details: data.details,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Authentication Methods
  async login(username: string, password: string): Promise<ApiResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      this.saveToken(response.token);
    }

    return response;
  }

  async registerAdult(userData: {
    username: string;
    phone: string;
    nationality: 'malawian' | 'non-malawian';
    nationalId?: string;
    passportNumber?: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/register/adult', {
      method: 'POST',
      body: JSON.stringify({
        role: 'patient_adult',
        ...userData,
      }),
    });
  }

  async registerGuardian(userData: {
    username: string;
    phone: string;
    guardianName: string;
    nationality: 'malawian' | 'non-malawian';
    nationalId?: string;
    passportNumber?: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/register/guardian', {
      method: 'POST',
      body: JSON.stringify({
        role: 'guardian',
        ...userData,
      }),
    });
  }

  async forgotPassword(phone: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  async resetPassword(phone: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ phone, newPassword }),
    });
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Generic API methods for future use
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
