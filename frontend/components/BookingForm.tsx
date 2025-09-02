import React, { useState } from 'react';

export const BookingForm: React.FC = () => {
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ department, doctor, date, reason });
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto text-center">
             <div className="text-6xl mb-4">🎉</div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Appointment Submitted!</h3>
             <p className="text-slate-600 mb-6">Your request has been received. We will confirm your appointment shortly via email.</p>
             <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300"
             >
                 Book Another
             </button>
        </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Schedule an Appointment</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="" disabled>Select a department</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
            <option value="Diagnostics">Diagnostics</option>
            <option value="Dental">Dental</option>
            <option value="Outpatient (OPD)">Outpatient (OPD)</option>
          </select>
        </div>
        <div>
          <label htmlFor="doctor" className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="" disabled>Select a doctor</option>
            <option value="Aureen Harazie">Dr. Aureen Harazie</option>
            <option value="Emmnuel Sogolera">Dr. Emmnuel Sogolera</option>
            <option value="Daniel Jere">Dr. Daniel Jere</option>
            <option value="George Tembo">Dr. George Tembo</option>
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
          <input
            type="date"
            id="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
          <textarea
            id="reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe the reason for your appointment..."
            className="w-full p-3 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};