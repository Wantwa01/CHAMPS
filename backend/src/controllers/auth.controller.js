import httpStatus from 'http-status';
import Joi from 'joi';
import Patient from '../models/Patient.js';
import Staff from '../models/Staff.js';
import { ROLES, DASHBOARD_BY_ROLE } from '../utils/roles.js';
import { signToken } from '../services/token.service.js';
import { generateOtp, expiryFromNow } from '../services/otp.service.js';
import { sendSms } from '../services/sms.service.js';
import { isUnder18 } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import Admin from '../models/Admin.js'; // Admin model for SystemAdmin login
import bcrypt from 'bcryptjs'; // to compare hashed passwords for Admins


// Strong password pattern: min 8 chars, upper, lower, digit, special
const strongPassword = Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/)
    .messages({
        'string.pattern.base': 'Password must include upper, lower, number and special character',
        'string.min': 'Password must be at least 8 characters long'
    });

// Common ID validators (auto-uppercase and alphanumeric)
const uppercaseId = Joi.string().uppercase().pattern(/^[A-Z0-9]+$/).messages({
    'string.pattern.base': 'Must be uppercase letters and numbers only'
});

// validation schemas (Joi)
const registerAdultSchema = Joi.object({
    role: Joi.string().valid(ROLES.PATIENT_ADULT).required(),
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(20).required(),
    nationality: Joi.string().valid('malawian', 'non-malawian').required(),
    nationalId: Joi.when('nationality', { is: 'malawian', then: uppercaseId.required(), otherwise: uppercaseId.optional().allow('') }),
    passportNumber: Joi.when('nationality', { is: 'non-malawian', then: uppercaseId.required(), otherwise: uppercaseId.optional().allow('') }),
    password: strongPassword.required()
});

const registerGuardianSchema = Joi.object({
    role: Joi.string().valid(ROLES.GUARDIAN).required(),
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(20).required(),
    guardianName: Joi.string().min(2).required(),
    nationality: Joi.string().valid('malawian', 'non-malawian').required(),
    nationalId: Joi.when('nationality', { is: 'malawian', then: uppercaseId.required(), otherwise: uppercaseId.optional().allow('') }),
    passportNumber: Joi.when('nationality', { is: 'non-malawian', then: uppercaseId.required(), otherwise: uppercaseId.optional().allow('') }),
    // Optional child prefill fields for auto-detection only
    patientName: Joi.string().min(2).optional(),
    patientDob: Joi.date().less('now').optional(),
    password: strongPassword.required()
}).custom((value, helpers) => {
    // If one of patientName or patientDob is provided, require the other
    if ((value.patientName && !value.patientDob) || (!value.patientName && value.patientDob)) {
        return helpers.error('any.custom', { message: 'Both patientName and patientDob must be provided together' });
    }
    return value;
}, 'child fields pairing');

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const forgotSchema = Joi.object({ phone: Joi.string().required() });
const verifyOtpSchema = Joi.object({ phone: Joi.string().required(), otp: Joi.string().length(6).required() });
const resetSchema = Joi.object({ phone: Joi.string().required(), newPassword: strongPassword.required() });
const createUnderageSchema = Joi.object({
    patientName: Joi.string().min(2).required(),
    patientDob: Joi.date().less('now').required(),
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(20).required(),
    nationality: Joi.string().valid('malawian', 'non-malawian').required(),
    nationalId: Joi.when('nationality', { is: 'malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    passportNumber: Joi.when('nationality', { is: 'non-malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    password: Joi.string().min(6).required()
});

// helpers
const pickSafe = (u) => ({
    id: u._id,
    role: u.role,
    username: u.username,
    phone: u.phone
});

// Controllers
export const registerAdult = async(req, res) => {
    const { error, value } = registerAdultSchema.validate(req.body, { abortEarly: false });
    if (error) {
        logger.debug('Validation failed: registerAdult', { details: error.details.map(d => d.message) });
        return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    }

    try {
        const { username, phone, nationality, nationalId, passportNumber, password } = value;

        logger.debug('Registering adult patient', { username, phone, nationality });

        // uniqueness across patient collection
        const exists = await Patient.findOne({ $or: [{ username }, { phone }] });
        if (exists) return res.status(409).json({ message: 'Username or phone already exists' });

        const patient = await Patient.create({
            role: ROLES.PATIENT_ADULT,
            username,
            phone,
            nationality,
            nationalId,
            passportNumber,
            password
        });

        logger.info('Adult patient registered', { id: patient._id, username });
        return res.status(201).json({ message: 'Registered adult patient', user: pickSafe(patient) });
    } catch (err) {
        logger.error('Error registering adult patient', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};

export const registerGuardian = async(req, res) => {
    const { error, value } = registerGuardianSchema.validate(req.body, { abortEarly: false });
    if (error) {
        logger.debug('Validation failed: registerGuardian', { details: error.details.map(d => d.message) });
        return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    }

    try {
        const { username, phone, guardianName, nationality, nationalId, passportNumber, password, patientName, patientDob } = value;

        logger.debug('Registering guardian', { username, phone, nationality });

        const exists = await Patient.findOne({ $or: [{ username }, { phone }] });
        if (exists) return res.status(409).json({ message: 'Username or phone already exists' });

        // If child details provided, auto-detect age
        if (patientName && patientDob) {
            if (!isUnder18(patientDob)) {
                return res.status(400).json({ message: 'Provided patientDob indicates 18+. Please use adult registration for the patient.' });
            }
        }

        const guardian = await Patient.create({
            role: ROLES.GUARDIAN,
            username,
            phone,
            nationality,
            nationalId,
            passportNumber,
            guardianName,
            password
        });

        logger.info('Guardian registered', { id: guardian._id, username });

        // Note: We do NOT create the underage patient here to avoid partial data.
        // The guardian can call POST /auth/register/underage to create the child fully.
        const extra = patientName && patientDob ? { childPrefill: { patientName, patientDob, underage: true } } : {};
        return res.status(201).json({ message: 'Guardian registered', user: pickSafe(guardian), ...extra });
    } catch (err) {
        logger.error('Error registering guardian', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};

export const guardianCreateUnderage = async(req, res) => {
    // req.user must be present via auth middleware (id, role)
    const { error, value } = createUnderageSchema.validate(req.body, { abortEarly: false });
    if (error) {
        logger.debug('Validation failed: guardianCreateUnderage', { details: error.details.map(d => d.message) });
        return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    }

    try {
        const authUserId = req.user && req.user.id;
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });

        const guardian = await Patient.findById(authUserId);
        if (!guardian || guardian.role !== ROLES.GUARDIAN) return res.status(403).json({ message: 'Only guardians can create underage patients' });

        const { patientName, patientDob, username, phone, nationality, nationalId, passportNumber, password } = value;

        if (!isUnder18(patientDob)) return res.status(400).json({ message: 'Patient DOB indicates 18+; use adult registration' });

        const exists = await Patient.findOne({ $or: [{ username }, { phone }] });
        if (exists) return res.status(409).json({ message: 'Username or phone already exists' });

        const child = await Patient.create({
            role: ROLES.PATIENT_UNDERAGE,
            username,
            phone,
            nationality,
            nationalId,
            passportNumber,
            patientName,
            patientDob,
            guardianFor: [],
            password
        });

        // link child to guardian
        guardian.guardianFor = guardian.guardianFor || [];
        guardian.guardianFor.push(child._id);
        await guardian.save();

        logger.info('Underage patient created by guardian', { guardianId: guardian._id, childId: child._id });
        return res.status(201).json({ message: 'Underage patient created', user: pickSafe(child) });
    } catch (err) {
        logger.error('Error creating underage patient', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};

export const login = async(req, res) => {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });

    try {
        const { username, password } = value;
        const uname = String(username).toLowerCase().trim();
        logger.debug('Login attempt', { username: uname });

        // 1️⃣ Try Patient collection first
        let user = await Patient.findOne({ username: uname });
        let type = 'patient';

        // 2️⃣ If not found, try Staff
        if (!user) {
            user = await Staff.findOne({ username: uname });
            type = 'staff';
        }

        // 3️⃣ If still not found, try Admin
        if (!user) {
            user = await Admin.findOne({ email: uname }); // Admins login with email
            type = 'admin';
        }

        // 4️⃣ If still not found → invalid credentials
        if (!user) {
            logger.debug('Login failed: user not found', { username: uname });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 5️⃣ Check if account is active (Patient/Staff only)
        if ((type === 'patient' || type === 'staff') && !user.isActive) {
            logger.debug('Login blocked: inactive user', { username: uname, type, role: user.role });
            return res.status(403).json({ message: 'Account disabled' });
        }

        // 6️⃣ Compare password
        let ok = false;
        if (type === 'admin') {
            ok = await bcrypt.compare(password, user.password); // hashed Admin password
        } else {
            ok = await user.comparePassword(password); // Patient/Staff method
        }

        if (!ok) {
            logger.debug('Login failed: bad password', { username: uname, type, role: user.role });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 7️⃣ Generate token & dashboard
        const token = signToken({ id: user._id, role: user.role });

        // 8️⃣ Determine dashboard based on role
        let dashboard = DASHBOARD_BY_ROLE[user.role] || '/';
        if (user.role === 'SystemAdmin') {
            dashboard = '/superadmin/dashboard'; // redirect Super Admin here
        }

        logger.info('Login successful', { userId: user._id, username: uname, type, role: user.role });
        return res.json({ message: 'Logged in', token, user: pickSafe(user), dashboard });

    } catch (err) {
        logger.error('Login error', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};
export const forgotPassword = async(req, res) => {
    const { error, value } = forgotSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation failed' });

    try {
        const { phone } = value;

        // search both collections
        let user = await Patient.findOne({ username: uname });
        let type = 'patient';

        if (!user) {
            user = await Staff.findOne({ username: uname });
            type = 'staff';
        }

        if (!user) {
            user = await Admin.findOne({ email: uname }); // <-- ADD THIS
            type = 'admin';
        }

        if (!user) return res.status(404).json({ message: 'Phone not registered' });

        const otp = generateOtp(6);
        const expiry = expiryFromNow(parseInt(process.env.OTP_TTL_MIN || '10', 10));

        user.otpCode = otp;
        user.otpExpiry = expiry;
        user.otpVerified = false;
        await user.save();

        await sendSms({ to: phone, message: `Your WeziMediCare password reset code is ${otp}. Expires in ${process.env.OTP_TTL_MIN || '10'} minutes.` });

        logger.info('OTP sent', { userId: user._id, collection });
        return res.json({ message: 'OTP sent' });
    } catch (err) {
        logger.error('Forgot password error', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};

export const verifyOtp = async(req, res) => {
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation failed' });

    try {
        const { phone, otp } = value;

        let user = await Patient.findOne({ phone });
        if (!user) user = await Staff.findOne({ phone });
        if (!user || !user.otpCode || !user.otpExpiry) return res.status(400).json({ message: 'No OTP request found' });

        if (user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

        user.otpVerified = true;
        await user.save();

        logger.info('OTP verified', { userId: user._id });
        return res.json({ message: 'OTP verified' });
    } catch (err) {
        logger.error('Verify OTP error', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async(req, res) => {
    const { error, value } = resetSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation failed' });

    try {
        const { phone, newPassword } = value;

        let user = await Patient.findOne({ phone });
        if (!user) user = await Staff.findOne({ phone });
        if (!user) return res.status(404).json({ message: 'Phone not found' });

        if (!user.otpVerified) return res.status(400).json({ message: 'OTP not verified' });

        user.password = newPassword;
        user.otpCode = undefined;
        user.otpExpiry = undefined;
        user.otpVerified = false;
        await user.save();

        logger.info('Password reset successful', { userId: user._id });
        return res.json({ message: 'Password reset successful' });
    } catch (err) {
        logger.error('Reset password error', { error: err.message, stack: err.stack });
        return res.status(500).json({ message: 'Server error' });
    }
};