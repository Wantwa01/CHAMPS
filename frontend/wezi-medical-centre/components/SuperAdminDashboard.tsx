import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User, AdminStats, Task, BarChartData } from '../types';
import AddUserModal from './AddUserModal';
import UserManagementModal from './UserManagementModal';
import RoleManagementModal from './RoleManagementModal';
import BulkImportModal from './BulkImportModal';
import SystemLogsModal from './SystemLogsModal';
import BackupModal from './BackupModal';
import { useAuth } from './DashboardApp';
import Logo from './Logo';

interface SuperAdminDashboardProps {
  user: User;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user }) => {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    patientSatisfaction: 0
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>({});
  
  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showRoleManagementModal, setShowRoleManagementModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showSystemLogsModal, setShowSystemLogsModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Mock admin stats
    setStats({
      totalPatients: 2847,
      totalDoctors: 23,
      totalAppointments: 156,
      totalRevenue: 125000,
      monthlyGrowth: 12.5,
      patientSatisfaction: 94.2
    });

    // Mock system tasks
    setTasks([
      {
        id: '1',
        title: 'System Security Audit',
        description: 'Complete quarterly security audit and update protocols',
        priority: 'high',
        dueDate: '2024-09-05T09:00:00Z',
        status: 'pending',
        assignedTo: user.id,
        department: 'IT Security'
      },
      {
        id: '2',
        title: 'Database Backup Verification',
        description: 'Verify all database backups are working correctly',
        priority: 'high',
        dueDate: '2024-09-04T18:00:00Z',
        status: 'in-progress',
        assignedTo: user.id,
        department: 'IT Operations'
      },
      {
        id: '3',
        title: 'User Access Review',
        description: 'Review and update user access permissions',
        priority: 'medium',
        dueDate: '2024-09-06T12:00:00Z',
        status: 'pending',
        assignedTo: user.id,
        department: 'Administration'
      },
      {
        id: '4',
        title: 'Performance Optimization',
        description: 'Optimize system performance and database queries',
        priority: 'medium',
        dueDate: '2024-09-07T15:00:00Z',
        status: 'pending',
        assignedTo: user.id,
        department: 'IT Operations'
      }
    ]);

    // Mock system alerts
    setSystemAlerts([
      {
        id: '1',
        type: 'warning',
        title: 'High Server Load',
        message: 'Server CPU usage is at 85%',
        timestamp: '2024-09-03T10:30:00Z',
        severity: 'medium'
      },
      {
        id: '2',
        type: 'info',
        title: 'Database Backup Completed',
        message: 'Daily backup completed successfully',
        timestamp: '2024-09-03T02:00:00Z',
        severity: 'low'
      },
      {
        id: '3',
        type: 'error',
        title: 'Failed Login Attempts',
        message: 'Multiple failed login attempts detected',
        timestamp: '2024-09-03T09:15:00Z',
        severity: 'high'
      }
    ]);

    // Mock user activity
    setUserActivity([
      {
        id: '1',
        user: 'Dr. Sarah Mwale',
        action: 'Logged in',
        timestamp: '2024-09-03T08:45:00Z',
        ip: '192.168.1.100',
        status: 'success'
      },
      {
        id: '2',
        user: 'Admin John Banda',
        action: 'Updated patient records',
        timestamp: '2024-09-03T08:30:00Z',
        ip: '192.168.1.101',
        status: 'success'
      },
      {
        id: '3',
        user: 'Patient Mary Phiri',
        action: 'Scheduled appointment',
        timestamp: '2024-09-03T08:15:00Z',
        ip: '192.168.1.102',
        status: 'success'
      }
    ]);

    // Mock system health
    setSystemHealth({
      serverStatus: 'healthy',
      databaseStatus: 'healthy',
      apiStatus: 'healthy',
      uptime: '99.9%',
      responseTime: '120ms',
      lastBackup: '2024-09-03T02:00:00Z'
    });
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-gray-600 dark:text-gray-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalPatients.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">+{stats.monthlyGrowth}% this month</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Icon name="UsersIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Doctors</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalDoctors}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">All departments</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today's Appointments</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalAppointments}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Across all departments</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Icon name="CalendarIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">MK {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">+8.2% vs last month</p>
            </div>
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl">
              <Icon name="ChartBarIcon" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Operations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Department Performance</h3>
          <div className="space-y-4">
            {[
              { name: 'Emergency Department', patients: 45, efficiency: 92, status: 'excellent' },
              { name: 'Outpatient Department', patients: 156, efficiency: 88, status: 'good' },
              { name: 'Inpatient Department', patients: 23, efficiency: 95, status: 'excellent' },
              { name: 'Antenatal Care', patients: 34, efficiency: 90, status: 'excellent' },
              { name: 'Theatre', patients: 12, efficiency: 85, status: 'good' }
            ].map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    dept.status === 'excellent' ? 'bg-green-100 dark:bg-green-900/20' :
                    dept.status === 'good' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
                  }`}>
                    <Icon name="ChartBarIcon" className={`h-5 w-5 ${
                      dept.status === 'excellent' ? 'text-green-600 dark:text-green-400' :
                      dept.status === 'good' ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{dept.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{dept.patients} patients today</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dept.efficiency}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time System Status */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Real-time System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Icon name="ShieldCheckIcon" className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Patient Enquiry System</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Real-time response active</p>
                </div>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">Online</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="MapPinIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Navigation System</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Virtual maps updated</p>
                </div>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Icon name="CalendarIcon" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Booking System</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Appointments & ambulance</p>
                </div>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Icon name="AmbulanceIcon" className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Emergency Services</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ambulance tracking active</p>
                </div>
              </div>
              <span className="font-medium text-green-600 dark:text-green-400">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveView('users')}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Icon name="UsersIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-blue-900 dark:text-blue-100">Manage Users</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Add, edit, or remove users</p>
          </button>
          
          <button 
            onClick={() => setActiveView('analytics')}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-green-900 dark:text-green-100">View Analytics</p>
            <p className="text-sm text-green-700 dark:text-green-300">Hospital performance data</p>
          </button>
          
          <button 
            onClick={() => setActiveView('system')}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-purple-900 dark:text-purple-100">System Settings</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">Configure system options</p>
          </button>
          
          <button 
            onClick={() => window.open('/api/health', '_blank')}
            className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="font-medium text-orange-900 dark:text-orange-100">System Health</p>
            <p className="text-sm text-orange-700 dark:text-orange-300">Check system status</p>
          </button>
        </div>
      </div>
    </div>
  );

  // User Management Sub-tabs
  const UserOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">User Overview</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Add User
          </button>
          <button 
            onClick={() => setShowBulkImportModal(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Bulk Import
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">2,870</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">All roles</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-green-600 dark:text-green-400">43% of total</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">New This Week</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">89</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">+12% growth</p>
            </div>
            <Icon name="ArrowUpIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Staff Members</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">47</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Doctors & Admin</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">User Role Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Patients', count: 2456, percentage: 85.6, color: 'blue' },
            { role: 'Doctors', count: 23, percentage: 0.8, color: 'green' },
            { role: 'Staff', count: 24, percentage: 0.8, color: 'purple' },
            { role: 'Guardians', count: 367, percentage: 12.8, color: 'orange' }
          ].map((roleData, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-slate-900 dark:text-slate-100">{roleData.role}</h5>
                <span className={`text-sm font-medium ${
                  roleData.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  roleData.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  roleData.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-orange-600 dark:text-orange-400'
                }`}>
                  {roleData.percentage}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{roleData.count}</p>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    roleData.color === 'blue' ? 'bg-blue-500' :
                    roleData.color === 'green' ? 'bg-green-500' :
                    roleData.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${roleData.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const UserManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Manage Users</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowUserManagementModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Manage Users
          </button>
          <button 
            onClick={() => setShowRoleManagementModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Manage Roles
          </button>
          <button 
            onClick={() => setShowBulkImportModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Bulk Import
          </button>
        </div>
      </div>

      {/* User Search & Filter */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">User Search & Filter</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by Role
            </label>
            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Roles</option>
              <option value="patient_adult">Adult Patients</option>
              <option value="patient_underage">Underage Patients</option>
              <option value="guardian">Guardians</option>
              <option value="staff">Staff</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => alert('Search functionality - would filter users based on criteria')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Search Users
            </button>
          </div>
        </div>
      </div>

      {/* User Management Tools */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Management Tools</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => alert('Export Users functionality - would download user data as CSV/Excel')}
            className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-green-900 dark:text-green-100">Export User Data</p>
            <p className="text-sm text-green-700 dark:text-green-300">Download as CSV/Excel</p>
          </button>
          
          <button 
            onClick={() => alert('User Permissions functionality - would open permission management interface')}
            className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          >
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-purple-900 dark:text-purple-100">Manage Permissions</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">Role-based access control</p>
          </button>
          
          <button 
            onClick={() => alert('Bulk Actions functionality - would open bulk operation interface')}
            className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
          >
            <Icon name="UsersIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="font-medium text-orange-900 dark:text-orange-100">Bulk Actions</p>
            <p className="text-sm text-orange-700 dark:text-orange-300">Mass operations</p>
          </button>
          
          <button 
            onClick={() => alert('User Analytics functionality - would show detailed user analytics')}
            className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-blue-900 dark:text-blue-100">User Analytics</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Detailed insights</p>
          </button>
        </div>
      </div>
    </div>
  );

  const UserRolesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Roles & Permissions</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
          Create Role
        </button>
      </div>

      {/* Role Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Roles</h4>
          <div className="space-y-3">
            {[
              { role: 'Super Admin', users: 1, permissions: 'Full Access', color: 'red' },
              { role: 'Staff', users: 24, permissions: 'Admin Access', color: 'blue' },
              { role: 'Doctor', users: 23, permissions: 'Medical Access', color: 'green' },
              { role: 'Guardian', users: 367, permissions: 'Patient Management', color: 'orange' },
              { role: 'Patient', users: 2456, permissions: 'Basic Access', color: 'purple' }
            ].map((roleData, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{roleData.role}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{roleData.permissions}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{roleData.users} users</p>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Permission Matrix</h4>
          <div className="space-y-4">
            {[
              { permission: 'User Management', superadmin: true, staff: true, doctor: false, guardian: false, patient: false },
              { permission: 'System Settings', superadmin: true, staff: false, doctor: false, guardian: false, patient: false },
              { permission: 'Medical Records', superadmin: true, staff: true, doctor: true, guardian: true, patient: true },
              { permission: 'Appointments', superadmin: true, staff: true, doctor: true, guardian: true, patient: true },
              { permission: 'Analytics', superadmin: true, staff: true, doctor: false, guardian: false, patient: false }
            ].map((perm, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="font-medium text-slate-900 dark:text-slate-100">{perm.permission}</span>
                <div className="flex space-x-2">
                  {Object.entries(perm).slice(1).map(([role, hasAccess]) => (
                    <span
                      key={role}
                      className={`w-3 h-3 rounded-full ${
                        hasAccess ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={`${role}: ${hasAccess ? 'Allowed' : 'Denied'}`}
                    ></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UserActivityTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">User Activity Log</h3>
        <button 
          onClick={() => alert('Refresh activity log functionality')}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* User Activity Log */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {userActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.role || 'Staff'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {formatTime(activity.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => alert(`View details for ${activity.user}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert(`Block user ${activity.user}`)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">User Management</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Add User
          </button>
          <button 
            onClick={() => setShowBulkImportModal(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Bulk Import
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">2,870</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">All roles</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-green-600 dark:text-green-400">43% of total</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">New This Week</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">89</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">+12% growth</p>
            </div>
            <Icon name="ArrowUpIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Staff Members</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">47</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Doctors & Admin</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">User Role Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Patients', count: 2456, percentage: 85.6, color: 'blue' },
            { role: 'Doctors', count: 23, percentage: 0.8, color: 'green' },
            { role: 'Staff', count: 24, percentage: 0.8, color: 'purple' },
            { role: 'Guardians', count: 367, percentage: 12.8, color: 'orange' }
          ].map((roleData, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-slate-900 dark:text-slate-100">{roleData.role}</h5>
                <span className={`text-sm font-medium ${
                  roleData.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  roleData.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  roleData.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-orange-600 dark:text-orange-400'
                }`}>
                  {roleData.percentage}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{roleData.count}</p>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    roleData.color === 'blue' ? 'bg-blue-500' :
                    roleData.color === 'green' ? 'bg-green-500' :
                    roleData.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${roleData.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Search & Filter */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">User Search & Filter</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Role
              </label>
              <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Roles</option>
                <option value="patient_adult">Adult Patients</option>
                <option value="patient_underage">Underage Patients</option>
                <option value="guardian">Guardians</option>
                <option value="staff">Staff</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button 
              onClick={() => alert('Search functionality - would filter users based on criteria')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Search Users
            </button>
          </div>
        </div>

        {/* User Management Tools */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Management Tools</h4>
          <div className="space-y-3">
            <button 
              onClick={() => alert('Export Users functionality - would download user data as CSV/Excel')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="ChartBarIcon" className="h-4 w-4" />
              <span>Export User Data</span>
            </button>
            <button 
              onClick={() => alert('User Permissions functionality - would open permission management interface')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="ShieldCheckIcon" className="h-4 w-4" />
              <span>Manage Permissions</span>
            </button>
            <button 
              onClick={() => alert('Bulk Actions functionality - would open bulk operation interface')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="UsersIcon" className="h-4 w-4" />
              <span>Bulk Actions</span>
            </button>
            <button 
              onClick={() => alert('User Analytics functionality - would show detailed user analytics')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="ChartBarIcon" className="h-4 w-4" />
              <span>User Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Activity Log */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent User Activity</h4>
            <button 
              onClick={() => alert('Refresh activity log functionality')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {userActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.role || 'Staff'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {activity.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {formatTime(activity.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => alert(`View details for ${activity.user}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert(`Block user ${activity.user}`)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // System Sub-tabs
  const SystemHealthTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">System Health</h3>
        <button 
          onClick={() => alert('Refresh system health data')}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Status</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</p>
              <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Last 30 days</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Currently online</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Response Time</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45ms</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Average</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* System Components Status */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { component: 'Web Server', status: 'operational', uptime: '99.9%', response: '23ms' },
            { component: 'Database', status: 'operational', uptime: '99.8%', response: '12ms' },
            { component: 'API Gateway', status: 'operational', uptime: '99.9%', response: '8ms' },
            { component: 'File Storage', status: 'operational', uptime: '100%', response: '15ms' },
            { component: 'Email Service', status: 'operational', uptime: '99.7%', response: '45ms' },
            { component: 'Backup Service', status: 'operational', uptime: '99.9%', response: 'N/A' }
          ].map((comp, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-slate-900 dark:text-slate-100">{comp.component}</h5>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {comp.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <p>Uptime: {comp.uptime}</p>
                <p>Response: {comp.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemBackupTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Backup & Recovery</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowBackupModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Backup Now
          </button>
          <button 
            onClick={() => alert('Restore from backup functionality')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Restore
          </button>
        </div>
      </div>

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Backup</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">2 hours ago</p>
              <p className="text-sm text-green-600 dark:text-green-400">Successful</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Backup Size</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">2.4 GB</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Compressed</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Retention</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">30 days</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Auto-cleanup</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Backup Schedule</h4>
        <div className="space-y-3">
          {[
            { type: 'Full Backup', frequency: 'Daily', time: '02:00 AM', next: 'Today, 02:00 AM', status: 'scheduled' },
            { type: 'Incremental', frequency: 'Every 6 hours', time: 'Every 6h', next: 'In 2 hours', status: 'scheduled' },
            { type: 'Database', frequency: 'Hourly', time: 'Every hour', next: 'In 15 minutes', status: 'scheduled' }
          ].map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <h5 className="font-medium text-slate-900 dark:text-slate-100">{schedule.type}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">{schedule.frequency} at {schedule.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Next: {schedule.next}</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {schedule.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemLogsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">System Logs</h3>
        <button 
          onClick={() => setShowSystemLogsModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          View All Logs
        </button>
      </div>

      {/* Recent Logs */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent System Events</h4>
        <div className="space-y-3">
          {[
            { level: 'info', message: 'User admin logged in successfully', time: '2 minutes ago', source: 'auth' },
            { level: 'warning', message: 'High CPU usage detected: 85%', time: '5 minutes ago', source: 'system' },
            { level: 'error', message: 'Database connection timeout', time: '10 minutes ago', source: 'database' },
            { level: 'info', message: 'Backup completed successfully', time: '2 hours ago', source: 'backup' },
            { level: 'debug', message: 'API request processed: GET /api/users', time: '15 minutes ago', source: 'api' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  log.level === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  log.level === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  log.level === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {log.level.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{log.message}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Source: {log.source}</p>
                </div>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemSettingsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">System Settings</h3>
        <button 
          onClick={() => alert('Save all settings functionality')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          Save All
        </button>
      </div>

      {/* System Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Security Settings</h4>
          <div className="space-y-4">
            {[
              { setting: 'Two-Factor Authentication', enabled: true, description: 'Require 2FA for admin accounts' },
              { setting: 'Session Timeout', enabled: true, description: 'Auto-logout after 30 minutes' },
              { setting: 'IP Whitelist', enabled: false, description: 'Restrict access to specific IPs' },
              { setting: 'Password Policy', enabled: true, description: 'Enforce strong passwords' }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{setting.setting}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Configuration</h4>
          <div className="space-y-4">
            {[
              { setting: 'Maintenance Mode', enabled: false, description: 'Put system in maintenance mode' },
              { setting: 'Auto Updates', enabled: true, description: 'Automatically install security updates' },
              { setting: 'Error Reporting', enabled: true, description: 'Send error reports to developers' },
              { setting: 'Performance Monitoring', enabled: true, description: 'Monitor system performance' }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{setting.setting}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SystemTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">System Administration</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowBackupModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Backup Now
          </button>
          <button 
            onClick={() => setShowSystemLogsModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            System Logs
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Status</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</p>
              <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Last 30 days</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Currently online</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Response Time</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">120ms</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Average API response</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* System Tasks */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System Tasks</h4>
            <button 
              onClick={() => alert('Add Task functionality - would open task creation form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon name="ClipboardDocumentListIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 dark:text-slate-100">{task.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Due: {formatDate(task.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {task.status}
                  </span>
                  <button 
                    onClick={() => alert(`Manage task: ${task.title}`)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Icon name="EllipsisVerticalIcon" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Database Management</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Last Backup</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(systemHealth.lastBackup)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Database Size</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Connection Pool</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">45/100</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Query Performance</span>
              <span className="text-sm text-green-600 dark:text-green-400">Excellent</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => alert('Database Backup functionality - would initiate database backup')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Backup Database
            </button>
            <button 
              onClick={() => alert('Database Optimization functionality - would optimize database performance')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Optimize Database
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Server Resources</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">CPU Usage</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">45%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Memory Usage</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">67%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Disk Usage</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">23%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Network I/O</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">12 MB/s</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => alert('Server Restart functionality - would restart server services')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Restart Services
            </button>
            <button 
              onClick={() => alert('Resource Monitoring functionality - would open detailed resource monitoring')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Monitor Resources
            </button>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => alert('Security Settings functionality - would open security configuration')}
            className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <p className="font-medium text-red-900 dark:text-red-100">Security Settings</p>
            <p className="text-sm text-red-700 dark:text-red-300">Configure security policies</p>
          </button>
          
          <button 
            onClick={() => alert('Email Settings functionality - would open email configuration')}
            className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Icon name="MailIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-blue-900 dark:text-blue-100">Email Settings</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Configure email notifications</p>
          </button>
          
          <button 
            onClick={() => alert('Backup Settings functionality - would open backup configuration')}
            className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
          >
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-green-900 dark:text-green-100">Backup Settings</p>
            <p className="text-sm text-green-700 dark:text-green-300">Configure backup schedules</p>
          </button>
          
          <button 
            onClick={() => alert('API Settings functionality - would open API configuration')}
            className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-purple-900 dark:text-purple-100">API Settings</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">Configure API endpoints</p>
          </button>
          
          <button 
            onClick={() => alert('Logging Settings functionality - would open logging configuration')}
            className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
          >
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p className="font-medium text-orange-900 dark:text-orange-100">Logging Settings</p>
            <p className="text-sm text-orange-700 dark:text-orange-300">Configure system logging</p>
          </button>
          
          <button 
            onClick={() => alert('Maintenance Mode functionality - would toggle maintenance mode')}
            className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
          >
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <p className="font-medium text-yellow-900 dark:text-yellow-100">Maintenance Mode</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Toggle maintenance mode</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Analytics Sub-tabs
  const AnalyticsOverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics Overview</h3>
        <button 
          onClick={() => alert('Refresh analytics data')}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient Satisfaction</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.8/5</p>
              <p className="text-sm text-green-600 dark:text-green-400">+0.2 this month</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Uptime</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Last 30 days</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Sessions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Currently online</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">API Calls Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45.2K</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">+12% from yesterday</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Hospital Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Department Performance</h4>
          <div className="space-y-4">
            {[
              { department: 'Emergency', patients: 156, satisfaction: 4.9, efficiency: 95 },
              { department: 'General Medicine', patients: 423, satisfaction: 4.7, efficiency: 88 },
              { department: 'Pediatrics', patients: 234, satisfaction: 4.8, efficiency: 92 },
              { department: 'Surgery', patients: 89, satisfaction: 4.6, efficiency: 85 }
            ].map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{dept.department}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dept.patients} patients</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">★ {dept.satisfaction}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dept.efficiency}% efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Service Usage Analytics</h4>
          <div className="space-y-4">
            {[
              { service: 'Appointment Booking', usage: 89, trend: '+12%', color: 'blue' },
              { service: 'Emergency Requests', usage: 23, trend: '+5%', color: 'red' },
              { service: 'Medical Records', usage: 156, trend: '+8%', color: 'green' },
              { service: 'Telemedicine', usage: 67, trend: '+15%', color: 'purple' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{service.service}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{service.usage} uses today</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    service.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    service.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    service.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`}>
                    {service.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsPerformanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Performance Analytics</h3>
        <button 
          onClick={() => alert('Generate performance report')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          Generate Report
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Response Times</h4>
          <div className="space-y-3">
            {[
              { endpoint: 'Login API', time: '45ms', status: 'good' },
              { endpoint: 'Appointment API', time: '120ms', status: 'good' },
              { endpoint: 'Records API', time: '89ms', status: 'good' },
              { endpoint: 'Emergency API', time: '34ms', status: 'excellent' }
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{metric.endpoint}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{metric.time}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    metric.status === 'excellent' ? 'bg-green-500' :
                    metric.status === 'good' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Error Rates</h4>
          <div className="space-y-3">
            {[
              { service: 'Authentication', rate: '0.1%', trend: 'stable' },
              { service: 'Database', rate: '0.05%', trend: 'improving' },
              { service: 'File Upload', rate: '0.3%', trend: 'stable' },
              { service: 'Email Service', rate: '0.2%', trend: 'stable' }
            ].map((error, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{error.service}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{error.rate}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    error.trend === 'improving' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {error.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Resource Usage</h4>
          <div className="space-y-3">
            {[
              { resource: 'CPU Usage', usage: '45%', status: 'normal' },
              { resource: 'Memory', usage: '67%', status: 'normal' },
              { resource: 'Disk Space', usage: '34%', status: 'good' },
              { resource: 'Network I/O', usage: '23%', status: 'excellent' }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{resource.resource}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{resource.usage}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    resource.status === 'excellent' ? 'bg-green-500' :
                    resource.status === 'good' ? 'bg-blue-500' :
                    resource.status === 'normal' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsReportsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics Reports</h3>
        <button 
          onClick={() => alert('Generate comprehensive report')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          Generate Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Daily Operations Report', description: 'Patient flow, appointments, and system usage', frequency: 'Daily', lastGenerated: '2 hours ago' },
          { title: 'Weekly Performance Report', description: 'System performance, user activity, and trends', frequency: 'Weekly', lastGenerated: '1 day ago' },
          { title: 'Monthly Analytics Report', description: 'Comprehensive monthly analysis and insights', frequency: 'Monthly', lastGenerated: '3 days ago' },
          { title: 'User Activity Report', description: 'Detailed user behavior and engagement metrics', frequency: 'On-demand', lastGenerated: 'Never' },
          { title: 'System Health Report', description: 'Infrastructure status and performance metrics', frequency: 'Daily', lastGenerated: '1 hour ago' },
          { title: 'Financial Report', description: 'Revenue, costs, and financial performance', frequency: 'Monthly', lastGenerated: '1 week ago' }
        ].map((report, index) => (
          <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{report.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{report.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Frequency:</span>
                <span className="text-slate-900 dark:text-slate-100">{report.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Last Generated:</span>
                <span className="text-slate-900 dark:text-slate-100">{report.lastGenerated}</span>
              </div>
            </div>
            <button 
              onClick={() => alert(`Generate ${report.title}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsExportTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Export Data</h3>
        <button 
          onClick={() => alert('Export all data functionality')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
        >
          Export All
        </button>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Data Export</h4>
          <div className="space-y-4">
            {[
              { type: 'User Data', description: 'Export all user information and profiles', format: 'CSV, Excel, JSON' },
              { type: 'Appointment Data', description: 'Export appointment history and schedules', format: 'CSV, Excel' },
              { type: 'Medical Records', description: 'Export patient medical records (anonymized)', format: 'CSV, PDF' },
              { type: 'System Logs', description: 'Export system logs and audit trails', format: 'TXT, JSON' },
              { type: 'Analytics Data', description: 'Export performance and usage analytics', format: 'CSV, Excel, JSON' }
            ].map((exportType, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{exportType.type}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{exportType.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Formats: {exportType.format}</p>
                </div>
                <button 
                  onClick={() => alert(`Export ${exportType.type}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Export
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Export History</h4>
          <div className="space-y-3">
            {[
              { file: 'user_data_2024_01_15.csv', size: '2.4 MB', date: '2 hours ago', status: 'completed' },
              { file: 'appointments_2024_01_14.xlsx', size: '1.8 MB', date: '1 day ago', status: 'completed' },
              { file: 'system_logs_2024_01_13.json', size: '5.2 MB', date: '2 days ago', status: 'completed' },
              { file: 'analytics_report_2024_01_12.pdf', size: '3.1 MB', date: '3 days ago', status: 'completed' }
            ].map((exportItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100">{exportItem.file}</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{exportItem.size} • {exportItem.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {exportItem.status}
                  </span>
                  <button 
                    onClick={() => alert(`Download ${exportItem.file}`)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Hospital Analytics & Reports</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => alert('Generate Report functionality - would create comprehensive hospital report')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Generate Report
          </button>
          <button 
            onClick={() => alert('Export Data functionality - would export analytics data')}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient Satisfaction</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.8/5</p>
              <p className="text-sm text-green-600 dark:text-green-400">+2.1% this month</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Uptime</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Last 30 days</p>
            </div>
            <Icon name="ShieldCheckIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Sessions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,234</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Peak: 1,456</p>
            </div>
            <Icon name="UsersIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">API Calls Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45.6K</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">+12% vs yesterday</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Hospital Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Department Performance</h4>
          <div className="space-y-4">
            {[
              { dept: 'Emergency', efficiency: 92, patients: 45, avgWait: '8 min' },
              { dept: 'Outpatient', efficiency: 88, patients: 156, avgWait: '15 min' },
              { dept: 'Inpatient', efficiency: 95, patients: 23, avgWait: '2 min' },
              { dept: 'Antenatal', efficiency: 90, patients: 34, avgWait: '12 min' },
              { dept: 'Theatre', efficiency: 85, patients: 12, avgWait: '5 min' }
            ].map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dept.dept}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dept.patients} patients</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dept.efficiency}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg: {dept.avgWait}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Service Usage Analytics</h4>
          <div className="space-y-4">
            {[
              { service: 'Patient Enquiries', usage: 89, trend: '+15%', status: 'high' },
              { service: 'Appointment Booking', usage: 67, trend: '+8%', status: 'medium' },
              { service: 'Emergency Requests', usage: 23, trend: '+5%', status: 'low' },
              { service: 'Medical Records', usage: 156, trend: '+12%', status: 'high' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{service.service}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{service.usage} uses today</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{service.trend}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    service.status === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    service.status === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewTab />;
      case 'users': return <UsersTab />;
      case 'system': return <SystemTab />;
      case 'analytics': return <AnalyticsTab />;
      
      // User Management Sub-tabs
      case 'user-overview': return <UserOverviewTab />;
      case 'user-management': return <UserManagementTab />;
      case 'user-roles': return <UserRolesTab />;
      case 'user-activity': return <UserActivityTab />;
      
      // System Sub-tabs
      case 'system-health': return <SystemHealthTab />;
      case 'system-backup': return <SystemBackupTab />;
      case 'system-logs': return <SystemLogsTab />;
      case 'system-settings': return <SystemSettingsTab />;
      
      // Analytics Sub-tabs
      case 'analytics-overview': return <AnalyticsOverviewTab />;
      case 'analytics-performance': return <AnalyticsPerformanceTab />;
      case 'analytics-reports': return <AnalyticsReportsTab />;
      case 'analytics-export': return <AnalyticsExportTab />;
      
      default: return <OverviewTab />;
    }
  };

  const getTabsForView = (view: string) => {
    switch (view) {
      case 'overview':
        return [
          { id: 'overview', name: 'Dashboard', icon: 'ChartBarIcon' },
          { id: 'users', name: 'User Management', icon: 'UsersIcon' },
          { id: 'system', name: 'System Admin', icon: 'ShieldCheckIcon' },
          { id: 'analytics', name: 'Analytics', icon: 'ChartBarIcon' }
        ];
      case 'users':
        return [
          { id: 'user-overview', name: 'Overview', icon: 'ChartBarIcon' },
          { id: 'user-management', name: 'Manage Users', icon: 'UsersIcon' },
          { id: 'user-roles', name: 'Roles & Permissions', icon: 'ShieldCheckIcon' },
          { id: 'user-activity', name: 'Activity Log', icon: 'ChartBarIcon' }
        ];
      case 'system':
        return [
          { id: 'system-health', name: 'System Health', icon: 'ShieldCheckIcon' },
          { id: 'system-backup', name: 'Backup & Recovery', icon: 'ShieldCheckIcon' },
          { id: 'system-logs', name: 'System Logs', icon: 'ChartBarIcon' },
          { id: 'system-settings', name: 'Settings', icon: 'ShieldCheckIcon' }
        ];
      case 'analytics':
        return [
          { id: 'analytics-overview', name: 'Overview', icon: 'ChartBarIcon' },
          { id: 'analytics-performance', name: 'Performance', icon: 'ChartBarIcon' },
          { id: 'analytics-reports', name: 'Reports', icon: 'ChartBarIcon' },
          { id: 'analytics-export', name: 'Export Data', icon: 'ChartBarIcon' }
        ];
      default:
        return [
          { id: 'overview', name: 'Dashboard', icon: 'ChartBarIcon' },
          { id: 'users', name: 'User Management', icon: 'UsersIcon' },
          { id: 'system', name: 'System Admin', icon: 'ShieldCheckIcon' },
          { id: 'analytics', name: 'Analytics', icon: 'ChartBarIcon' }
        ];
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" theme="light" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Super Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back, {user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Last login</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">{formatTime(new Date().toISOString())}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Icon name="LogoutIcon" className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="border-b border-slate-200 dark:border-slate-700">
          {/* Main Navigation */}
          <nav className="flex space-x-8 px-8">
            {getTabsForView('overview').map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeView === tab.id || activeView.startsWith(tab.id + '-')
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon name={tab.icon} className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
          
          {/* Sub Navigation - Only show when a main tab is active */}
          {activeView !== 'overview' && (
            <nav className="flex space-x-6 px-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              {getTabsForView(activeView).map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveView(subTab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeView === subTab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon name={subTab.icon} className="h-4 w-4" />
                  <span>{subTab.name}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={(user) => {
          console.log('User added:', user);
          // Close the add user modal and open user management to show the new user
          setShowAddUserModal(false);
          setShowUserManagementModal(true);
        }}
      />

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImportComplete={(results) => {
          console.log('Import completed:', results);
          // Close bulk import modal and open user management to show imported users
          setShowBulkImportModal(false);
          setShowUserManagementModal(true);
        }}
      />

      <SystemLogsModal
        isOpen={showSystemLogsModal}
        onClose={() => setShowSystemLogsModal(false)}
      />

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      <UserManagementModal
        isOpen={showUserManagementModal}
        onClose={() => setShowUserManagementModal(false)}
        onUserUpdated={() => {
          console.log('User updated');
          // The modal will automatically refresh its data
        }}
      />

      <RoleManagementModal
        isOpen={showRoleManagementModal}
        onClose={() => setShowRoleManagementModal(false)}
        onRoleUpdated={() => {
          console.log('Role updated');
          // The modal will automatically refresh its data
        }}
      />
    </div>
  );
};

export default SuperAdminDashboard;
