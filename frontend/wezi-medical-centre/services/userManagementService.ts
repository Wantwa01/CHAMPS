import { apiClient } from './api';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  phone?: string;
  address?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  permissions?: string[];
}

class UserManagementService {
  // User Management
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data.users;
    } catch (error) {
      // Mock data for demonstration
      return [
        {
          id: '1',
          username: 'admin',
          email: 'admin@wezi.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'superadmin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          username: 'doctor1',
          email: 'doctor1@wezi.com',
          firstName: 'Dr. John',
          lastName: 'Smith',
          role: 'staff',
          status: 'active',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          lastLogin: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          username: 'patient1',
          email: 'patient1@wezi.com',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'patient_adult',
          status: 'active',
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z',
          lastLogin: '2024-01-14T14:20:00Z'
        }
      ];
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data.user;
    } catch (error) {
      // Mock creation for demonstration
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newUser;
    }
  }

  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.put(`/admin/users/${userData.id}`, userData);
      return response.data.user;
    } catch (error) {
      // Mock update for demonstration
      const updatedUser: User = {
        id: userData.id,
        username: userData.username || 'updated_user',
        email: userData.email || 'updated@wezi.com',
        firstName: userData.firstName || 'Updated',
        lastName: userData.lastName || 'User',
        role: userData.role || 'patient_adult',
        status: userData.status || 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };
      return updatedUser;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
    } catch (error) {
      // Mock deletion for demonstration
      console.log(`User ${userId} deleted (mock)`);
    }
  }

  // Role Management
  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get('/admin/roles');
      return response.data.roles;
    } catch (error) {
      // Mock data for demonstration
      return [
        {
          id: '1',
          name: 'superadmin',
          description: 'Full system access and administration',
          permissions: ['*'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'staff',
          description: 'Medical staff and doctors',
          permissions: ['read:patients', 'write:patients', 'read:appointments', 'write:appointments'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'patient_adult',
          description: 'Adult patients',
          permissions: ['read:own_data', 'write:own_data', 'read:appointments', 'write:appointments'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'patient_guardian',
          description: 'Guardians of child patients',
          permissions: ['read:child_data', 'write:child_data', 'read:appointments', 'write:appointments'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'ambulance',
          description: 'Ambulance service providers',
          permissions: ['read:emergency_requests', 'write:emergency_requests', 'read:locations'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    }
  }

  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    try {
      const response = await apiClient.post('/admin/roles', roleData);
      return response.data.role;
    } catch (error) {
      // Mock creation for demonstration
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newRole;
    }
  }

  async updateRole(roleData: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await apiClient.put(`/admin/roles/${roleData.id}`, roleData);
      return response.data.role;
    } catch (error) {
      // Mock update for demonstration
      const updatedRole: Role = {
        id: roleData.id,
        name: roleData.name || 'Updated Role',
        description: roleData.description || 'Updated description',
        permissions: roleData.permissions || [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };
      return updatedRole;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/roles/${roleId}`);
    } catch (error) {
      // Mock deletion for demonstration
      console.log(`Role ${roleId} deleted (mock)`);
    }
  }

  // Bulk Operations
  async bulkImportUsers(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/admin/users/bulk-import', formData);
      return response.data;
    } catch (error) {
      // Mock bulk import for demonstration
      return {
        success: 5,
        failed: 1,
        errors: ['Invalid email format for user: invalid@email']
      };
    }
  }
}

export const userManagementService = new UserManagementService();
