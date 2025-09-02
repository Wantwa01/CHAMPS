# Backend Integration Guide

## 🚀 Overview

The frontend has been successfully integrated with the backend API for user authentication. This includes:

- ✅ User registration (Adult patients and Guardians)
- ✅ User login with JWT tokens
- ✅ Password reset functionality
- ✅ Role-based authentication
- ✅ Token storage and management
- ✅ Error handling and validation

## 🔧 Setup Instructions

### 1. Backend Setup

Make sure your backend is running:

```bash
cd ../backend
npm install
npm run dev
```

The backend should be running on `http://localhost:3000`

### 2. Frontend Setup

The frontend is already configured to connect to the backend:

```bash
npm install
npm run dev
```

### 3. Test Backend Connection

Run the test script to verify the backend is accessible:

```bash
node test-backend-connection.js
```

## 🔐 Authentication Flow

### Registration
1. User clicks "Sign Up" on login page
2. Chooses between "Adult Patient" or "Guardian" registration
3. Fills out registration form with required fields
4. System validates data and creates user account
5. User is automatically logged in and redirected to dashboard

### Login
1. User enters username and password
2. System authenticates with backend API
3. JWT token is stored in localStorage
4. User is redirected to role-based dashboard

### Logout
1. User clicks logout button
2. JWT token is removed from localStorage
3. User is redirected to home page

## 📊 User Roles

The system supports the following user roles:

- **Patient Adult** (`patient_adult`) - Adult patients
- **Patient Underage** (`patient_underage`) - Minors (created by guardians)
- **Guardian** (`guardian`) - Parents/guardians of minors
- **Staff** (`staff`) - Medical staff
- **Super Admin** (`superadmin`) - System administrators

## 🔧 API Configuration

The API base URL is configured in `services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

To change the API URL, create a `.env` file:

```env
VITE_API_URL=http://your-backend-url/api
```

## 📁 File Structure

```
frontend/wezi-medical-centre/
├── services/
│   ├── api.ts              # API client and HTTP methods
│   └── authService.ts      # Authentication service
├── components/
│   ├── LoginPage.tsx       # Login form
│   ├── RegistrationPage.tsx # Registration form
│   ├── DashboardApp.tsx    # Authentication context
│   └── DashboardWrapper.tsx # Dashboard wrapper
├── types.ts                # TypeScript interfaces
└── App.tsx                 # Main app with routing
```

## 🧪 Testing

### Manual Testing

1. **Registration Test**:
   - Go to login page
   - Click "Sign Up"
   - Fill out registration form
   - Verify user is created and logged in

2. **Login Test**:
   - Use registered credentials
   - Verify successful login
   - Check dashboard access

3. **Role-based Access**:
   - Test different user roles
   - Verify appropriate dashboard is shown

### Automated Testing

Run the backend connection test:

```bash
node test-backend-connection.js
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Running**:
   - Error: `ECONNREFUSED`
   - Solution: Start backend with `npm run dev`

2. **CORS Issues**:
   - Error: CORS policy blocking requests
   - Solution: Check backend CORS configuration

3. **Invalid Credentials**:
   - Error: 401 Unauthorized
   - Solution: Check username/password or register new user

4. **Validation Errors**:
   - Error: 400 Bad Request
   - Solution: Check form validation and required fields

### Debug Mode

Enable debug logging by opening browser DevTools and checking the Console tab for detailed error messages.

## 🔄 Next Steps

1. **Add More API Endpoints**:
   - Patient records
   - Appointments
   - Medical history

2. **Enhance Error Handling**:
   - Better error messages
   - Retry mechanisms
   - Offline support

3. **Add Features**:
   - Password reset via email/SMS
   - Two-factor authentication
   - Session management

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify backend is running and accessible
3. Test with the provided test script
4. Check network tab for API request/response details
