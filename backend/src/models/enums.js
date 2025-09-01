// src/models/enums.js
module.exports = {
  StaffRoles: ['system_admin','admin','doctor','nurse','receptionist','ambulance'],
  AppointmentStatus: ['pending','confirmed','rescheduled','cancelled','completed'],
  EnquiryStatus: ['open','responded','closed'],
  Priority: ['normal','emergency'],
  DischargeCondition: ['healed','death','referred','other'],
};
