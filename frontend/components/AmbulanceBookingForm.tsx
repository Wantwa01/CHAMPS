import React, { useState } from 'react';
// Define the AmbulanceRequest type here since '../types' is missing
export interface AmbulanceRequest {
  id: string;
  location: string;
  contact: string;
  details: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'dispatched' | 'completed';
}
import { Icon } from './Icon';

interface AmbulanceBookingFormProps {
    onSubmit: (data: Omit<AmbulanceRequest, 'id' | 'priority' | 'status'>) => void;
}

export const AmbulanceBookingForm: React.FC<AmbulanceBookingFormProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !contact || !details) return;
    onSubmit({ location, contact, details });
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
        <div className="text-center py-8">
             <div className="text-6xl mb-4">✅</div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h3>
             <p className="text-slate-600">Help is on the way. An ambulance has been dispatched to your location.</p>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-center text-slate-600 mb-6">Please provide the following details for immediate assistance. This service is for emergencies only.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Incident Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="e.g., Corner of M1 and Chipembere Hwy"
            required
          />
        </div>
        <div>
            <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon name="phone" className="w-5 h-5 text-slate-400" />
                </span>
                <input
                    type="tel"
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full pl-10 p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="099-XXX-XXXX"
                    required
                />
            </div>
        </div>
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">Emergency Details</label>
          <textarea
            id="details"
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Briefly describe the situation..."
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Confirm and Dispatch
          </button>
        </div>
      </form>
    </div>
  );
};