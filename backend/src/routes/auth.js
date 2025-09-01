import express from "express";
import { registerSuperAdmin, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Example: super-admin registration (you’ll usually seed this)
router.post("/register-superadmin", registerSuperAdmin);

// Login route
router.post("/login", login);

export default router;