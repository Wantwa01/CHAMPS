import httpStatus from 'http-status';
import { verifyToken } from '../services/token.service.js';

export const auth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid/expired token' });
    }
};

export const requireRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

export const isUnder18 = (dob) => {
    const now = new Date();
    const d = new Date(dob);
    d.setFullYear(d.getFullYear() + 18);
    return d > now; // true if under 18
};