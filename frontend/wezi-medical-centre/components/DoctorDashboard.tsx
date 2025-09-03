import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User, Appointment, DoctorAppointment, Task } from '../types';
import Logo from './Logo';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState('overview');
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState<any[]>([]);

  // Mock data for doctor dashboard
  useEffect(() => {
    // Mock appointments
    setAppointments([
      {
        id: '1',
        patientName: 'John Banda',
        patientId: 'P001',
        department: 'General Medicine',
        appointmentType: 'Consultation',
        scheduledTime: '2024-09-03T09:00:00Z',
        status: 'scheduled',
        priority: 'normal',
        symptoms: 'Fever and headache',
        medicalHistory: 'No known allergies',
        contactInfo: '+265 99 123 4567'
      },
      {
        id: '2',
        patientName: 'Mary Phiri',
        patientId: 'P002',
        department: 'Obstetrics & Gynecology',
        appointmentType: 'Antenatal Checkup',
        scheduledTime: '2024-09-03T10:30:00Z',
        status: 'in-progress',
        priority: 'high',
        symptoms: 'Regular antenatal visit',
        medicalHistory: 'First pregnancy, 28 weeks',
        contactInfo: '+265 88 234 5678'
      },
      {
        id: '3',
        patientName: 'Peter Mwale',
        patientId: 'P003',
        department: 'Emergency',
        appointmentType: 'Emergency Consultation',
        scheduledTime: '2024-09-03T11:15:00Z',
        status: 'scheduled',
        priority: 'urgent',
        symptoms: 'Chest pain and shortness of breath',
        medicalHistory: 'History of hypertension',
        contactInfo: '+265 77 345 6789'
      }
    ]);

    // Mock tasks
    setTasks([
      {
        id: '1',
        title: 'Review lab results for Patient P001',
        description: 'Blood test results for John Banda are ready for review',
        priority: 'high',
        dueDate: '2024-09-03T12:00:00Z',
        status: 'pending',
        assignedTo: user.id,
        department: 'General Medicine'
      },
      {
        id: '2',
        title: 'Update patient records',
        description: 'Complete documentation for yesterday\'s consultations',
        priority: 'medium',
        dueDate: '2024-09-03T17:00:00Z',
        status: 'in-progress',
        assignedTo: user.id,
        department: 'General Medicine'
      },
      {
        id: '3',
        title: 'Emergency protocol review',
        description: 'Review and update emergency response procedures',
        priority: 'high',
        dueDate: '2024-09-05T09:00:00Z',
        status: 'pending',
        assignedTo: user.id,
        department: 'Emergency'
      }
    ]);

    // Mock enquiries
    setEnquiries([
      {
        id: '1',
        patientName: 'Sarah Chisale',
        contact: '+265 99 456 7890',
        department: 'Obstetrics & Gynecology',
        enquiry: 'I need to schedule an antenatal appointment. What are the available slots?',
        timestamp: '2024-09-03T08:30:00Z',
        status: 'pending',
        priority: 'normal'
      },
      {
        id: '2',
        patientName: 'James Mwenda',
        contact: '+265 88 567 8901',
        department: 'Emergency',
        enquiry: 'Is the emergency department open 24/7? I have severe abdominal pain.',
        timestamp: '2024-09-03T09:15:00Z',
        status: 'urgent',
        priority: 'high'
      },
      {
        id: '3',
        patientName: 'Grace Nyirenda',
        contact: '+265 77 678 9012',
        department: 'General Medicine',
        enquiry: 'Can I get a prescription refill for my diabetes medication?',
        timestamp: '2024-09-03T10:00:00Z',
        status: 'pending',
        priority: 'normal'
      }
    ]);

    // Mock ambulance requests
    setAmbulanceRequests([
      {
        id: '1',
        patientName: 'Thomas Gondwe',
        location: 'Area 3, Mzuzu',
        contact: '+265 99 789 0123',
        emergencyType: 'Cardiac Emergency',
        symptoms: 'Chest pain, difficulty breathing',
        timestamp: '2024-09-03T09:45:00Z',
        status: 'dispatched',
        eta: 15,
        priority: 'critical'
      },
      {
        id: '2',
        patientName: 'Ruth Mhango',
        location: 'Chibavi, Mzuzu',
        contact: '+265 88 890 1234',
        emergencyType: 'Maternity Emergency',
        symptoms: 'Labor pains, water broken',
        timestamp: '2024-09-03T10:20:00Z',
        status: 'en-route',
        eta: 8,
        priority: 'high'
      }
    ]);
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'dispatched': return 'bg-blue-100 text-blue-800';
      case 'en-route': return 'bg-yellow-100 text-yellow-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today's Appointments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon name="CalendarIcon" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {tasks.filter(task => task.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Icon name="ClipboardDocumentListIcon" className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Enquiries</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {enquiries.filter(enq => enq.status === 'pending' || enq.status === 'urgent').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon name="ChatIcon" className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Emergency Cases</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {ambulanceRequests.filter(req => req.status === 'dispatched' || req.status === 'en-route').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Icon name="AmbulanceIcon" className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today's Schedule</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon name="UserIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{appointment.patientName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{formatTime(appointment.scheduledTime)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Patient Appointments</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        ID: {appointment.patientId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {appointment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {formatTime(appointment.scheduledTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      Start
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

  const EnquiriesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Patient Enquiries</h3>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Mark All Read
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Auto-Response
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">{enquiry.patientName}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(enquiry.priority)}`}>
                    {enquiry.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enquiry.status)}`}>
                    {enquiry.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <strong>Department:</strong> {enquiry.department}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <strong>Contact:</strong> {enquiry.contact}
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  {enquiry.enquiry}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(enquiry.timestamp)} at {formatTime(enquiry.timestamp)}
                </p>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Respond
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Call
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Schedule
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
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency & Ambulance Requests</h3>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Emergency Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ambulanceRequests.map((request) => (
          <div key={request.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{request.patientName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{request.emergencyType}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Location:</strong> {request.location}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Contact:</strong> {request.contact}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Symptoms:</strong> {request.symptoms}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Status:</strong> 
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </p>
              {request.eta && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>ETA:</strong> {request.eta} minutes
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                Emergency
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                Track
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TasksTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tasks & Documentation</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">{task.title}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <strong>Department:</strong> {task.department} | 
                  <strong> Due:</strong> {formatDate(task.dueDate)} at {formatTime(task.dueDate)}
                </p>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Start
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Complete
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NavigationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hospital Navigation & Maps</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Update Map
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virtual Map */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Virtual Hospital Map</h4>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="MapPinIcon" className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 dark:text-slate-400">Interactive Hospital Map</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Click to navigate</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
              Ground Floor
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
              First Floor
            </button>
          </div>
        </div>

        {/* Department Directory */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Department Directory</h4>
          <div className="space-y-3">
            {[
              { name: 'Emergency Department', location: 'Ground Floor, Wing A', status: 'Open 24/7' },
              { name: 'Outpatient Department', location: 'Ground Floor, Wing B', status: 'Open' },
              { name: 'Inpatient Department', location: 'First Floor, Wing A', status: 'Open' },
              { name: 'Antenatal Clinic', location: 'First Floor, Wing B', status: 'Open' },
              { name: 'Theatre', location: 'Second Floor, Wing A', status: 'Available' },
              { name: 'Laboratory', location: 'Ground Floor, Wing C', status: 'Open' }
            ].map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{dept.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{dept.location}</p>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">{dept.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Quick Navigation</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Emergency', icon: 'AmbulanceIcon', color: 'red' },
            { name: 'OPD', icon: 'UserIcon', color: 'blue' },
            { name: 'IPD', icon: 'ClipboardDocumentListIcon', color: 'green' },
            { name: 'Antenatal', icon: 'UserIcon', color: 'purple' },
            { name: 'Theatre', icon: 'ClipboardDocumentListIcon', color: 'orange' },
            { name: 'Lab', icon: 'ClipboardDocumentListIcon', color: 'indigo' }
          ].map((item, index) => (
            <button key={index} className={`p-4 bg-${item.color}-100 dark:bg-${item.color}-900/20 rounded-lg hover:bg-${item.color}-200 dark:hover:bg-${item.color}-900/30 transition-colors`}>
              <Icon name={item.icon} className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400 mx-auto mb-2`} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewTab />;
      case 'appointments': return <AppointmentsTab />;
      case 'enquiries': return <EnquiriesTab />;
      case 'emergency': return <EmergencyTab />;
      case 'tasks': return <TasksTab />;
      case 'navigation': return <NavigationTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" theme="light" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Doctor Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400">Welcome back, Dr. {user.name || user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Time</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon name="UserIcon" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: 'ChartBarIcon' },
              { id: 'appointments', name: 'Appointments', icon: 'CalendarIcon' },
              { id: 'enquiries', name: 'Enquiries', icon: 'ChatIcon' },
              { id: 'emergency', name: 'Emergency', icon: 'AmbulanceIcon' },
              { id: 'tasks', name: 'Tasks', icon: 'ClipboardDocumentListIcon' },
              { id: 'navigation', name: 'Navigation', icon: 'MapPinIcon' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon name={tab.icon} className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
