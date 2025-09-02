# WeziMediCare Appointment Booking API

A comprehensive appointment booking system that allows patients to book, manage, and view appointments with doctors.

## 🔐 Authentication

All appointment-related endpoints (except viewing doctors and slots) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 API Endpoints

### 1. View Available Doctors

**GET** `/appointments/doctors`

Get a list of all available doctors with their specializations.

**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "message": "Doctors retrieved successfully",
  "data": {
    "doctors": [
      {
        "_id": "doctor_id",
        "name": "Dr. John Smith",
        "specialization": "Cardiology",
        "qualifications": "MBBS, MD (Cardiology)",
        "experience": 15
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  }
}
```

### 2. View Doctor's Available Slots

**GET** `/appointments/doctors/:id/slots?date=YYYY-MM-DD`

Get available time slots for a specific doctor on a given date.

**Path Parameters:**
- `id`: Doctor's ID

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format (required)

**Response:**
```json
{
  "message": "Available slots retrieved successfully",
  "data": {
    "doctor": {
      "id": "doctor_id",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "date": "2024-01-15",
    "availableSlots": [
      {
        "timeSlot": "08:00",
        "isBooked": false
      },
      {
        "timeSlot": "08:30",
        "isBooked": false
      }
    ]
  }
}
```

### 3. Book an Appointment

**POST** `/appointments/appointments`

Book a new appointment with a doctor.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "doctorId": "doctor_id",
  "date": "2024-01-15",
  "timeSlot": "08:00",
  "notes": "Regular checkup",
  "symptoms": "Chest pain",
  "priority": "normal"
}
```

**Field Validation:**
- `doctorId`: Required, valid doctor ID
- `date`: Required, future date
- `timeSlot`: Required, format HH:MM (e.g., "08:00", "14:30")
- `notes`: Optional, string
- `symptoms`: Optional, string
- `priority`: Optional, one of: "normal", "urgent", "emergency" (default: "normal")

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "data": {
    "id": "appointment_id",
    "doctor": {
      "id": "doctor_id",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "08:00",
    "status": "pending",
    "notes": "Regular checkup",
    "symptoms": "Chest pain",
    "priority": "normal",
    "paymentStatus": "pending",
    "source": "web",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  }
}
```

### 4. View Patient's Appointments

**GET** `/appointments/appointments/me`

Get all appointments for the authenticated patient.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status: "pending", "confirmed", "rescheduled", "cancelled", "completed"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "message": "Appointments retrieved successfully",
  "data": {
    "appointments": [
      {
        "id": "appointment_id",
        "doctor": {
          "id": "doctor_id",
          "name": "Dr. John Smith",
          "specialization": "Cardiology"
        },
        "date": "2024-01-15T00:00:00.000Z",
        "timeSlot": "08:00",
        "status": "pending",
        "notes": "Regular checkup",
        "symptoms": "Chest pain",
        "priority": "normal",
        "paymentStatus": "pending",
        "source": "web",
        "createdAt": "2024-01-10T10:00:00.000Z",
        "updatedAt": "2024-01-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 5. View Specific Appointment

**GET** `/appointments/appointments/:id`

Get details of a specific appointment.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
- `id`: Appointment ID

**Response:**
```json
{
  "message": "Appointment retrieved successfully",
  "data": {
    "id": "appointment_id",
    "doctor": {
      "id": "doctor_id",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "08:00",
    "status": "pending",
    "notes": "Regular checkup",
    "symptoms": "Chest pain",
    "priority": "normal",
    "paymentStatus": "pending",
    "source": "web",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  }
}
```

### 6. Update Appointment

**PUT** `/appointments/appointments/:id`

Update an existing appointment (date, time, notes, symptoms, priority).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Path Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
{
  "date": "2024-01-16",
  "timeSlot": "09:00",
  "notes": "Updated notes",
  "symptoms": "Updated symptoms",
  "priority": "urgent"
}
```

**Field Validation:**
- `date`: Optional, future date
- `timeSlot`: Optional, format HH:MM
- `notes`: Optional, string
- `symptoms`: Optional, string
- `priority`: Optional, one of: "normal", "urgent", "emergency"

**Response:**
```json
{
  "message": "Appointment updated successfully",
  "data": {
    "id": "appointment_id",
    "doctor": {
      "id": "doctor_id",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "date": "2024-01-16T00:00:00.000Z",
    "timeSlot": "09:00",
    "status": "pending",
    "notes": "Updated notes",
    "symptoms": "Updated symptoms",
    "priority": "urgent",
    "paymentStatus": "pending",
    "source": "web",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T11:00:00.000Z"
  }
}
```

### 7. Cancel Appointment

**PATCH** `/appointments/appointments/:id/cancel`

Cancel an existing appointment.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Path Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
{
  "cancellationReason": "Schedule conflict"
}
```

**Field Validation:**
- `cancellationReason`: Required, minimum 3 characters

**Response:**
```json
{
  "message": "Appointment cancelled successfully",
  "data": {
    "id": "appointment_id",
    "doctor": {
      "id": "doctor_id",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "08:00",
    "status": "cancelled",
    "notes": "Regular checkup",
    "symptoms": "Chest pain",
    "priority": "normal",
    "paymentStatus": "pending",
    "source": "web",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

## 🔒 Business Rules & Validation

### Appointment Booking Rules
1. **Authentication Required**: Only logged-in patients can book appointments
2. **Slot Availability**: Can only book from available time slots
3. **Double Booking Prevention**: Cannot book the same doctor at the same time
4. **Patient Limit**: Cannot book multiple appointments with the same doctor on the same date
5. **Future Dates Only**: Cannot book appointments in the past

### Update & Cancellation Rules
1. **Ownership**: Patients can only modify their own appointments
2. **Time Restrictions**: 
   - Updates: Must be more than 12 hours before appointment
   - Cancellations: Must be more than 24 hours before appointment
3. **Status Restrictions**: Only "pending" appointments can be updated/cancelled

### Slot Management
1. **Automatic Generation**: Slots are generated based on doctor's working hours
2. **30-Minute Intervals**: Default slot duration is 30 minutes
3. **Working Days**: Monday to Friday (configurable per doctor)
4. **Real-time Updates**: Slots are marked as booked/unavailable in real-time

## 📊 Error Responses

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (doctor/appointment not found)
- `409` - Conflict (slot already booked)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Error description",
  "details": ["Specific error details"]
}
```

### Example Error Responses

**Validation Error:**
```json
{
  "message": "Validation failed",
  "details": [
    "Date must be in the future",
    "Time slot must be in HH:MM format"
  ]
}
```

**Slot Not Available:**
```json
{
  "message": "Selected time slot is not available",
  "details": ["Please choose from the available slots"]
}
```

**Double Booking:**
```json
{
  "message": "You already have an appointment with this doctor on this date",
  "details": ["Please choose a different date or doctor"]
}
```

## 🧪 Testing Examples

### 1. Book an Appointment
```bash
# First, login to get JWT token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient1",
    "password": "password123"
  }'

# Use the token to book appointment
curl -X POST http://localhost:5000/appointments/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorId": "doctor_id_here",
    "date": "2024-01-15",
    "timeSlot": "08:00",
    "notes": "Regular checkup",
    "symptoms": "Chest pain"
  }'
```

### 2. View Available Slots
```bash
curl "http://localhost:5000/appointments/doctors/doctor_id_here/slots?date=2024-01-15"
```

### 3. View Patient Appointments
```bash
curl -X GET http://localhost:5000/appointments/appointments/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Setup Instructions

### 1. Seed Doctors
```bash
npm run seed-doctors
```

This creates 5 sample doctors with working hours and generates slots for the next 30 days.

### 2. Test the System
1. Register a patient account
2. Login to get JWT token
3. View available doctors
4. Check available slots for a doctor
5. Book an appointment
6. View and manage appointments

## 📝 Notes

- **Rate Limiting**: Appointment creation/updates are limited to 10 requests per 15 minutes
- **Slot Generation**: Slots are automatically generated based on doctor working hours
- **Real-time Updates**: Slot availability is updated in real-time when appointments are booked/cancelled
- **Data Integrity**: The system prevents double booking and maintains data consistency
- **Flexible Scheduling**: Each doctor can have different working hours and schedules
