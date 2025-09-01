// src/models/Staff.js
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { StaffRoles } = require('./enums');

const StaffSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String },
  role: { type: String, enum: StaffRoles, default: 'receptionist', index: true },
  department: { type: String }, // OPD/IPD/ED/Antenatal/Theatre
  specialty: { type: String },
  passwordHash: { type: String, required: true },
  online: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, // soft-delete support
  createdBy: { type: Schema.Types.ObjectId, ref: 'Staff' }, // who created the account
}, { timestamps: true });

// Set password and compare helpers
StaffSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};
StaffSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Simple toJSON to hide passwordHash
StaffSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = model('Staff', StaffSchema);
