import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/roles.js';

const PatientSchema = new mongoose.Schema({
    role: { type: String, enum: [ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE, ROLES.GUARDIAN], required: true },

    username: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },

    // nationality and identifiers
    nationality: { type: String, enum: ['malawian', 'non-malawian'], required: true },
    nationalId: { type: String },
    passportNumber: { type: String },

    // guardian & patient fields
    guardianName: { type: String }, // present for guardian
    patientName: { type: String }, // for underage patient record
    patientDob: { type: Date }, // for underage patient record
    guardianFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }], // guardian -> children

    passwordHash: { type: String }, // Will be set by pre-save middleware

    // OTP
    otpCode: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Virtual for password (not stored in DB)
PatientSchema.virtual('password')
    .set(function(password) {
        this._password = password;
    })
    .get(function() {
        return this._password;
    });

// Pre-save middleware to hash password
PatientSchema.pre('save', async function(next) {
    if (this.isModified('_password') || this.isNew) {
        if (this._password) {
            this.passwordHash = await this.constructor.hashPassword(this._password);
        }
    }
    next();
});

PatientSchema.methods.comparePassword = function(plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

PatientSchema.statics.hashPassword = async function(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
};

export default mongoose.model('Patient', PatientSchema);