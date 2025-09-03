import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User, AmbulanceRequest } from '../types';
import Logo from './Logo';

interface AmbulanceDashboardProps {
  user: User;
}

const AmbulanceDashboard: React.FC<AmbulanceDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState('overview');
  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: -11.4567, lng: 34.0285 }); // Mzuzu coordinates
  const [vehicleStatus, setVehicleStatus] = useState('available');
  const [emergencyStats, setEmergencyStats] = useState({
    totalRequests: 0,
    completedToday: 0,
    averageResponseTime: 0,
    activeRequests: 0
  });

  // Mock data initialization
  useEffect(() => {
    // Mock ambulance requests
    setAmbulanceRequests([
      {
        id: '1',
        location: 'Area 3, Mzuzu',
        contact: '+265 99 123 4567',
        priority: 'High',
        details: 'Cardiac emergency - chest pain and difficulty breathing',
        status: 'en-route',
        patientId: 'P001',
        eta: 8,
        initialEta: 15
      },
      {
        id: '2',
        location: 'Chibavi, Mzuzu',
        contact: '+265 88 234 5678',
        priority: 'Critical',
        details: 'Maternity emergency - labor pains, water broken',
        status: 'dispatched',
        patientId: 'P002',
        eta: 12,
        initialEta: 20
      },
      {
        id: '3',
        location: 'Katoto, Mzuzu',
        contact: '+265 77 345 6789',
        priority: 'Medium',
        details: 'Accident - minor injuries, no immediate danger',
        status: 'completed',
        patientId: 'P003',
        eta: 0,
        initialEta: 25
      }
    ]);

    // Mock emergency stats
    setEmergencyStats({
      totalRequests: 47,
      completedToday: 12,
      averageResponseTime: 8.5,
      activeRequests: 2
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'en-route': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'arrived': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Requests</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{emergencyStats.activeRequests}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Urgent cases</p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
              <Icon name="AmbulanceIcon" className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed Today</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{emergencyStats.completedToday}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Successful runs</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Icon name="ShieldCheckIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{emergencyStats.averageResponseTime}m</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Target: 10m</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Vehicle Status</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 capitalize">{vehicleStatus}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Ready for dispatch</p>
            </div>
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl">
              <Icon name="AmbulanceIcon" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Location & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Current Location</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="MapPinIcon" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Current Position</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Wezi Medical Centre, Mzuzu</p>
                </div>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">At Base</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Icon name="ShieldCheckIcon" className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Vehicle Status</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fully equipped and ready</p>
                </div>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Ready</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Icon name="UserIcon" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Crew Status</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Driver + Paramedic on duty</p>
                </div>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Available</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Live Map</h3>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="MapPinIcon" className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 dark:text-slate-400">Interactive Map</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Real-time tracking</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Center Map
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Share Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RequestsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Emergency Requests</h3>
        <div className="flex space-x-3">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Emergency Protocol
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ambulanceRequests.map((request) => (
          <div key={request.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency Request #{request.id}</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Location:</strong> {request.location}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Contact:</strong> {request.contact}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Patient ID:</strong> {request.patientId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Details:</strong> {request.details}
                    </p>
                    {request.eta && request.eta > 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <strong>ETA:</strong> {request.eta} minutes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {request.status === 'dispatched' && (
                <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Start Journey
                </button>
              )}
              {request.status === 'en-route' && (
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Mark Arrived
                </button>
              )}
              {request.status === 'arrived' && (
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Complete Mission
                </button>
              )}
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Call Patient
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrackingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Live Tracking</h3>
        <div className="flex space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Start Tracking
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Share Location
          </button>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Real-time Location</h4>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-xl h-96 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MapPinIcon" className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">Live GPS Tracking</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Real-time ambulance location</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Satellite View
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Traffic Info
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Route Options
          </button>
        </div>
      </div>

      {/* Tracking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Speed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45 km/h</p>
            </div>
            <Icon name="ChartBarIcon" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Distance to Destination</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">3.2 km</p>
            </div>
            <Icon name="MapPinIcon" className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Arrival</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8 min</p>
            </div>
            <Icon name="ClockIcon" className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const EquipmentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Equipment & Supplies</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Check Equipment
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105">
            Restock
          </button>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Oxygen Tank', status: 'Full', level: 100, color: 'green' },
          { name: 'Defibrillator', status: 'Ready', level: 100, color: 'green' },
          { name: 'First Aid Kit', status: 'Complete', level: 95, color: 'green' },
          { name: 'Stretcher', status: 'Ready', level: 100, color: 'green' },
          { name: 'IV Fluids', status: 'Low', level: 30, color: 'yellow' },
          { name: 'Medications', status: 'Stocked', level: 85, color: 'green' }
        ].map((item, index) => (
          <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                item.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                item.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Level</span>
                <span className="text-slate-900 dark:text-slate-100">{item.level}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.level}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Protocols */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Emergency Protocols</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Cardiac Emergency', protocol: 'CPR + Defibrillator', time: 'Immediate' },
            { name: 'Trauma', protocol: 'Stabilize + Transport', time: '5 minutes' },
            { name: 'Maternity', protocol: 'Monitor + Support', time: 'Immediate' },
            { name: 'Respiratory', protocol: 'Oxygen + Ventilation', time: '2 minutes' }
          ].map((protocol, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">{protocol.name}</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{protocol.protocol}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Response time: {protocol.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewTab />;
      case 'requests': return <RequestsTab />;
      case 'tracking': return <TrackingTab />;
      case 'equipment': return <EquipmentTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" theme="light" />
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ambulance Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back, {user.name || user.username}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Emergency response and patient transport</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Vehicle Status</p>
              <p className="font-medium text-green-600 dark:text-green-400 capitalize">{vehicleStatus}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl">
              <Icon name="AmbulanceIcon" className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'ChartBarIcon' },
              { id: 'requests', name: 'Emergency Requests', icon: 'AmbulanceIcon' },
              { id: 'tracking', name: 'Live Tracking', icon: 'MapPinIcon' },
              { id: 'equipment', name: 'Equipment', icon: 'ShieldCheckIcon' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon name={tab.icon} className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
