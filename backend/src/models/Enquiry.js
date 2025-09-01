// src/models/Enquiry.js
const { Schema, model, Types } = require('mongoose');
const { EnquiryStatus, Priority } = require('./enums');

const MessageSchema = new Schema({
  senderType: { type: String, enum: ['patient','staff'], required: true },
  senderId: { type: Types.ObjectId },
  text: { type: String, required: true },
  at: { type: Date, default: Date.now },
}, { _id: false });

const EnquirySchema = new Schema({
  patient: { type: Types.ObjectId, ref: 'Patient' },
  subject: { type: String, required: true },
  department: { type: String },
  assignedStaff: { type: Types.ObjectId, ref: 'Staff' },
  status: { type: String, enum: EnquiryStatus, default: 'open' },
  priority: { type: String, enum: Object.values(Priority), default: 'normal' },
  messages: { type: [MessageSchema], default: [] },
  relatedOPDVisit: { type: Types.ObjectId, ref: 'OPDVisit' },
  relatedIPDAdmission: { type: Types.ObjectId, ref: 'IPDAdmission' },
  createdBy: { type: Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

module.exports = model('Enquiry', EnquirySchema);
