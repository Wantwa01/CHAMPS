import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    getDoctorSlots,
    createAppointment,
    getPatientAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
    getAllDoctors
} from '../controllers/appointment.controller.js';
import { auth, requireRoles } from '../middleware/auth.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

// Rate limiting for appointment creation and updates
const appointmentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many appointment requests, please try again later'
});

// Public routes (no authentication required)
router.get('/doctors', getAllDoctors);
router.get('/doctors/:id/slots', getDoctorSlots);

// Protected routes (require patient authentication)
router.use(auth); // Apply authentication middleware to all routes below

// Patient-only routes
router.post('/appointments', appointmentLimiter, requireRoles(ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE), createAppointment);
router.get('/appointments/me', requireRoles(ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE), getPatientAppointments);
router.get('/appointments/:id', requireRoles(ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE), getAppointmentById);
router.put('/appointments/:id', appointmentLimiter, requireRoles(ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE), updateAppointment);
router.patch('/appointments/:id/cancel', appointmentLimiter, requireRoles(ROLES.PATIENT_ADULT, ROLES.PATIENT_UNDERAGE), cancelAppointment);

export default router;