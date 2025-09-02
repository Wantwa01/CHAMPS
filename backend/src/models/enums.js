// src/models/enums.js
export const STAFF_ROLES = ['system_admin', 'admin', 'doctor', 'nurse', 'receptionist', 'ambulance'];

export const APPOINTMENT_STATUS = ['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'];

export const APPOINTMENT_PRIORITY = ['normal', 'urgent', 'emergency'];

export const PAYMENT_STATUS = ['pending', 'paid', 'waived'];

export const APPOINTMENT_SOURCE = ['web', 'mobile', 'phone', 'walk-in'];

export const ENQUIRY_STATUS = ['open', 'responded', 'closed'];

export const DISCHARGE_CONDITION = ['healed', 'death', 'referred', 'other'];

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
];