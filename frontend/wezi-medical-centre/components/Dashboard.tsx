import React from 'react';
import { AmbulanceRequest, Appointment, PatientView, User } from '../types';
import { Icon } from './Icon';
import { AmbulanceTracker } from './AmbulanceTracker';

const DUMMY_APPOINTMENTS: Appointment[] = [
  { id: '1', doctor: 'Aureen Harazie', department: 'General Check-up', date: 'Oct 28, 2024', time: '10:30 AM' },
  { id: '2', doctor: 'Daniel Jere', department: 'Dental Cleaning', date: 'Nov 12, 2024', time: '02:00 PM' },
];

interface DashboardProps {
  user: User;
  setActiveView: (view: PatientView) => void;
  activeAmbulanceRequest?: AmbulanceRequest | null;
  onCompleteAmbulanceRun: (id: string) => void;
}

const ActionCard: React.FC<{ title: string; icon: React.ComponentProps<typeof Icon>['name']; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-300">
        <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <Icon name={icon} className="w-7 h-7" />
        </div>
        <div>
            <h4 className="text-lg font-bold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">Access this feature</p>
        </div>
        <Icon name="arrowRight" className="w-5 h-5 text-slate-400 ml-auto" />
    </div>
);

const PatientAppointmentRow: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-200/80 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-full">
          <Icon name="calendar" className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800">{appointment.department}</p>
          <p className="text-sm text-slate-500">with Dr. {appointment.doctor}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-700">{appointment.date}</p>
        <p className="text-sm text-slate-500">{appointment.time}</p>
      </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ user, setActiveView, activeAmbulanceRequest, onCompleteAmbulanceRun }) => {
  return (
    <div className="space-y-8">
      {activeAmbulanceRequest && (
        <AmbulanceTracker 
          request={activeAmbulanceRequest} 
          onComplete={onCompleteAmbulanceRun} 
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Upcoming Appointments</h3>
                 <div className="space-y-1">
                  {DUMMY_APPOINTMENTS.length > 0 ? (
                    DUMMY_APPOINTMENTS.map(app => <PatientAppointmentRow key={app.id} appointment={app} />)
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500">No upcoming appointments.</p>
                    </div>
                  )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard title="Book an Appointment" icon="calendar" onClick={() => setActiveView(PatientView.BOOKING)} />
                <ActionCard title="AI Health Assistant" icon="chat" onClick={() => setActiveView(PatientView.CHAT)} />
                <ActionCard title="Virtual Hospital Map" icon="map" onClick={() => setActiveView(PatientView.MAP)} />
                <ActionCard title="My Medical Records" icon="records" onClick={() => setActiveView(PatientView.RECORDS)} />
            </div>
        </div>
        
        <div className="space-y-8">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 text-center">
                 <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-4">
                    <Icon name="ambulance" className="w-8 h-8 text-red-600"/>
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">Emergency?</h3>
                 <p className="text-slate-500 mt-2 mb-4">Request an ambulance for critical situations.</p>
                 <button 
                    onClick={() => setActiveView(PatientView.AMBULANCE_BOOKING)} 
                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
                >
                    Request Now
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
