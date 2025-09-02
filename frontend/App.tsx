import React, { useState, createContext, useContext, useEffect } from 'react';
import { PatientView, User, Role, AdminStats, DoctorAppointment, AmbulanceRequest, Task, BarChartData } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BookingForm } from './components/BookingForm';
import { VirtualMap } from './components/VirtualMap';
import { Chatbot } from './components/Chatbot';
import { authService } from './services/geminiService';
import { Icon } from './components/Icon';
import { LandingPage } from './components/LandingPage';
import { AmbulanceBookingForm } from './components/AmbulanceBookingForm';
import { AmbulanceTracker } from './components/AmbulanceTracker';
import { BarChart } from './components/BarChart';


// --- AUTHENTICATION CONTEXT ---
interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(email);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
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
                {/* Add prev/next buttons here if needed */}
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
                <BarChart title="Patient Statistics" data={MOCK_PATIENT_STATS_CHART} />
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
            {/* Placeholder for illustration */}
            <svg width="100" height="100" viewBox="0 0 136 82" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M92.054 38.332c.324-3.348-1.1-6.6-3.72-8.892l-2.68-2.34c-2.988-2.615-7.068-3.6-11.004-2.736l-8.436 1.848c-3.936.864-7.02 3.528-8.532 7.164l-1.428 3.48c-1.512 3.636-4.668 6.336-8.604 7.128l-8.436 1.692c-3.936.792-7.056 3.528-8.532 7.164L39.262 61.1c-1.476 3.636-.54 7.812 2.364 10.368l2.688 2.34c2.904 2.556 6.84 3.564 10.74 2.7l8.436-1.848c3.9-.864 7.02-3.564 8.532-7.164l1.428-3.48c1.512-3.636 4.668-6.336 8.604-7.128l8.436-1.692c3.936-.792 6.516-4.212 5.58-8.064l-1.428-5.94z" fill="#D6E6FE" /><path d="M83.432 23.336c2.398-4.32 7.96-6.408 12.892-4.572l6.812 2.556c4.932 1.836 7.416 7.092 5.016 11.412l-2.688 4.788c-2.4 4.32-7.96 6.408-12.892 4.572l-6.812-2.556c-4.932-1.836-7.416-7.092-5.016-11.412l2.688-4.788z" fill="#D6E6FE" /><circle cx="106.326" cy="11.456" r="11" fill="#4A80FF" /><circle cx="28.326" cy="67.456" r="14" fill="#4A80FF" /></svg>
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
                <BarChart title="Average Patient Visits (Last 12 Months)" data={MOCK_DOCTOR_VISITS_CHART} />
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
          case PatientView.BOOKING: return <BookingForm />;
          case PatientView.MAP: return <VirtualMap />;
          case PatientView.CHAT: return <Chatbot />;
          case PatientView.RECORDS: return <MockFeatureViewer title="Medical Records" />;
          case PatientView.AMBULANCE_BOOKING: return <AmbulanceBookingForm onSubmit={handlePatientAmbulanceRequest} />;
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
        <Header user={user} title={getTitle()} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div key={activeView} className="animate-fade-in-main">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const LoginPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans relative">
             <button 
                onClick={onBack} 
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-900 transition-colors p-2 bg-white/70 backdrop-blur-sm rounded-full z-10 shadow-md"
                aria-label="Go back to landing page"
            >
                <Icon name="arrowLeft" className="w-6 h-6" />
            </button>
            <div className="flex w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Image Section */}
                <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974')"}}>
                    <div className="h-full bg-black/30"></div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="w-full">
                        <div className="text-center mb-10">
                            <Icon name="brand" className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                            </h2>
                            <p className="mt-2 text-slate-500">
                                {mode === 'login' ? 'Sign in to access your portal.' : 'Join us to manage your health.'}
                            </p>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {mode === 'signup' && (
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Icon name="user" className="w-5 h-5 text-slate-400" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Full Name"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon name="mail" className="w-5 h-5 text-slate-400" />
                                </span>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="patient@wezi.com"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon name="lock" className="w-5 h-5 text-slate-400" />
                                </span>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Password"
                                />
                            </div>
                            <p className="text-xs text-slate-400 text-center">Hint: Use role@wezi.com (e.g., doctor@...)</p>
                            {error && <p className="text-sm text-red-600 text-center animate-pulse">{error}</p>}
                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all transform hover:scale-105">
                                    {loading ? 'Processing...' : (mode === 'login' ? 'Sign In Securely' : 'Create Account')}
                                </button>
                            </div>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-medium text-blue-600 hover:text-blue-500 ml-2">
                                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-slate-500 hover:text-slate-800 bg-slate-100 rounded-full p-1.5 transition-colors"
                        aria-label="Close"
                    >
                        <Icon name="x" className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>(MOCK_AMBULANCE_REQ);
  
  // Ambulance ETA Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceRequests(prevRequests => 
        prevRequests.map(req => {
          if (req.status === 'en-route' && req.eta && req.eta > 0) {
            return { ...req, eta: req.eta - 1 };
          }
          if (req.status === 'en-route' && req.eta === 1) { // When ETA hits 1, it will become 0 in the next tick. So let's change status now.
             return { ...req, eta: 0, status: 'arrived' };
          }
          return req;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAmbulanceRequest = (data: Omit<AmbulanceRequest, 'id' | 'priority' | 'status'>) => {
    // This function now only gets called from an authenticated context.
    // The !user check is a safeguard but the UI flow prevents this.
    if (!user) {
        setShowLogin(true);
        return;
    }

    const initialEta = Math.floor(Math.random() * 10) + 10; // Random ETA between 10-20 mins
    
    const newRequest: AmbulanceRequest = {
        ...data,
        id: `REQ-${Date.now()}`,
        priority: 'High',
        status: 'dispatched',
        patientId: user.id,
        eta: initialEta,
        initialEta: initialEta,
    };
    
    // Simulate dispatch delay
    setTimeout(() => {
        setAmbulanceRequests(prev => prev.map(r => r.id === newRequest.id ? {...r, status: 'en-route'} : r));
    }, 3000);

    setAmbulanceRequests(prev => [newRequest, ...prev]);
  };

  const handleCompleteAmbulanceRun = (id: string) => {
    setAmbulanceRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'completed' } : req
    ));
  };
  
  if (user) {
    return <AppLayout 
              ambulanceRequests={ambulanceRequests} 
              onAmbulanceRequest={handleAmbulanceRequest}
              onCompleteAmbulanceRun={handleCompleteAmbulanceRun}
            />;
  }
  
  const handleLandingPageAction = () => {
    setShowLogin(true);
  }
  
  const view = showLogin 
    ? <LoginPage onBack={() => setShowLogin(false)} /> 
    : <LandingPage onLoginClick={handleLandingPageAction} onChatbotClick={() => setIsChatOpen(true)} />;

  return (
    <>
      {view}
      <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} title="AI Health Assistant">
        <div className="h-[70vh] -m-8">
          <Chatbot />
        </div>
      </Modal>
    </>
  );
};

export default App;
