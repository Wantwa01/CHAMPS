// src/routes/staff.routes.js
const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const ctrl = require('../controllers/staff.controller');

// Only system_admins can create or hard-delete staff
router.post('/', auth(true), permit('system_admin'), ctrl.create);

// admin or system_admin can list and update
router.get('/', auth(true), permit('system_admin','admin'), ctrl.list);
router.put('/:id', auth(true), permit('system_admin','admin'), ctrl.update);

// deactivate should be system_admin or admin
router.patch('/:id/deactivate', auth(true), permit('system_admin','admin'), ctrl.deactivate);

// hard delete only by system_admin
router.delete('/:id', auth(true), permit('system_admin'), ctrl.remove);

module.exports = router;
