import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/roles.js';

const StaffSchema = new mongoose.Schema({
    role: { type: String, enum: [ROLES.STAFF, ROLES.SUPERADMIN], required: true },

    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },

    passwordHash: { type: String }, // Will be set by pre-save middleware

    otpCode: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Virtual for password (not stored in DB)
StaffSchema.virtual('password')
    .set(function(password) {
        this._password = password;
    })
    .get(function() {
        return this._password;
    });

// Pre-save middleware to hash password
StaffSchema.pre('save', async function(next) {
    if (this.isModified('_password') || this.isNew) {
        if (this._password) {
            this.passwordHash = await this.constructor.hashPassword(this._password);
        }
    }
    next();
});

StaffSchema.methods.comparePassword = function(plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

StaffSchema.statics.hashPassword = async function(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
};

export default mongoose.model('Staff', StaffSchema);