import React from 'react';
import { Icon } from './Icon';

interface ServiceCardProps {
  title: string;
  description: string;
  onClick: () => void;
  illustration: React.ReactNode;
  color: 'blue' | 'indigo' | 'sky';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    iconBg: 'bg-blue-200',
    iconText: 'text-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    iconBg: 'bg-indigo-200',
    iconText: 'text-indigo-600',
  },
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    iconBg: 'bg-sky-200',
    iconText: 'text-sky-600',
  },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, onClick, illustration, color }) => {
  const classes = colorClasses[color];

  return (
    <div 
      onClick={onClick} 
      className={`relative p-6 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl group overflow-hidden ${classes.bg} ${classes.text}`}
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-transform duration-500">
        {illustration}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className={`text-sm opacity-80`}>{description}</p>
      </div>
       <div className="relative z-10 mt-6 flex justify-end">
         <div className="w-10 h-10 flex items-center justify-center bg-black/5 rounded-full group-hover:bg-black/10 transition-colors">
            <Icon name="arrowRight" className="w-5 h-5"/>
         </div>
       </div>
    </div>
  );
};