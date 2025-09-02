import express from 'express';
import authRoutes from './auth.routes.js';
import appointmentRoutes from './appointment.routes.js';

const router = express.Router();

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);

export default router;