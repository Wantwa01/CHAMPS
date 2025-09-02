import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Staff from '../models/Staff.js';

const seed = async() => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI missing');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);

        const exists = await Staff.findOne({ username: 'superadmin' });
        if (exists) {
            console.log('Superadmin already exists');
            process.exit(0);
        }

        const pw = 'Admin@123'; // change immediately or set via env
        const passwordHash = await Staff.hashPassword(pw);

        const admin = await Staff.create({
            username: 'superadmin',
            phone: '+265999000000',
            email: 'admin@wezimedicare.local',
            role: 'superadmin',
            passwordHash
        });

        console.log('Superadmin created: username=superadmin password=', pw);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();