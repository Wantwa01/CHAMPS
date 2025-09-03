import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User, Appointment } from '../types';
import Logo from './Logo';

interface GuardianDashboardProps {
  user: User;
}

interface Child {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  medicalRecord: string;
  lastVisit: string;
  nextAppointment?: string;
}

const GuardianDashboard: React.FC<GuardianDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState('overview');
  const [children, setChildren] = useState<Child[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  // Mock data initialization
  useEffect(() => {
    // Mock children data
    setChildren([
      {
        id: '1',
        name: 'Grace Mwale',
        age: 8,
        dateOfBirth: '2016-03-15',
        medicalRecord: 'P001',
        lastVisit: '2024-08-15',
        nextAppointment: '2024-09-10'
      },
      {
        id: '2',
        name: 'John Mwale',
        age: 12,
        dateOfBirth: '2012-07-22',
        medicalRecord: 'P002',
        lastVisit: '2024-08-20',
        nextAppointment: '2024-09-15'
      }
    ]);

    // Mock appointments
    setAppointments([
      {
        id: '1',
        doctor: 'Dr. Sarah Mwale',
        department: 'Pediatrics',
        date: '2024-09-10',
        time: '10:00 AM',
        status: 'scheduled',
        childName: 'Grace Mwale'
      },
      {
        id: '2',
        doctor: 'Dr. James Phiri',
        department: 'General Medicine',
        date: '2024-09-15',
        time: '2:30 PM',
        status: 'scheduled',
        childName: 'John Mwale'
      }
    ]);

    // Mock emergency contacts
    setEmergencyContacts([
      {
        name: 'Wezi Medical Centre Emergency',
        phone: '+265 1 123 456',
        type: 'Emergency',
        available: '24/7'
      },
      {
        name: 'Dr. Sarah Mwale',
        phone: '+265 99 123 4567',
        type: 'Pediatrician',
        available: 'Mon-Fri 8AM-5PM'
      },
      {
        name: 'Ambulance Service',
        phone: '+265 1 999',
        type: 'Ambulance',
        available: '24/7'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Children Under Care</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{children.length}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Active records</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Icon name="UsersIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{appointments.filter(apt => apt.status === 'scheduled').length}</p>
              <p className="text-sm text-green-600 dark:text-green-400">This month</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Icon name="CalendarIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Medical Records</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{children.length}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Complete files</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Icon name="ClipboardDocumentListIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Emergency Contacts</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{emergencyContacts.length}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Available 24/7</p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
              <Icon name="AmbulanceIcon" className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Children Overview */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Children Under Your Care</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{child.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Age: {child.age} years</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="UserIcon" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Medical Record:</strong> {child.medicalRecord}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Last Visit:</strong> {formatDate(child.lastVisit)}
                </p>
                {child.nextAppointment && (
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>Next Appointment:</strong> {formatDate(child.nextAppointment)}
                  </p>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Records
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Appointment Management</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Book New Appointment
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            View Calendar
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming Appointments</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date & Time
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
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    {appointment.childName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {appointment.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {appointment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(appointment.date)} at {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Reschedule
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Cancel
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

  const RecordsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Medical Records</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Download Records
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Share with Doctor
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {children.map((child) => (
          <div key={child.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{child.name}</h4>
                <p className="text-slate-600 dark:text-slate-400">Medical Record: {child.medicalRecord}</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                View Full Record
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Vaccination History</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">Up to date with all required vaccinations</p>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2">
                  View Details
                </button>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Growth Chart</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">Height and weight tracking</p>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2">
                  View Chart
                </button>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Allergies</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">No known allergies</p>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2">
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmergencyTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Emergency Contacts & Services</h3>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
          Emergency Call
        </button>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{contact.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{contact.type}</p>
              </div>
              <div className={`p-2 rounded-lg ${
                contact.type === 'Emergency' ? 'bg-red-100 dark:bg-red-900/20' :
                contact.type === 'Ambulance' ? 'bg-orange-100 dark:bg-orange-900/20' :
                'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                <Icon name="PhoneIcon" className={`h-5 w-5 ${
                  contact.type === 'Emergency' ? 'text-red-600 dark:text-red-400' :
                  contact.type === 'Ambulance' ? 'text-orange-600 dark:text-orange-400' :
                  'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Phone:</strong> {contact.phone}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Available:</strong> {contact.available}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Call Now
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Save Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Information */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Emergency Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
              <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">In Case of Emergency</h5>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Call emergency services immediately</li>
                <li>• Provide child's name and age</li>
                <li>• Mention any known allergies</li>
                <li>• Give clear location details</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Important Information</h5>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Keep medical records accessible</li>
                <li>• Know your child's blood type</li>
                <li>• Have insurance information ready</li>
                <li>• Update emergency contacts regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewTab />;
      case 'appointments': return <AppointmentsTab />;
      case 'records': return <RecordsTab />;
      case 'emergency': return <EmergencyTab />;
      default: return <OverviewTab />;
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Guardian Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back, {user.name || user.username}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Managing healthcare for {children.length} child{children.length !== 1 ? 'ren' : ''}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Guardian Status</p>
              <p className="font-medium text-green-600 dark:text-green-400">Active</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl">
              <Icon name="ShieldCheckIcon" className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'ChartBarIcon' },
              { id: 'appointments', name: 'Appointments', icon: 'CalendarIcon' },
              { id: 'records', name: 'Medical Records', icon: 'ClipboardDocumentListIcon' },
              { id: 'emergency', name: 'Emergency', icon: 'AmbulanceIcon' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon name={tab.icon} className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GuardianDashboard;
