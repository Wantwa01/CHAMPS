import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

interface BookingData {
  date: string;
  time: string;
  doctor: string;
  service: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reasonForVisit: string;
  paymentMethod: string;
}

interface ReceiptData {
  bookingId: string;
  date: string;
  time: string;
  doctor: string;
  service: string;
  patientName: string;
  amount: number;
  paymentMethod: string;
  status: 'confirmed' | 'pending';
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, translations, isLoggedIn, onLoginRequired }) => {
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    time: '',
    doctor: '',
    service: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    reasonForVisit: '',
    paymentMethod: 'card'
  });
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const doctors = [
    { id: 'dr1', name: 'Dr. John Smith', specialty: 'General Medicine' },
    { id: 'dr2', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: 'dr3', name: 'Dr. Michael Brown', specialty: 'Pediatrics' },
    { id: 'dr4', name: 'Dr. Emily Davis', specialty: 'Gynecology' }
  ];

  const services = [
    { id: 'consultation', name: 'General Consultation', price: 50 },
    { id: 'checkup', name: 'Health Checkup', price: 75 },
    { id: 'vaccination', name: 'Vaccination', price: 30 },
    { id: 'emergency', name: 'Emergency Consultation', price: 100 }
  ];

  const selectedService = services.find(s => s.id === bookingData.service);

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 'form') {
      if (!isLoggedIn) {
        onLoginRequired();
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      handlePayment();
    }
  };

  const generateQRCode = async (receiptData: ReceiptData) => {
    try {
      const qrData = JSON.stringify({
        bookingId: receiptData.bookingId,
        patientName: receiptData.patientName,
        service: receiptData.service,
        doctor: receiptData.doctor,
        date: receiptData.date,
        time: receiptData.time,
        amount: receiptData.amount,
        status: receiptData.status
      });
      
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const newReceipt: ReceiptData = {
        bookingId: `BK-${Date.now()}`,
        date: bookingData.date,
        time: bookingData.time,
        doctor: bookingData.doctor,
        service: bookingData.service,
        patientName: bookingData.patientName,
        amount: selectedService?.price || 0,
        paymentMethod: bookingData.paymentMethod,
        status: 'confirmed'
      };
      
      setReceipt(newReceipt);
      generateQRCode(newReceipt);
      setStep('confirmation');
      setIsProcessing(false);
    }, 3000);
  };

  const downloadReceipt = async () => {
    if (!receipt || !receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `wezi-receipt-${receipt.bookingId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const downloadReceiptText = () => {
    if (!receipt) return;
    
    const receiptContent = `
WEZI MEDICAL CENTRE
Receipt for Appointment Booking

Booking ID: ${receipt.bookingId}
Date: ${receipt.date}
Time: ${receipt.time}
Doctor: ${receipt.doctor}
Service: ${receipt.service}
Patient: ${receipt.patientName}
Amount: $${receipt.amount}
Payment Method: ${receipt.paymentMethod}
Status: ${receipt.status.toUpperCase()}

Thank you for choosing Wezi Medical Centre!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
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
              {translations.bookingModalTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {translations.bookingModalSubtitle}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {step === 'form' && (
            <>
              {/* Login Required Message */}
              {!isLoggedIn && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="InformationCircleIcon" className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Login Required</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        You need to be logged in to book an appointment. Please log in to continue with your booking.
                      </p>
                      <button
                        onClick={onLoginRequired}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Log In to Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {translations.selectDate} *
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {translations.selectTime} *
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {translations.selectDoctor} *
                  </label>
                  <select
                    value={bookingData.doctor}
                    onChange={(e) => handleInputChange('doctor', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {translations.selectService} *
                  </label>
                  <select
                    value={bookingData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {translations.patientName} *
                    </label>
                    <input
                      type="text"
                      value={bookingData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {translations.patientPhone} *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {translations.patientEmail}
                    </label>
                    <input
                      type="email"
                      value={bookingData.patientEmail}
                      onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {translations.reasonForVisit}
                    </label>
                    <textarea
                      value={bookingData.reasonForVisit}
                      onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!bookingData.date || !bookingData.time || !bookingData.doctor || !bookingData.service || !bookingData.patientName || !bookingData.patientPhone}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              {/* Payment Summary */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Appointment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Date & Time:</span>
                    <span className="text-slate-900 dark:text-slate-100">{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Doctor:</span>
                    <span className="text-slate-900 dark:text-slate-100">{bookingData.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Service:</span>
                    <span className="text-slate-900 dark:text-slate-100">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Patient:</span>
                    <span className="text-slate-900 dark:text-slate-100">{bookingData.patientName}</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-600" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-slate-900 dark:text-slate-100">{translations.totalAmount}:</span>
                    <span className="text-blue-600 dark:text-blue-400">${selectedService?.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{translations.paymentMethod}</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={bookingData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <Icon name="CreditCardIcon" className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100">Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={bookingData.paymentMethod === 'mobile_money'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <Icon name="DevicePhoneMobileIcon" className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100">Mobile Money</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{translations.processingPayment}</span>
                    </>
                  ) : (
                    <>
                      <Icon name="CreditCardIcon" className="h-5 w-5" />
                      <span>Pay ${selectedService?.price}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {step === 'confirmation' && receipt && (
            <>
              {/* Success Message */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <Icon name="CheckCircleIcon" className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  {translations.appointmentBooked}
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Your appointment has been confirmed. You will receive a confirmation email shortly.
                </p>
              </div>

              {/* Receipt with QR Code */}
              <div ref={receiptRef} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Wezi Medical Centre</h3>
                  <p className="text-slate-600 dark:text-slate-400">Appointment Receipt</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Receipt Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Booking ID:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Patient:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Date:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Time:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Doctor:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Service:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{receipt.service}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                      <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">MK {receipt.amount}</span>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    {qrCodeDataUrl && (
                      <>
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48 mb-4" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          Scan this QR code at reception for quick check-in
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Receipt */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Receipt</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Booking ID:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-mono">{receipt.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Date:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Time:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Doctor:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Service:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Patient:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="text-slate-900 dark:text-slate-100">${receipt.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Payment Method:</span>
                    <span className="text-slate-900 dark:text-slate-100">{receipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{receipt.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadReceipt}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Icon name="ArrowDownTrayIcon" className="h-5 w-5" />
                <span>{translations.downloadReceipt}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
