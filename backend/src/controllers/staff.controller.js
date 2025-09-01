// src/controllers/staff.controller.js
const Staff = require('../models/Staff');
const Log = require('../models/Log');

exports.create = async (req, res, next) => {
  try {
    const { name, email, phone, role, department, specialty, password } = req.body;
    if (!password) return res.status(400).json({ success:false, message:'Password required' });
    const exists = await Staff.findOne({ email });
    if (exists) return res.status(409).json({ success:false, message:'Email already exists' });

    const s = new Staff({ name, email, phone, role, department, specialty, createdBy: req.user?.id });
    await s.setPassword(password);
    await s.save();

    await Log.create({ actorType: 'staff', actorId: req.user?.id, action: 'create_staff', meta: { staffId: s._id } });

    return res.status(201).json({ success:true, staff: s.toPublic() });
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    const staffs = await Staff.find().select('-passwordHash').sort('role name');
    return res.json({ success:true, data: staffs });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const upd = { ...req.body };
    if (upd.password) delete upd.password; // password changed with dedicated endpoint
    const s = await Staff.findByIdAndUpdate(req.params.id, upd, { new: true }).select('-passwordHash');
    await Log.create({ actorType:'staff', actorId: req.user?.id, action:'update_staff', meta:{ staffId: s._id } });
    return res.json({ success:true, staff: s });
  } catch (e) { next(e); }
};

exports.deactivate = async (req, res, next) => {
  try {
    const s = await Staff.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-passwordHash');
    await Log.create({ actorType:'staff', actorId: req.user?.id, action:'deactivate_staff', meta:{ staffId: s._id } });
    return res.json({ success:true, staff: s });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    // hard delete - use with care
    const s = await Staff.findByIdAndDelete(req.params.id);
    await Log.create({ actorType:'staff', actorId: req.user?.id, action:'delete_staff', meta:{ staffId: req.params.id } });
    return res.json({ success:true, message:'Staff removed' });
  } catch (e) { next(e); }
};
