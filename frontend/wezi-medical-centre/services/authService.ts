import { apiClient, ApiError } from './api';
import { User, Role } from '../types';

// Authentication service interface
export interface AuthService {
  login: (username: string, password: string) => Promise<User>;
  registerAdult: (userData: AdultRegistrationData) => Promise<User>;
  registerGuardian: (userData: GuardianRegistrationData) => Promise<User>;
  forgotPassword: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  resetPassword: (phone: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => User | null;
  isAuthenticated: () => boolean;
}

// Registration data types
export interface AdultRegistrationData {
  username: string;
  phone: string;
  nationality: 'malawian' | 'non-malawian';
  nationalId?: string;
  passportNumber?: string;
  password: string;
}

export interface GuardianRegistrationData {
  username: string;
  phone: string;
  guardianName: string;
  nationality: 'malawian' | 'non-malawian';
  nationalId?: string;
  passportNumber?: string;
  password: string;
}

// Helper function to map backend user to frontend user
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    username: backendUser.username,
    phone: backendUser.phone,
    role: backendUser.role as Role,
    nationality: backendUser.nationality,
    nationalId: backendUser.nationalId,
    passportNumber: backendUser.passportNumber,
    guardianName: backendUser.guardianName,
    patientName: backendUser.patientName,
    patientDob: backendUser.patientDob,
    email: backendUser.email,
    // Legacy compatibility
    name: backendUser.guardianName || backendUser.patientName || backendUser.username,
  };
};

// Authentication service implementation
class AuthServiceImpl implements AuthService {
  private currentUser: User | null = null;

  async login(username: string, password: string): Promise<User> {
    try {
      const response = await apiClient.login(username, password);
      
      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      const user = mapBackendUserToFrontend(response.user);
      this.currentUser = user;
      
      // Store user data in localStorage for persistence
      localStorage.setItem('current_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Login failed');
    }
  }

  async registerAdult(userData: AdultRegistrationData): Promise<User> {
    try {
      const response = await apiClient.registerAdult(userData);
      
      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      const user = mapBackendUserToFrontend(response.user);
      this.currentUser = user;
      
      // Store user data in localStorage for persistence
      localStorage.setItem('current_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Registration failed');
    }
  }

  async registerGuardian(userData: GuardianRegistrationData): Promise<User> {
    try {
      const response = await apiClient.registerGuardian(userData);
      
      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      const user = mapBackendUserToFrontend(response.user);
      this.currentUser = user;
      
      // Store user data in localStorage for persistence
      localStorage.setItem('current_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Registration failed');
    }
  }

  async forgotPassword(phone: string): Promise<void> {
    try {
      await apiClient.forgotPassword(phone);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to send OTP');
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<void> {
    try {
      await apiClient.verifyOtp(phone, otp);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Invalid OTP');
    }
  }

  async resetPassword(phone: string, newPassword: string): Promise<void> {
    try {
      await apiClient.resetPassword(phone, newPassword);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Password reset failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
      this.currentUser = null;
      localStorage.removeItem('current_user');
    } catch (error) {
      // Even if logout fails on server, clear local state
      this.currentUser = null;
      localStorage.removeItem('current_user');
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to load from localStorage
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('current_user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!this.getCurrentUser();
  }
}

// Create and export singleton instance
export const authService = new AuthServiceImpl();

// Export types
export type { AdultRegistrationData, GuardianRegistrationData };
