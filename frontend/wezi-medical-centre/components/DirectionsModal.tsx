import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

const DirectionsModal: React.FC<DirectionsModalProps> = ({ isOpen, onClose, translations }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const hospitalLocation = {
    lat: -11.4526, // Mzuzu, Malawi coordinates
    lng: 34.0078,
    address: translations.hospitalAddress
  };

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBir7etSMeOUP070dCfLOZLKlGZnCJEK6U';

  // Load Google Maps API
  useEffect(() => {
    if (isOpen && !isGoogleMapsLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      document.head.appendChild(script);

      return () => {
        // Cleanup script if component unmounts
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [isOpen, isGoogleMapsLoaded]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        // Calculate distance and duration using Google Maps
        if (isGoogleMapsLoaded && window.google) {
          calculateDistanceAndDuration(location);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please try again.');
        setIsLoadingLocation(false);
      }
    );
  };

  const calculateDistanceAndDuration = (origin: { lat: number; lng: number }) => {
    if (!window.google) return;

    const service = new window.google.maps.DistanceMatrixService();
    const destination = new window.google.maps.LatLng(hospitalLocation.lat, hospitalLocation.lng);
    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);

    service.getDistanceMatrix(
      {
        origins: [originLatLng],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status === 'OK' && response && response.rows[0] && response.rows[0].elements[0]) {
          const element = response.rows[0].elements[0];
          setDistance(element.distance.text);
          setDuration(element.duration.text);
        } else {
          setDistance('Unable to calculate');
          setDuration('Unable to calculate');
        }
      }
    );
  };

  const openInMaps = () => {
    if (userLocation) {
      const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospitalLocation.lat},${hospitalLocation.lng}`;
      window.open(directionsUrl, '_blank');
    } else {
      const hospitalUrl = `https://www.google.com/maps/search/?api=1&query=${hospitalLocation.lat},${hospitalLocation.lng}`;
      window.open(hospitalUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <Icon name="XIcon" className="h-5 w-5" />
        </button>
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pr-12">
              {translations.directionsModalTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {translations.directionsModalSubtitle}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hospital Information */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2">
                <Icon name="MapPinIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Wezi Medical Centre</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{hospitalLocation.address}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Coordinates: {hospitalLocation.lat}, {hospitalLocation.lng}
                </p>
              </div>
            </div>
          </div>

          {/* Location Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Get Directions
            </h3>
            
            {!userLocation ? (
              <div className="space-y-4">
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoadingLocation ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Icon name="MapPinIcon" className="h-5 w-5" />
                  )}
                  <span>{isLoadingLocation ? 'Getting Location...' : translations.getCurrentLocation}</span>
                </button>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-800 dark:text-green-200 text-sm">
                      Location found! Ready to get directions.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Your Location</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Distance & Duration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {distance && duration ? `${distance} • ${duration}` : 'Calculating...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={openInMaps}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="MapIcon" className="h-5 w-5" />
              <span>{translations.openInMaps}</span>
            </button>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="InformationCircleIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Parking Information</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Free parking is available on-site. Emergency entrance is clearly marked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionsModal;
