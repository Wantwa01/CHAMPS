
import React from 'react';
import { Appointment } from '../types';
import { Icon } from './Icon';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon name="calendar" className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{appointment.department}</p>
          <p className="text-sm text-slate-500">Dr. {appointment.doctor}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-slate-700">{appointment.date}</p>
        <p className="text-sm text-slate-500">{appointment.time}</p>
      </div>
    </div>
  );
};
