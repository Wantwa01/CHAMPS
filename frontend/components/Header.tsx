import React from 'react';
import { User } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
  user: User;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ user, title }) => {
  return (
    <header className="sticky top-0 z-10 p-6 bg-slate-50/75 backdrop-blur-lg border-b border-slate-900/10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">{title.replace('_', ' ')}</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p className="text-sm text-slate-500 capitalize">{user.role} Role</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg">
             <Icon name="user" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};