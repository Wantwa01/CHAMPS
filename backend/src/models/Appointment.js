// src/models/Appointment.js
const { Schema, model, Types } = require('mongoose');
const { AppointmentStatus, Priority } = require('./enums');

const AppointmentSchema = new Schema({
  patient: { type: Types.ObjectId, ref: 'Patient', required: true },
  staff: { type: Types.ObjectId, ref: 'Staff' }, // which clinician if booked
  serviceType: { type: String, required: true }, // 'OPD', 'specialist', 'ambulance', etc.
  status: { type: String, enum: AppointmentStatus, default: 'pending' },
  scheduledTime: { type: Date, required: true },
  priority: { type: String, enum: Object.values(Priority), default: 'normal' },
  paymentStatus: { type: String, enum: ['pending','paid','waived'], default: 'pending' },
  source: { type: String, default: 'web' }, // web/kiosk/sms
  notes: { type: String },
  createdBy: { type: Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

module.exports = model('Appointment', AppointmentSchema);
