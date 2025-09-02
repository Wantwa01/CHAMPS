export const ROLES = {
    PATIENT_ADULT: 'patient_adult',
    PATIENT_UNDERAGE: 'patient_underage',
    GUARDIAN: 'guardian',
    STAFF: 'staff',
    SUPERADMIN: 'superadmin'
};

export const DASHBOARD_BY_ROLE = {
    [ROLES.PATIENT_ADULT]: '/dashboard/patient',
    [ROLES.PATIENT_UNDERAGE]: '/dashboard/patient',
    [ROLES.GUARDIAN]: '/dashboard/guardian',
    [ROLES.STAFF]: '/dashboard/staff',
    [ROLES.SUPERADMIN]: '/dashboard/admin'
};