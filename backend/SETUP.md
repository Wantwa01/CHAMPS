# WeziMediCare Authentication System - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file in the backend directory:
```bash
# Copy the example file
cp env.example .env

# Edit .env with your values
MONGO_URI=mongodb://localhost:27017/wezimedicare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
OTP_TTL_MIN=10
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Ensure MongoDB is running on your system or use MongoDB Atlas.

### 4. Test Database Connection
```bash
npm run test-connection
```

### 5. Seed Initial Users
```bash
npm run seed
```
This creates:
- **Super Admin**: `superadmin` / `superadmin123`
- **Staff**: `nurse1` / `staff123`

### 6. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 🔧 What's Been Fixed

### ✅ Completed
- **Models**: Patient and Staff schemas with proper password handling
- **Controllers**: Complete authentication logic for all endpoints
- **Routes**: All authentication routes with rate limiting
- **Middleware**: JWT auth, role-based access control, validation
- **Services**: Token, OTP, and SMS services
- **Seed Script**: Creates initial super admin and staff users
- **Error Handling**: Comprehensive error middleware
- **Security**: Helmet, CORS, rate limiting, input validation

### 🔍 Key Features Implemented
1. **5 User Roles**: Patient (Adult/Underage), Guardian, Staff, Super Admin
2. **Self-Registration**: Only Patients and Guardians
3. **JWT Authentication**: Secure token-based auth
4. **Password Reset**: OTP-based via SMS
5. **Role-Based Access**: Protected routes and middleware
6. **Input Validation**: Joi schemas with conditional validation
7. **Rate Limiting**: Protection against brute force attacks

## 📡 API Endpoints

### Public Routes
- `POST /auth/register/adult` - Register adult patient
- `POST /auth/register/guardian` - Register guardian  
- `POST /auth/login` - Login (returns JWT + dashboard path)
- `POST /auth/forgot-password` - Request password reset OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password after OTP verification

### Protected Routes
- `POST /auth/register/underage` - Guardian-only: create underage patient

## 🧪 Testing the System

### 1. Register a Guardian
```bash
curl -X POST http://localhost:5000/auth/register/guardian \
  -H "Content-Type: application/json" \
  -d '{
    "role": "guardian",
    "username": "guardian1",
    "phone": "+265777777777",
    "guardianName": "John Doe",
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
    "username": "guardian1",
    "password": "password123"
  }'
```

### 3. Create Underage Patient (with JWT)
```bash
curl -X POST http://localhost:5000/auth/register/underage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patientName": "Child Doe",
    "patientDob": "2010-01-01",
    "username": "child1",
    "phone": "+265666666666",
    "nationality": "malawian",
    "nationalId": "987654321",
    "password": "password123"
  }'
```

## 🚨 Important Notes

1. **Password Security**: Change default passwords after first login
2. **Environment Variables**: Use strong, unique secrets in production
3. **MongoDB**: Ensure proper access controls in production
4. **SMS Integration**: Currently uses console.log stub - integrate real SMS provider

## 🔍 Troubleshooting

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

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, validation, roles
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Seed scripts
│   ├── services/        # Token, OTP, SMS services
│   ├── utils/           # Constants and utilities
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── README.md            # Comprehensive documentation
└── SETUP.md             # This setup guide
```

## 🎯 Next Steps

1. **Test all endpoints** with the provided examples
2. **Integrate real SMS provider** (Twilio, Africa's Talking, etc.)
3. **Add more validation** and business logic as needed
4. **Implement password change** functionality
5. **Add user management** endpoints for super admin
6. **Set up monitoring** and logging for production

## 🆘 Support

If you encounter issues:
1. Check the error logs in the console
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check the README.md for detailed documentation

The system is now ready to run! 🎉
