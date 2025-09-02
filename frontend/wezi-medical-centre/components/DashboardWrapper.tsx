import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './DashboardApp';
import { AmbulanceRequest } from '../types';

// Mock ambulance requests - start with completed requests to avoid constant updates
const MOCK_AMBULANCE_REQ: AmbulanceRequest[] = [
    { id: '1', location: '123 Chipembere Hwy, Mzuzu', contact: '099-XXX-XXXX', priority: 'High', details: 'Reported chest pains', status: 'completed' },
    { id: '2', location: 'Mzuzu University Campus', contact: '088-XXX-XXXX', priority: 'Medium', details: 'Minor sports injury', status: 'completed' },
];

const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>(MOCK_AMBULANCE_REQ);
  
  // Ambulance ETA Simulation - only run if there are active requests
  useEffect(() => {
    const hasActiveRequests = ambulanceRequests.some(req => 
      req.status === 'en-route' && req.eta && req.eta > 0
    );
    
    if (!hasActiveRequests) return;

    const interval = setInterval(() => {
      setAmbulanceRequests(prevRequests => {
        const updatedRequests = prevRequests.map(req => {
          if (req.status === 'en-route' && req.eta && req.eta > 0) {
            return { ...req, eta: req.eta - 1 };
          }
          if (req.status === 'en-route' && req.eta === 1) {
             return { ...req, eta: 0, status: 'arrived' };
          }
          return req;
        });
        
        // Check if we still have active requests after update
        const stillHasActiveRequests = updatedRequests.some(req => 
          req.status === 'en-route' && req.eta && req.eta > 0
        );
        
        // If no more active requests, we can stop the interval
        if (!stillHasActiveRequests) {
          clearInterval(interval);
        }
        
        return updatedRequests;
      });
    }, 10000); // Update every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, [ambulanceRequests.length]); // Only re-run when the number of requests changes

  const handleAmbulanceRequest = useCallback((data: Omit<AmbulanceRequest, 'id' | 'priority' | 'status'>) => {
    if (!user) return;

    const initialEta = Math.floor(Math.random() * 10) + 10; // Random ETA between 10-20 mins
    
    const newRequest: AmbulanceRequest = {
        ...data,
        id: `REQ-${Date.now()}`,
        priority: 'High',
        status: 'dispatched',
        patientId: user.id,
        eta: initialEta,
        initialEta: initialEta,
    };
    
    // Simulate dispatch delay
    setTimeout(() => {
        setAmbulanceRequests(prev => prev.map(r => r.id === newRequest.id ? {...r, status: 'en-route'} : r));
    }, 3000);

    setAmbulanceRequests(prev => [newRequest, ...prev]);
  }, [user]);

  const handleCompleteAmbulanceRun = useCallback((id: string) => {
    setAmbulanceRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'completed' } : req
    ));
  }, []);

  if (!user) return null;

  // Import the AppLayout component dynamically to avoid circular imports
  const AppLayout = React.lazy(() => import('./DashboardApp').then(module => ({ default: module.default })));

  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AppLayout 
        ambulanceRequests={ambulanceRequests} 
        onAmbulanceRequest={handleAmbulanceRequest}
        onCompleteAmbulanceRun={handleCompleteAmbulanceRun}
      />
    </React.Suspense>
  );
};

export default DashboardWrapper;
