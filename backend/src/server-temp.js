import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@wezi.com',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '0999999999',
        role: 'superadmin',
        status: 'active',
        password: 'admin123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        username: 'doctor',
        email: 'doctor@wezi.com',
        firstName: 'Dr. John',
        lastName: 'Smith',
        phone: '0888888888',
        role: 'staff',
        status: 'active',
        password: 'doctor123',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        lastLogin: '2024-01-15T09:15:00Z'
    },
    {
        id: '3',
        username: 'patient',
        email: 'patient@wezi.com',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '0777777777',
        role: 'patient_adult',
        status: 'active',
        password: 'patient123',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        lastLogin: '2024-01-14T14:20:00Z'
    }
];

const mockRoles = [
    {
        id: '1',
        name: 'superadmin',
        description: 'Full system access and administration',
        permissions: ['*'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'staff',
        description: 'Medical staff and doctors',
        permissions: ['read:patients', 'write:patients', 'read:appointments', 'write:appointments'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        name: 'patient_adult',
        description: 'Adult patients',
        permissions: ['read:own_data', 'write:own_data', 'read:appointments', 'write:appointments'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '4',
        name: 'patient_guardian',
        description: 'Guardians of child patients',
        permissions: ['read:child_data', 'write:child_data', 'read:appointments', 'write:appointments'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '5',
        name: 'ambulance',
        description: 'Ambulance service providers',
        permissions: ['read:emergency_requests', 'write:emergency_requests', 'read:locations'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

// Simple password comparison (for testing only)
const comparePassword = (plain, hashed) => {
    // In real app, this would use bcrypt
    return plain === hashed;
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            details: ['Username and password are required'] 
        });
    }
    
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!comparePassword(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    res.json({
        message: 'Logged in',
        token,
        user: {
            id: user.id,
            username: user.username,
            phone: user.phone,
            role: user.role
        },
        dashboard: '/dashboard'
    });
});

app.post('/api/auth/register/adult', (req, res) => {
    const { username, phone, nationality, nationalId, passportNumber, password } = req.body;
    
    if (!username || !phone || !nationality || !password) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            details: ['Required fields are missing'] 
        });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.username === username || u.phone === phone);
    if (existingUser) {
        return res.status(409).json({ message: 'Username or phone already exists' });
    }
    
    // Create new user
    const newUser = {
        id: (mockUsers.length + 1).toString(),
        username,
        phone,
        nationality,
        nationalId,
        passportNumber,
        role: 'patient_adult',
        password
    };
    
    mockUsers.push(newUser);
    
    // Mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    
    res.status(201).json({
        message: 'Registered adult patient',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            phone: newUser.phone,
            role: newUser.role
        }
    });
});

app.post('/api/auth/register/guardian', (req, res) => {
    const { username, phone, guardianName, nationality, nationalId, passportNumber, password } = req.body;
    
    if (!username || !phone || !guardianName || !nationality || !password) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            details: ['Required fields are missing'] 
        });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.username === username || u.phone === phone);
    if (existingUser) {
        return res.status(409).json({ message: 'Username or phone already exists' });
    }
    
    // Create new user
    const newUser = {
        id: (mockUsers.length + 1).toString(),
        username,
        phone,
        guardianName,
        nationality,
        nationalId,
        passportNumber,
        role: 'guardian',
        password
    };
    
    mockUsers.push(newUser);
    
    // Mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    
    res.status(201).json({
        message: 'Guardian registered',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            phone: newUser.phone,
            role: newUser.role
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Backend server is running!', 
        timestamp: new Date().toISOString(),
        users: mockUsers.length
    });
});

// User Management Endpoints
app.get('/api/admin/users', (req, res) => {
    res.json({ users: mockUsers });
});

app.post('/api/admin/users', (req, res) => {
    const { username, email, password, firstName, lastName, role, phone, address } = req.body;
    
    const newUser = {
        id: (mockUsers.length + 1).toString(),
        username,
        email,
        firstName,
        lastName,
        role,
        status: 'active',
        password, // In real app, this would be hashed
        phone: phone || '',
        address: address || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    res.json({ user: newUser });
});

app.put('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    res.json({ user: mockUsers[userIndex] });
});

app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    mockUsers.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
});

// Role Management Endpoints
app.get('/api/admin/roles', (req, res) => {
    res.json({ roles: mockRoles });
});

app.post('/api/admin/roles', (req, res) => {
    const { name, description, permissions } = req.body;
    
    const newRole = {
        id: (mockRoles.length + 1).toString(),
        name,
        description,
        permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    mockRoles.push(newRole);
    res.json({ role: newRole });
});

app.put('/api/admin/roles/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const roleIndex = mockRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
        return res.status(404).json({ error: 'Role not found' });
    }
    
    mockRoles[roleIndex] = {
        ...mockRoles[roleIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    res.json({ role: mockRoles[roleIndex] });
});

app.delete('/api/admin/roles/:id', (req, res) => {
    const { id } = req.params;
    
    const roleIndex = mockRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
        return res.status(404).json({ error: 'Role not found' });
    }
    
    mockRoles.splice(roleIndex, 1);
    res.json({ message: 'Role deleted successfully' });
});

// Bulk Import Endpoint
app.post('/api/admin/users/bulk-import', (req, res) => {
    // Mock bulk import response
    res.json({
        success: 5,
        failed: 1,
        errors: ['Invalid email format for user: invalid@email']
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log(`📊 Available test users:`);
    console.log(`   - admin / admin123 (superadmin)`);
    console.log(`   - doctor / doctor123 (staff)`);
    console.log(`   - patient / patient123 (patient_adult)`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
