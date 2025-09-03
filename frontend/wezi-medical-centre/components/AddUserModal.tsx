import React, { useState } from 'react';
import { Icon } from './Icon';
import { User, Role } from '../types';
import { authService } from '../services/authService';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient_adult' as Role,
    nationality: '',
    nationalId: '',
    guardianName: '',
    patientName: '',
    patientDob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.role === 'guardian' && !formData.guardianName) {
      setError('Guardian name is required for guardian role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let userData;

      if (formData.role === 'patient_adult') {
        userData = await authService.registerAdult({
          username: formData.username,
          phone: formData.phone,
          nationality: formData.nationality,
          nationalId: formData.nationalId,
          password: formData.password
        });
      } else if (formData.role === 'guardian') {
        userData = await authService.registerGuardian({
          username: formData.username,
          phone: formData.phone,
          nationality: formData.nationality,
          nationalId: formData.nationalId,
          password: formData.password,
          guardianName: formData.guardianName
        });
      } else {
        // Fallback for staff/admin roles
        userData = await authService.registerAdult({
          username: formData.username,
          phone: formData.phone,
          nationality: formData.nationality,
          nationalId: formData.nationalId,
          password: formData.password
        });
      }

      setSuccess('User created successfully! Redirecting to user management...');
      
      setTimeout(() => {
        onUserAdded(userData);
        onClose();
      }, 1500);

      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'patient_adult',
        nationality: '',
        nationalId: '',
        guardianName: '',
        patientName: '',
        patientDob: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button (Top-Right Corner) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          aria-label="Close Modal"
        >
          ✕
        </button>

        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New User</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Create a new user account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
            </div>
          )}

          {/* form fields go here... */}

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{loading ? 'Creating...' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
