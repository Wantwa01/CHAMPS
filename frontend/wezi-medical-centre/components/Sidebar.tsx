import React from 'react';
import { PatientView, Role, User } from '../types';
import { Icon } from './Icon';

interface SidebarProps {
  user: User;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

type NavItem = {
  view: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
};

const navItemsByRole: Record<Role, NavItem[]> = {
  [Role.PATIENT]: [
    { view: PatientView.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { view: PatientView.BOOKING, label: 'Book Appointment', icon: 'calendar' },
    { view: PatientView.MAP, label: 'Virtual Map', icon: 'map' },
    { view: PatientView.CHAT, label: 'AI Health Assistant', icon: 'chat' },
    { view: PatientView.RECORDS, label: 'Medical Records', icon: 'records' },
  ],
  [Role.DOCTOR]: [
    { view: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { view: 'schedule', label: 'My Schedule', icon: 'calendar' },
    { view: 'patients', label: 'Patient Records', icon: 'records' },
  ],
  [Role.ADMIN]: [
    { view: 'dashboard', label: 'Dashboard', icon: 'shieldCheck' },
    { view: 'users', label: 'Manage Users', icon: 'user' },
    { view: 'analytics', label: 'Hospital Analytics', icon: 'dashboard' },
  ],
  [Role.AMBULANCE]: [
    { view: 'dashboard', label: 'Dashboard', icon: 'ambulance' },
    { view: 'map', label: 'Live Map', icon: 'map' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, onLogout }) => {
  const navItems = navItemsByRole[user.role] || [];
  
  return (
    <aside className="w-64 bg-white/95 backdrop-blur-lg p-5 flex flex-col h-screen fixed shadow-xl border-r border-slate-200/80">
      <div className="flex items-center gap-2 mb-12 px-2">
        <Icon name="brand" className="w-8 h-8 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Wezi Medical</h1>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-left transition-all duration-300 transform group ${
              activeView === item.view
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon name={item.icon} className="w-5 h-5 transition-transform duration-300" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
      <div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-left text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <Icon name="logout" className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};
