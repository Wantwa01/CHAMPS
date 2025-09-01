// src/models/IPDAdmission.js
const { Schema, model, Types } = require('mongoose');
const { DischargeCondition } = require('./enums');

const IPDAdmissionSchema = new Schema({
  patient: { type: Types.ObjectId, ref: 'Patient', required: true },
  patientNumber: { type: String, index: true, required: true }, // admission number
  age: { type: Number },
  admissionDate: { type: Date, required: true },
  admissionTime: { type: String }, // or store admissionDateTime if preferred
  name: { type: String }, // snapshot
  sex: { type: String },
  location: { type: String }, // ward/room
  diagnosis: { type: String }, // free text summary
  diagnosisCode: { type: String }, // ICD code
  initialTreatment: { type: String },
  clinician: { type: Types.ObjectId, ref: 'Staff' },
  bedNumber: { type: String },
  testsCarried: { type: [String], default: [] }, // lab/xray names or codes
  dischargeDateTime: { type: Date },
  dischargedBy: { type: Types.ObjectId, ref: 'Staff' },
  dischargeCondition: { type: String, enum: Object.values(DischargeCondition) },
  referredTo: { type: String }, // facility name if referred
  notes: { type: String },
  createdBy: { type: Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

module.exports = model('IPDAdmission', IPDAdmissionSchema);
