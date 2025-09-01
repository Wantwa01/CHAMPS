// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');

async function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (!required) return next();
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // payload should include { id, role, type } where type is 'staff' or 'patient'
      if (payload.type === 'staff') {
        const staff = await Staff.findById(payload.id).select('-passwordHash');
        if (!staff || !staff.isActive) return res.status(401).json({ success:false, message:'Invalid staff token' });
        req.user = { id: staff._id, role: staff.role, type: 'staff', raw: staff };
      } else {
        const patient = await Patient.findById(payload.id);
        if (!patient) return res.status(401).json({ success:false, message:'Invalid patient token' });
        req.user = { id: patient._id, role: 'patient', type: 'patient', raw: patient };
      }
      next();
    } catch (err) {
      return res.status(401).json({ success:false, message:'Invalid token' });
    }
  };
}

module.exports = { auth };
