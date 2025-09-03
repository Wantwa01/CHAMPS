import React from 'react';
import { User } from '../types';
import { UserIcon } from './Icons';
import Logo from './Logo';

interface DashboardHeaderProps {
  user: User;
  title: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, title }) => {
  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200/80 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" theme="light" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800">{user.name}</p>
              <p className="text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
