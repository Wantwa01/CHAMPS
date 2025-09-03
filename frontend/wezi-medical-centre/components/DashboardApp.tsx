import React, { useState, createContext, useContext, useEffect } from 'react';
import { PatientView, User, Role, AdminStats, DoctorAppointment, AmbulanceRequest, Task, BarChartData } from '../types';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Dashboard } from './Dashboard';
import { Icon } from './Icon';
import { authService } from '../services/authService';

// --- AUTHENTICATION CONTEXT ---
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = React.useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    user,
    login,
    logout,
    loading,
    error
  }), [user, login, logout, loading, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- MOCK DATA FOR DASHBOARDS ---
const MOCK_DOCTOR_APPTS: DoctorAppointment[] = [
    { id: '1', patientName: 'Patience Banda', time: '09:15 AM', reason: 'Golden Oak Medical Center', status: 'Consulted' },
    { id: '2', patientName: 'Ceaser Kalikunde', time: '09:30 AM', reason: 'Golden Oak Medical Center', status: 'Consulted' },
    { id: '3', patientName: 'Vanesa Pemba', time: '10:30 AM', reason: 'Clearwater Valley Hospital', status: 'Confirmed' },
    { id: '4', patientName: 'Jones Thukuta', time: '08:30 AM', reason: 'Golden Oak Medical Center', status: 'Reschedule' },
];
const MOCK_AMBULANCE_REQ: AmbulanceRequest[] = [
    { id: '1', location: '123 Chipembere Hwy, Mzuzu', contact: '099-XXX-XXXX', priority: 'High', details: 'Reported chest pains', status: 'en-route' },
    { id: '2', location: 'Mzuzu University Campus', contact: '088-XXX-XXXX', priority: 'Medium', details: 'Minor sports injury', status: 'on-site' },
];

const MOCK_ADMIN_TASKS: Task[] = [
  { id: '1', patientName: 'Shalom Mbewe', idCode: '#00-128', age: 36, createdDate: 'Feb 22nd, 2024', dueDate: 'Mar 20th, 2024', status: 'Not started' },
  { id: '2', patientName: 'Jones Thukuta', idCode: '#00-127', age: 32, createdDate: 'Jan 5th, 2024', dueDate: 'May 15th, 2024', status: 'In progress' },
  { id: '3', patientName: 'Vanesa Pemba', idCode: '#00-126', age: 28, createdDate: 'Jan 5th, 2024', dueDate: 'May 15th, 2024', status: 'Completed' },
  { id: '4', patientName: 'Augustine Kasolota', idCode: '#00-125', age: 41, createdDate: 'Mar 1st, 2024', dueDate: 'Mar 30th, 2024', status: 'In progress' },
];
const MOCK_PATIENT_STATS_CHART: BarChartData[] = [
  { label: 'Oct 23', value: 280 }, { label: 'Nov 23', value: 450 }, { label: 'Dec 23', value: 680 },
  { label: 'Jan 24', value: 920 }, { label: 'Feb 24', value: 500 }, { label: 'Mar 24', value: 750 },
  { label: 'Apr 24', value: 480 }, { label: 'May 24', value: 650 }, { label: 'Jun 24', value: 850 },
];
const MOCK_DOCTOR_VISITS_CHART: BarChartData[] = [
    {label: 'Jan', value: 150}, {label: 'Feb', value: 220}, {label: 'Mar', value: 180},
    {label: 'Apr', value: 300}, {label: 'May', value: 250}, {label: 'Jun', value: 400},
    {label: 'Jul', value: 436}, {label: 'Aug', value: 380}, {label: 'Sep', value: 290},
    {label: 'Oct', value: 310}, {label: 'Nov', value: 250}, {label: 'Dec', value: 350},
];
const MOCK_ADMIN_APPOINTMENTS = [
    { id: '1', name: 'Mark M.', specialty: 'Health Assessment', time: '08:45am', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Adina G.', specialty: 'Consultation Cardiology', time: '11:15am', img: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: '3', name: 'Joey F.', specialty: 'Ensure your child\'s wellness', time: '12:45pm', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
]

// --- ROLE-SPECIFIC COMPONENTS ---

// ADMIN (HealthHub Style)
const AdminStatCard: React.FC<{ title: string; value: string; change: string; changeType: 'up' | 'down'; from: string; icon: React.ComponentProps<typeof Icon>['name']; }> = ({ title, value, change, changeType, from, icon }) => (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 transition-transform transform hover:-translate-y-1.5 hover:shadow-2xl">
        <div className="flex justify-between items-start">
            <p className="text-md font-medium text-slate-500">{title}</p>
            <Icon name={icon} className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-4xl font-bold text-slate-800 mt-2">{value}</p>
        <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 text-sm font-semibold ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <Icon name={changeType === 'up' ? 'arrow-up' : 'arrow-down'} className="w-4 h-4" />
                <span>{change}</span>
            </div>
            <p className="text-sm text-slate-400">{from}</p>
        </div>
    </div>
);

const CalendarWidget: React.FC = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dates = [29, 30, 31, 1, 2, 3, 4, 5];
    return (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700">February, 2024</h4>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map(d => <div key={d} className="text-xs font-bold text-slate-400">{d}</div>)}
                {dates.map((d, i) => (
                    <div key={i} className={`p-2 rounded-full text-sm font-semibold ${d > 20 ? 'text-slate-300' : 'text-slate-600'} ${d === 1 ? 'bg-blue-600 text-white' : ''}`}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

const UpcomingAppointmentsAdmin: React.FC = () => (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
        <h4 className="font-bold text-slate-700 mb-4">Upcoming Appointments</h4>
        <div className="space-y-4">
            {MOCK_ADMIN_APPOINTMENTS.map(appt => (
                <div key={appt.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-slate-800">{appt.name}</p>
                            <p className="text-xs text-slate-500">{appt.specialty}</p>
                        </div>
                    </div>
                    <div className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{appt.time}</div>
                </div>
            ))}
        </div>
    </div>
);

const TaskManagementTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const statusColor: Record<Task['status'], string> = {
        'Not started': 'bg-slate-200 text-slate-600',
        'In progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    }
    return (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Task Management</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="text-sm font-semibold text-slate-500 border-b border-slate-200">
                        <th className="py-3">Assigned To</th><th className="py-3">ID Code</th><th className="py-3">Age</th><th className="py-3">Created date</th><th className="py-3">Due date</th><th className="py-3">Status</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className="border-b border-slate-200/80 last:border-0">
                            <td className="py-4 font-semibold text-slate-700">{task.patientName}</td>
                            <td className="py-4 text-slate-500">{task.idCode}</td>
                            <td className="py-4 text-slate-500">{task.age}</td>
                            <td className="py-4 text-slate-500">{task.createdDate}</td>
                            <td className="py-4 text-slate-500">{task.dueDate}</td>
                            <td className="py-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColor[task.status]}`}>{task.status}</span></td>
                            <td className="py-4"><button className="text-slate-400 hover:text-slate-800"><Icon name="ellipsis-vertical" className="w-5 h-5"/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminDashboard: React.FC = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard title="Total Patients" value="1500" change="4.6%" changeType="up" from="From last week" icon="users" />
            <AdminStatCard title="Total Diagnoses" value="900" change="11.6%" changeType="up" from="Diabetes diagnosed" icon="clipboard-document-list" />
            <AdminStatCard title="Appointments Scheduled" value="350" change="11.6%" changeType="down" from="Attended appointments" icon="calendar" />
            <AdminStatCard title="Overall Visitors" value="5,603" change="52%" changeType="up" from="Last 6 months" icon="chart-bar" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Patient Statistics</h3>
                    <div className="h-64 flex items-center justify-center text-slate-500">
                        Chart visualization would go here
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <CalendarWidget />
                <UpcomingAppointmentsAdmin />
            </div>
        </div>
        <div>
            <TaskManagementTable tasks={MOCK_ADMIN_TASKS} />
        </div>
    </div>
);

// DOCTOR (HealthCare Style)
const DoctorWelcomeCard: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex justify-between items-center">
        <div>
            <h3 className="text-2xl font-bold text-slate-800">Welcome back, {name}!</h3>
            <p className="text-slate-500 mt-1">You have {MOCK_DOCTOR_APPTS.filter(a => a.status === 'Confirmed').length} appointments today!</p>
        </div>
        <div className="w-40 h-24 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon name="stethoscope" className="w-16 h-16 text-blue-300"/>
        </div>
    </div>
);

const DoctorStatCard: React.FC<{ title: string; value: string | number; color: string; children?: React.ReactNode; className?: string }> = ({ title, value, color, children, className }) => (
    <div className={`p-5 rounded-2xl shadow-lg border border-slate-200/80 ${color} ${className}`}>
        <p className="text-md font-semibold text-slate-700">{title}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-4xl font-bold text-slate-900">{value}</p>
            {children}
        </div>
    </div>
);

const DoctorAppointmentRow: React.FC<{ appt: DoctorAppointment }> = ({ appt }) => {
    const statusClasses: Record<DoctorAppointment['status'], string> = {
        'Consulted': 'text-green-600',
        'Confirmed': 'text-blue-600',
        'Reschedule': 'text-yellow-600',
        'completed': '', 'upcoming': '', // Default cases
    }
    return (
        <div className="flex items-center p-4 border-b border-slate-200/80 last:border-0">
            <p className="w-1/4 font-semibold text-slate-600">{appt.time}</p>
            <p className="w-1/2 text-slate-500">{appt.reason}</p>
            <p className="w-1/4 font-semibold text-slate-800">{appt.patientName}</p>
            <p className={`w-1/4 text-right font-bold ${statusClasses[appt.status]}`}>{appt.status}</p>
        </div>
    );
};

const DoctorDashboard: React.FC = () => (
    <div className="space-y-6">
        <DoctorWelcomeCard name="Dr. Aureen Harazie" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Today's Appointment</h3>
                        <button className="text-sm font-semibold text-blue-600">View All</button>
                     </div>
                     <div>
                        {MOCK_DOCTOR_APPTS.map(appt => <DoctorAppointmentRow key={appt.id} appt={appt} />)}
                     </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Average Patient Visits (Last 12 Months)</h3>
                    <div className="h-64 flex items-center justify-center text-slate-500">
                        Chart visualization would go here
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <DoctorStatCard title="Total Appointments" value={50} color="bg-white">
                    <Icon name="chart-bar" className="w-12 h-12 text-blue-300"/>
                </DoctorStatCard>
                 <div className="grid grid-cols-2 gap-6">
                    <DoctorStatCard title="Total Patients" value={108} color="bg-white" className="col-span-2"/>
                    <DoctorStatCard title="Active Patients" value={82} color="bg-white" />
                    <DoctorStatCard title="Pending Invoices" value={12} color="bg-white" />
                 </div>
            </div>
        </div>
    </div>
);

// AMBULANCE
const AmbulanceRequestCard: React.FC<{ req: AmbulanceRequest }> = ({ req }) => (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="font-bold text-slate-800 text-lg">{req.location}</p>
                <p className="text-sm text-slate-500">{req.details}</p>
                 <p className="text-sm font-semibold text-slate-600 mt-2">Contact: {req.contact}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${req.priority === 'High' ? 'bg-red-100 text-red-800' : (req.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}`}>{req.status === 'new' ? 'New' : req.priority}</span>
        </div>
         <div className="flex justify-end items-center gap-2">
             <span className="text-sm font-semibold text-indigo-600 capitalize">{req.status.replace('-', ' ')}</span>
        </div>
    </div>
);

const AmbulanceDashboard: React.FC<{ requests: AmbulanceRequest[] }> = ({ requests }) => (
    <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Active Requests</h3>
        <div className="space-y-4">
            {requests.length > 0 ? requests.filter(r => r.status !== 'completed').map(req => <AmbulanceRequestCard key={req.id} req={req} />) : (
                <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">No active ambulance requests.</p>
                </div>
            )}
        </div>
    </div>
);

const MockFeatureViewer: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-200 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 capitalize">{title}</h3>
        <p className="text-slate-500 max-w-md mx-auto">This feature is currently under development. Please check back later for updates.</p>
    </div>
);

// --- LAYOUT & PAGE COMPONENTS ---

const AppLayout: React.FC<{
  ambulanceRequests: AmbulanceRequest[];
  onAmbulanceRequest: (data: Omit<AmbulanceRequest, 'id' | 'priority' | 'status'>) => void;
  onCompleteAmbulanceRun: (id: string) => void;
}> = ({ ambulanceRequests, onAmbulanceRequest, onCompleteAmbulanceRun }) => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  
  if (!user) return null;

  const activeAmbulanceRequestForPatient = ambulanceRequests.find(
    (r) => r.patientId === user.id && r.status !== 'completed'
  );
  
  const handlePatientAmbulanceRequest = (data: Omit<AmbulanceRequest, 'id' | 'priority' | 'status'>) => {
    onAmbulanceRequest(data);
    // For patient, after booking, redirect them back to dashboard to see the tracker
    if(user.role === Role.PATIENT) {
        setTimeout(() => setActiveView(PatientView.DASHBOARD), 2000); // Wait 2s on success message
    }
  };

  const renderContent = () => {
    switch (user.role) {
      case Role.PATIENT:
        switch (activeView) {
          case PatientView.DASHBOARD: return <Dashboard user={user} setActiveView={v => setActiveView(v as PatientView)} activeAmbulanceRequest={activeAmbulanceRequestForPatient} onCompleteAmbulanceRun={onCompleteAmbulanceRun} />;
          case PatientView.BOOKING: return <MockFeatureViewer title="Booking Form" />;
          case PatientView.MAP: return <MockFeatureViewer title="Virtual Map" />;
          case PatientView.CHAT: return <MockFeatureViewer title="AI Health Assistant" />;
          case PatientView.RECORDS: return <MockFeatureViewer title="Medical Records" />;
          case PatientView.AMBULANCE_BOOKING: return <MockFeatureViewer title="Ambulance Booking" />;
          default: return <Dashboard user={user} setActiveView={v => setActiveView(v as PatientView)} activeAmbulanceRequest={activeAmbulanceRequestForPatient} onCompleteAmbulanceRun={onCompleteAmbulanceRun} />;
        }
      case Role.DOCTOR:
        switch(activeView) {
            case 'dashboard': return <DoctorDashboard />;
            default: return <MockFeatureViewer title={activeView} />;
        }
      case Role.ADMIN:
        switch(activeView) {
            case 'dashboard': return <AdminDashboard />;
            default: return <MockFeatureViewer title={activeView} />;
        }
      case Role.AMBULANCE:
        switch(activeView) {
            case 'dashboard': return <AmbulanceDashboard requests={ambulanceRequests} />;
            default: return <MockFeatureViewer title={activeView} />;
        }
      default:
        return <p>No dashboard available for this role.</p>;
    }
  };

  const getTitle = () => {
      if(activeView === 'dashboard') {
          return user.role === Role.ADMIN
            ? `Welcome back, ${user.name.split(' ')[0]}!`
            : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`;
      }
      return activeView.replace('_', ' ');
  }

  return (
    <div 
        className="flex min-h-screen bg-slate-100 font-sans bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')", backgroundAttachment: 'fixed' }}
    >
      <Sidebar user={user} activeView={activeView} setActiveView={setActiveView} onLogout={logout} />
      <div className="flex-1 flex flex-col ml-64 bg-slate-100/80 backdrop-blur-sm">
        <DashboardHeader user={user} title={getTitle()} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div key={activeView} className="animate-fade-in-main">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
