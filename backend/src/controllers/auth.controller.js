import httpStatus from 'http-status';
import Joi from 'joi';
import Patient from '../models/Patient.js';
import Staff from '../models/Staff.js';
import { ROLES, DASHBOARD_BY_ROLE } from '../utils/roles.js';
import { signToken } from '../services/token.service.js';
import { generateOtp, expiryFromNow } from '../services/otp.service.js';
import { sendSms } from '../services/sms.service.js';
import { isUnder18 } from '../middleware/auth.js';

// validation schemas (Joi)
const registerAdultSchema = Joi.object({
    role: Joi.string().valid(ROLES.PATIENT_ADULT).required(),
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(20).required(),
    nationality: Joi.string().valid('malawian', 'non-malawian').required(),
    nationalId: Joi.when('nationality', { is: 'malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    passportNumber: Joi.when('nationality', { is: 'non-malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    password: Joi.string().min(6).required()
});

const registerGuardianSchema = Joi.object({
    role: Joi.string().valid(ROLES.GUARDIAN).required(),
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(6).max(20).required(),
    guardianName: Joi.string().min(2).required(),
    nationality: Joi.string().valid('malawian', 'non-malawian').required(),
    nationalId: Joi.when('nationality', { is: 'malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    passportNumber: Joi.when('nationality', { is: 'non-malawian', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const forgotSchema = Joi.object({ phone: Joi.string().required() });
const verifyOtpSchema = Joi.object({ phone: Joi.string().required(), otp: Joi.string().length(6).required() });
const resetSchema = Joi.object({ phone: Joi.string().required(), newPassword: Joi.string().min(6).required() });
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
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });

    try {
        const { username, phone, nationality, nationalId, passportNumber, password } = value;

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

        return res.status(201).json({ message: 'Registered adult patient', user: pickSafe(patient) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const registerGuardian = async(req, res) => {
    const { error, value } = registerGuardianSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });

    try {
        const { username, phone, guardianName, nationality, nationalId, passportNumber, password } = value;

        const exists = await Patient.findOne({ $or: [{ username }, { phone }] });
        if (exists) return res.status(409).json({ message: 'Username or phone already exists' });

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

        return res.status(201).json({ message: 'Guardian registered', user: pickSafe(guardian) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const guardianCreateUnderage = async(req, res) => {
    // req.user must be present via auth middleware (id, role)
    const { error, value } = createUnderageSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });

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

        return res.status(201).json({ message: 'Underage patient created', user: pickSafe(child) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const login = async(req, res) => {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });

    try {
        const { username, password } = value;

        // Try patient collection first
        let user = await Patient.findOne({ username });
        let type = 'patient';
        if (!user) {
            user = await Staff.findOne({ username });
            type = 'staff';
        }
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.isActive) return res.status(403).json({ message: 'Account disabled' });

        const ok = await user.comparePassword(password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken({ id: user._id, role: user.role });
        const dashboard = DASHBOARD_BY_ROLE[user.role] || '/';

        return res.json({ message: 'Logged in', token, user: pickSafe(user), dashboard });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const forgotPassword = async(req, res) => {
    const { error, value } = forgotSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation failed' });

    try {
        const { phone } = value;

        // search both collections
        let user = await Patient.findOne({ phone });
        let collection = 'patient';
        if (!user) {
            user = await Staff.findOne({ phone });
            collection = 'staff';
        }
        if (!user) return res.status(404).json({ message: 'Phone not registered' });

        const otp = generateOtp(6);
        const expiry = expiryFromNow(parseInt(process.env.OTP_TTL_MIN || '10', 10));

        user.otpCode = otp;
        user.otpExpiry = expiry;
        user.otpVerified = false;
        await user.save();

        await sendSms({ to: phone, message: `Your WeziMediCare password reset code is ${otp}. Expires in ${process.env.OTP_TTL_MIN || '10'} minutes.` });

        return res.json({ message: 'OTP sent' });
    } catch (err) {
        console.error(err);
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

        return res.json({ message: 'OTP verified' });
    } catch (err) {
        console.error(err);
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

        return res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};