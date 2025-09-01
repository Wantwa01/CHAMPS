// src/models/OPDVisit.js
const { Schema, model, Types } = require('mongoose');
const { Priority } = require('./enums');

const OPDVisitSchema = new Schema({
  patient: { type: Types.ObjectId, ref: 'Patient', required: true },
  visitNumber: { type: String, index: true }, // e.g. facility short id per visit
  age: { type: Number }, // snapshot of age at visit
  village: { type: String },
  guardianName: { type: String },
  uniqueIdentifier: { type: String }, // copy of patient.uniqueId if needed
  testsRequested: { type: [String], default: [] }, // lab/xray names or codes
  diagnosisCode: { type: String }, // ICD-10 code
  diagnosisText: { type: String },
  checkupDay: { type: Date }, // proposed follow-up
  clinician: { type: Types.ObjectId, ref: 'Staff' },
  priority: { type: String, enum: Object.values(Priority), default: 'normal' },
  notes: { type: String },
  createdBy: { type: Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

module.exports = model('OPDVisit', OPDVisitSchema);
