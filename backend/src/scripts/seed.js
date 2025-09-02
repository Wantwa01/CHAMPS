import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Staff from '../models/Staff.js';
import { ROLES } from '../utils/roles.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedUsers = async() => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existingSuperAdmin = await Staff.findOne({ role: ROLES.SUPERADMIN });
        if (existingSuperAdmin) {
            console.log('Super admin already exists, skipping...');
        } else {
            // Create super admin
            const superAdminPassword = 'superadmin123'; // Change this in production

            const superAdmin = await Staff.create({
                role: ROLES.SUPERADMIN,
                username: 'superadmin',
                phone: '+265999999999',
                email: 'admin@wezimedicare.com',
                password: superAdminPassword,
                isActive: true
            });

            console.log('✅ Super admin created:', superAdmin.username);
            console.log('   Username: superadmin');
            console.log('   Password: superadmin123');
        }

        // Check if sample staff exists
        const existingStaff = await Staff.findOne({ role: ROLES.STAFF });
        if (existingStaff) {
            console.log('Sample staff already exists, skipping...');
        } else {
            // Create sample staff
            const staffPassword = 'staff123'; // Change this in production

            const staff = await Staff.create({
                role: ROLES.STAFF,
                username: 'nurse1',
                phone: '+265888888888',
                email: 'nurse1@wezimedicare.com',
                password: staffPassword,
                isActive: true
            });

            console.log('✅ Sample staff created:', staff.username);
            console.log('   Username: nurse1');
            console.log('   Password: staff123');
        }

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Super Admin: superadmin / superadmin123');
        console.log('   Staff: nurse1 / staff123');
        console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the seed function
seedUsers();