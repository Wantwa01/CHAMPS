import React, { useState, useEffect } from 'react';
import { useAuth } from '../wezi-medical-centre/components/DashboardApp';
import { apiClient } from '../wezi-medical-centre/services/api';
import { CalendarIcon, ClockIcon, UserIcon, CheckIcon, XIcon } from '../wezi-medical-centre/components/Icons';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      setError('Please log in to book appointments');
      return;
    }
    fetchDoctors();
    fetchUserAppointments();
  }, [user]);

  // Fetch doctors when component mounts
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getDoctors();
      setDoctors(response.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch time slots when doctor and date are selected
  const fetchTimeSlots = async (doctorId: string, date: string) => {
    if (!doctorId || !date) return;
    
    try {
      setLoadingSlots(true);
      const response = await apiClient.getDoctorSlots(doctorId, date);
      setTimeSlots(response.data || []);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load available time slots. Please try again.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch user's appointments
  const fetchUserAppointments = async () => {
    if (!user) return;
    
    try {
      setLoadingAppointments(true);
      const response = await apiClient.getUserAppointments();
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load your appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setSelectedTime('');
    setTimeSlots([]);
    if (selectedDate) {
      fetchTimeSlots(doctorId, selectedDate);
    }
  };

  // Handle date selection
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (selectedDoctor) {
      fetchTimeSlots(selectedDoctor, date);
    }
  };

  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle appointment booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to book appointments');
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please select a doctor, date, and time');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const bookingData = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
      };

      const response = await apiClient.bookAppointment(bookingData);
      
      setSuccess('Appointment booked successfully!');
      
      // Reset form
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setTimeSlots([]);
      
      // Refresh appointments list
      fetchUserAppointments();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await apiClient.cancelAppointment(appointmentId);
      setSuccess('Appointment cancelled successfully!');
      fetchUserAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || 'Failed to cancel appointment.');
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Login Required</h3>
        <p className="text-slate-500">Please log in to book appointments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700">{success}</p>
                </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
            <XIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            </div>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Book an Appointment</h2>
        
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <UserIcon className="inline w-4 h-4 mr-1" />
              Select Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="inline w-4 h-4 mr-1" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time Slots */}
          {selectedDoctor && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <ClockIcon className="inline w-4 h-4 mr-1" />
                Select Time
              </label>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 mt-2">Loading available times...</p>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedTime === slot.time
                          ? 'bg-blue-500 text-white border-blue-500'
                          : slot.available
                          ? 'bg-slate-50 border-slate-300 hover:bg-blue-50 hover:border-blue-300'
                          : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No available time slots for this date.</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedDoctor || !selectedDate || !selectedTime}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Booking...
              </div>
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>

      {/* User's Appointments */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Appointments</h2>
        
        {loadingAppointments ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 mt-2">Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Dr. {appointment.doctorName}
                  </h3>
                  <p className="text-slate-600">{appointment.specialty}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                {appointment.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No appointments found.</p>
        )}
      </div>
    </div>
  );
};