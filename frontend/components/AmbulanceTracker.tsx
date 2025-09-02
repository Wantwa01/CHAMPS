import React from 'react';
import { AmbulanceRequest } from '../types';
import { Icon } from './Icon';

interface AmbulanceTrackerProps {
  request: AmbulanceRequest;
  onComplete: (id: string) => void;
}

export const AmbulanceTracker: React.FC<AmbulanceTrackerProps> = ({ request, onComplete }) => {
  const { eta = 0, initialEta = 1, status } = request;
  const progress = initialEta > 0 ? Math.max(0, Math.min(100, ((initialEta - eta) / initialEta) * 100)) : 0;
  
  const getStatusMessage = () => {
    switch (status) {
        case 'dispatched':
            return 'Dispatched - Awaiting crew';
        case 'en-route':
            return 'En Route - The ambulance is on its way';
        case 'arrived':
            return 'Arrived - The ambulance is at your location';
        default:
            return 'Updating status...';
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-blue-200 mb-10 animate-fade-in-main">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Ambulance Tracking</h3>
            <div className="flex items-center gap-2 text-blue-600">
                <Icon name="ambulance" className="w-6 h-6 animate-pulse" />
                <span className="font-semibold text-lg">{eta > 0 ? `${eta} min ETA` : 'Arriving now'}</span>
            </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-4 mb-2 overflow-hidden">
            <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 font-medium">{getStatusMessage()}</p>
            {status === 'arrived' && (
                 <button 
                    onClick={() => onComplete(request.id)}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Confirm Arrival
                </button>
            )}
        </div>
    </div>
  );
};