import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { userManagementService, Role, CreateRoleRequest, UpdateRoleRequest } from '../services/userManagementService';

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleUpdated: () => void;
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ isOpen, onClose, onRoleUpdated }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'read:users', name: 'Read Users', category: 'User Management' },
    { id: 'write:users', name: 'Write Users', category: 'User Management' },
    { id: 'delete:users', name: 'Delete Users', category: 'User Management' },
    { id: 'read:roles', name: 'Read Roles', category: 'Role Management' },
    { id: 'write:roles', name: 'Write Roles', category: 'Role Management' },
    { id: 'delete:roles', name: 'Delete Roles', category: 'Role Management' },
    { id: 'read:patients', name: 'Read Patients', category: 'Patient Management' },
    { id: 'write:patients', name: 'Write Patients', category: 'Patient Management' },
    { id: 'read:appointments', name: 'Read Appointments', category: 'Appointment Management' },
    { id: 'write:appointments', name: 'Write Appointments', category: 'Appointment Management' },
    { id: 'read:emergency_requests', name: 'Read Emergency Requests', category: 'Emergency Management' },
    { id: 'write:emergency_requests', name: 'Write Emergency Requests', category: 'Emergency Management' },
    { id: 'read:system_logs', name: 'Read System Logs', category: 'System Administration' },
    { id: 'write:system_logs', name: 'Write System Logs', category: 'System Administration' },
    { id: 'read:backups', name: 'Read Backups', category: 'System Administration' },
    { id: 'write:backups', name: 'Write Backups', category: 'System Administration' },
    { id: '*', name: 'All Permissions', category: 'System Administration' }
  ];

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const rolesData = await userManagementService.getRoles();
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  // Refresh roles when modal becomes visible
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        fetchRoles();
      }, 3000); // Refresh every 3 seconds when modal is open
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleCreateRole = async () => {
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    setLoading(true);
    try {
      const newRole: CreateRoleRequest = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      };

      await userManagementService.createRole(newRole);
      setSuccess('Role created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchRoles();
      onRoleUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    setLoading(true);
    try {
      const updateData: UpdateRoleRequest = {
        id: editingRole.id,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      };

      await userManagementService.updateRole(updateData);
      setSuccess('Role updated successfully');
      setEditingRole(null);
      resetForm();
      fetchRoles();
      onRoleUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await userManagementService.deleteRole(roleId);
      setSuccess('Role deleted successfully');
      fetchRoles();
      onRoleUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to delete role');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const startEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setShowCreateForm(false);
    resetForm();
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Role Management</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage user roles and permissions</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchRoles}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Refresh roles"
              >
                <Icon name="ArrowPathIcon" className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Icon name="XIcon" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Icon name="MagnifyingGlassIcon" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Icon name="PlusIcon" className="h-4 w-4" />
              <span>Create Role</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {showCreateForm ? (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter role name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter role description"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">{category}</h4>
                        {permissions.map(permission => (
                          <label key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingRole ? handleUpdateRole : handleCreateRole}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <span>{editingRole ? 'Update Role' : 'Create Role'}</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{role.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">{role.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {role.permissions.includes('*') ? 'All Permissions' : `${role.permissions.length} permissions`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(role)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRoles.length === 0 && (
                <div className="text-center py-8">
                  <Icon name="ShieldCheckIcon" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No roles found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementModal;
