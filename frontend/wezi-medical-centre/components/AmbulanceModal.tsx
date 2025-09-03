import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface AmbulanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

interface AmbulanceStatus {
  id: string;
  status: 'requested' | 'dispatched' | 'en-route' | 'arrived';
  estimatedArrival: string;
  currentLocation: string;
  trackingNumber: string;
  distance: string;
}

const AmbulanceModal: React.FC<AmbulanceModalProps> = ({ isOpen, onClose, translations }) => {
  const [step, setStep] = useState<'confirm' | 'tracking'>('confirm');
  const [isRequesting, setIsRequesting] = useState(false);
  const [ambulanceStatus, setAmbulanceStatus] = useState<AmbulanceStatus | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock ambulance data
  const mockAmbulanceData: AmbulanceStatus = {
    id: 'AMB-001',
    status: 'en-route',
    estimatedArrival: '12 minutes',
    currentLocation: 'Near Mzuzu University',
    trackingNumber: 'TRK-2024-001',
    distance: '3.2 km'
  };

  useEffect(() => {
    if (isOpen) {
      // Get user location when modal opens
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log('Location error:', error);
          }
        );
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'tracking' && ambulanceStatus) {
      // Simulate real-time updates
      const interval = setInterval(() => {
        setAmbulanceStatus(prev => {
          if (!prev) return null;
          
          // Simulate status progression
          const statuses: AmbulanceStatus['status'][] = ['requested', 'dispatched', 'en-route', 'arrived'];
          const currentIndex = statuses.indexOf(prev.status);
          
          if (currentIndex < statuses.length - 1) {
            const newStatus = statuses[currentIndex + 1];
            return {
              ...prev,
              status: newStatus,
              estimatedArrival: newStatus === 'arrived' ? 'Arrived' : `${Math.max(1, parseInt(prev.estimatedArrival) - 1)} minutes`
            };
          }
          
          return prev;
        });
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [step, ambulanceStatus]);

  const handleConfirmRequest = async () => {
    setIsRequesting(true);
    
    // Simulate API call
    setTimeout(() => {
      setAmbulanceStatus(mockAmbulanceData);
      setStep('tracking');
      setIsRequesting(false);
    }, 2000);
  };

  const getStatusColor = (status: AmbulanceStatus['status']) => {
    switch (status) {
      case 'requested': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'dispatched': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'en-route': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      case 'arrived': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: AmbulanceStatus['status']) => {
    switch (status) {
      case 'requested': return 'ClockIcon';
      case 'dispatched': return 'TruckIcon';
      case 'en-route': return 'ArrowPathIcon';
      case 'arrived': return 'CheckCircleIcon';
      default: return 'ClockIcon';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <Icon name="XIcon" className="h-5 w-5" />
        </button>
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 pr-12">
              {translations.ambulanceModalTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {translations.ambulanceModalSubtitle}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {step === 'confirm' ? (
            <>
              {/* Emergency Information */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <Icon name="ExclamationTriangleIcon" className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Emergency Request</h3>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                      This will dispatch an ambulance to your current location. Only use in case of medical emergency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {userLocation ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Your Location</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="ExclamationTriangleIcon" className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Location access required for ambulance dispatch
                    </span>
                  </div>
                </div>
              )}

              {/* Confirmation Button */}
              <button
                onClick={handleConfirmRequest}
                disabled={isRequesting || !userLocation}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isRequesting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Icon name="PhoneIcon" className="h-5 w-5" />
                )}
                <span>{isRequesting ? 'Requesting...' : translations.confirmAmbulance}</span>
              </button>
            </>
          ) : (
            <>
              {/* Tracking Information */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircleIcon" className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    {translations.ambulanceRequested}
                  </span>
                </div>
              </div>

              {ambulanceStatus && (
                <div className="space-y-4">
                  {/* Status Card */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Ambulance Status</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ambulanceStatus.status)}`}>
                        {ambulanceStatus.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2">
                        <Icon name={getStatusIcon(ambulanceStatus.status)} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Ambulance {ambulanceStatus.id}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {ambulanceStatus.currentLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                        {translations.estimatedArrival}
                      </h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {ambulanceStatus.estimatedArrival}
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Distance</h4>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {ambulanceStatus.distance}
                      </p>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      {translations.trackingNumber}
                    </h4>
                    <p className="text-lg font-mono text-blue-800 dark:text-blue-200">
                      {ambulanceStatus.trackingNumber}
                    </p>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Emergency Contact</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      If you need immediate assistance, call: <strong>+265 1 123 456</strong>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceModal;
