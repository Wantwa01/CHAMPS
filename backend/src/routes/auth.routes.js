import express from "express";
import rateLimit from 'express-rate-limit';
import {
    registerAdult,
    registerGuardian,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    guardianCreateUnderage
} from "../controllers/auth.controller.js";
import { auth, requireRoles } from "../middleware/auth.js";

const router = express.Router();

// Rate limiting for sensitive endpoints
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later'
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many password reset attempts, please try again later'
});

// Public registration routes (only for patients and guardians)
router.post("/register/adult", registerAdult);
router.post("/register/guardian", registerGuardian);

// Public login route
router.post("/login", loginLimiter, login);

// Public password reset routes
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/register/underage", auth, requireRoles('guardian'), guardianCreateUnderage);

export default router;