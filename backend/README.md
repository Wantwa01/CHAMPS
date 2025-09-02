# WeziMediCare Backend Authentication System

A comprehensive backend authentication system built with Express.js and MongoDB, supporting multiple user roles with role-based access control and a complete appointment booking system.

## Features

- **5 User Roles**: Patient (Adult), Patient (Underage), Guardian, Staff, Super Admin
- **Self-Registration**: Only Patients and Guardians can self-register
- **Manual Creation**: Staff and Super Admin accounts are created via seed script
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: OTP-based password reset via SMS
- **Role-Based Access Control**: Middleware for protecting routes
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Joi-based request validation
- **Security**: Helmet, CORS, and other security middleware
- **Appointment Booking System**: Complete appointment management for patients

## User Registration Rules

### Adult Patient (≥18 years)
- Required fields: username, phone, nationality, nationalId/passportNumber, password
- Nationality: "malawian" (requires nationalId) or "non-malawian" (requires passportNumber)

### Underage Patient (<18 years)
- Must be created by an authenticated Guardian
- No self-registration endpoint
- Same field requirements as adult patient

### Guardian
- Required fields: username, phone, guardianName, nationality, nationalId/passportNumber, password
- Can create underage patients

### Staff & Super Admin
- No public registration endpoints
- Created via seed script or admin-only routes
- Can change password on first login

## API Endpoints

### Authentication Routes
- `POST /auth/register/adult` - Register adult patient
- `POST /auth/register/guardian` - Register guardian
- `POST /auth/login` - Login (returns JWT + dashboard path)
- `POST /auth/forgot-password` - Request password reset OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password after OTP verification
- `POST /auth/register/underage` - Guardian-only: create underage patient

### Appointment Routes
- `GET /appointments/doctors` - View all available doctors
- `GET /appointments/doctors/:id/slots?date=YYYY-MM-DD` - View doctor's available slots
- `POST /appointments/appointments` - Book an appointment (authenticated patients only)
- `GET /appointments/appointments/me` - View patient's appointments
- `GET /appointments/appointments/:id` - View specific appointment
- `PUT /appointments/appointments/:id` - Update appointment
- `PATCH /appointments/appointments/:id/cancel` - Cancel appointment

## Dashboard Redirects

Login response includes a `dashboard` field:
- Adult/Underage Patient → `/dashboard/patient`
- Guardian → `/dashboard/guardian`
- Staff → `/dashboard/staff`
- Super Admin → `/dashboard/admin`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp env.example .env
```

Required variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `OTP_TTL_MIN` - OTP expiration time in minutes

### 3. Database Setup
Ensure MongoDB is running and accessible via `MONGO_URI`.

### 4. Seed Initial Users
```bash
npm run seed
```

This creates:
- Super Admin: `superadmin` / `superadmin123`
- Staff: `nurse1` / `staff123`

**⚠️ IMPORTANT**: Change these passwords after first login!

### 5. Seed Doctors (for appointment system)
```bash
npm run seed-doctors
```

This creates 5 sample doctors with working hours and generates appointment slots for the next 30 days.

### 6. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000` (or `PORT` from .env)

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Route controllers
│   ├── auth.controller.js      # Authentication logic
│   └── appointment.controller.js # Appointment management
├── middleware/      # Auth, validation, roles
├── models/          # Mongoose schemas
│   ├── Patient.js   # Patient/Guardian model
│   ├── Staff.js     # Staff/Admin model
│   ├── Doctor.js    # Doctor model with working hours
│   └── Appointment.js # Appointment model
├── routes/          # API routes
│   ├── auth.routes.js         # Authentication routes
│   └── appointment.routes.js  # Appointment routes
├── scripts/         # Seed scripts
│   ├── seed.js               # User seeding
│   └── seed-doctors.js       # Doctor seeding
├── services/        # Token, OTP, SMS services
├── utils/           # Constants and utilities
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Appointment System Features

### Doctor Management
- **Working Hours**: Configurable per doctor (day of week, start/end times)
- **Automatic Slot Generation**: 30-minute slots based on working hours
- **Specialization**: Doctors categorized by medical specialty
- **Availability**: Real-time slot availability tracking

### Appointment Booking
- **Slot Selection**: Patients choose from available time slots
- **Double Booking Prevention**: System prevents conflicting appointments
- **Patient Limits**: One appointment per doctor per date
- **Real-time Updates**: Slot availability updates immediately

### Appointment Management
- **CRUD Operations**: Create, read, update, cancel appointments
- **Status Tracking**: pending, confirmed, rescheduled, cancelled, completed
- **Time Restrictions**: Update/cancel rules based on appointment proximity
- **Ownership Control**: Patients can only manage their own appointments

## SMS Integration

The system includes a stub SMS service with examples for:
- Twilio
- Africa's Talking
- Firebase

To integrate with a real SMS provider:
1. Uncomment the relevant code in `src/services/sms.service.js`
2. Add your API credentials to `.env`
3. Test with a real phone number

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Configurable expiration
- **Rate Limiting**: 
  - Login (5 attempts/15min)
  - Password reset (3 attempts/15min)
  - Appointment operations (10 attempts/15min)
- **Input Validation**: Joi schemas with conditional validation
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Request Logging**: Morgan HTTP request logger

## Error Handling

Consistent error response format:
```json
{
  "message": "Error description",
  "details": ["Validation error details"]
}
```

HTTP Status Codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Testing the API

### 1. Register a Patient
```bash
curl -X POST http://localhost:5000/auth/register/adult \
  -H "Content-Type: application/json" \
  -d '{
    "role": "patient_adult",
    "username": "patient1",
    "phone": "+265777777777",
    "nationality": "malawian",
    "nationalId": "123456789",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient1",
    "password": "password123"
  }'
```

### 3. View Available Doctors
```bash
curl http://localhost:5000/appointments/doctors
```

### 4. Check Doctor's Available Slots
```bash
curl "http://localhost:5000/appointments/doctors/DOCTOR_ID/slots?date=2024-01-15"
```

### 5. Book an Appointment
```bash
curl -X POST http://localhost:5000/appointments/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "date": "2024-01-15",
    "timeSlot": "08:00",
    "notes": "Regular checkup",
    "symptoms": "Chest pain"
  }'
```

## Production Considerations

1. **Environment Variables**: Use strong, unique secrets
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **SMS Service**: Integrate with production SMS provider
4. **Rate Limiting**: Adjust limits based on expected traffic
5. **Logging**: Implement proper logging and monitoring
6. **HTTPS**: Use SSL/TLS in production
7. **Password Policy**: Implement stronger password requirements
8. **Appointment Limits**: Configure appropriate booking windows and restrictions

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGO_URI` in `.env`
   - Ensure MongoDB is running

2. **JWT Errors**
   - Verify `JWT_SECRET` is set
   - Check token expiration

3. **Validation Errors**
   - Review request body against Joi schemas
   - Check nationality conditional fields

4. **Role Access Denied**
   - Verify user role in JWT token
   - Check route protection middleware

5. **Appointment Booking Issues**
   - Ensure doctor exists and is active
   - Check if selected slot is available
   - Verify appointment date is in the future

## Support

For issues or questions:
1. Check the error logs in the console
2. Verify all environment variables are properly configured
3. Ensure MongoDB is accessible
4. Check the comprehensive documentation in `APPOINTMENT_API.md`
5. Review the setup guide in `SETUP.md`

## Documentation Files

- **README.md** - This comprehensive overview
- **SETUP.md** - Quick setup and configuration guide
- **APPOINTMENT_API.md** - Complete appointment API documentation
- **env.example** - Environment variables template

The system is now ready to run with both authentication and appointment booking capabilities! 🎉
