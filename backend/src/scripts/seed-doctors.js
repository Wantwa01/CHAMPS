import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedDoctors = async() => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Check if doctors already exist
        const existingDoctors = await Doctor.countDocuments();
        if (existingDoctors > 0) {
            console.log(`${existingDoctors} doctors already exist, skipping...`);
            return;
        }

        // Sample doctors data
        const doctorsData = [{
                name: 'Dr. John Smith',
                specialization: 'Cardiology',
                qualifications: 'MBBS, MD (Cardiology)',
                experience: 15,
                phone: '+265999999990',
                email: 'john.smith@wezimedicare.com',
                workingHours: [
                    { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' }, // Monday
                    { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' }, // Tuesday
                    { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' }, // Wednesday
                    { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' }, // Thursday
                    { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' } // Friday
                ]
            },
            {
                name: 'Dr. Sarah Johnson',
                specialization: 'Pediatrics',
                qualifications: 'MBBS, MD (Pediatrics)',
                experience: 12,
                phone: '+265999999991',
                email: 'sarah.johnson@wezimedicare.com',
                workingHours: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
                    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
                    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
                    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Thursday
                    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' } // Friday
                ]
            },
            {
                name: 'Dr. Michael Brown',
                specialization: 'Orthopedics',
                qualifications: 'MBBS, MS (Orthopedics)',
                experience: 18,
                phone: '+265999999992',
                email: 'michael.brown@wezimedicare.com',
                workingHours: [
                    { dayOfWeek: 1, startTime: '07:00', endTime: '16:00' }, // Monday
                    { dayOfWeek: 2, startTime: '07:00', endTime: '16:00' }, // Tuesday
                    { dayOfWeek: 3, startTime: '07:00', endTime: '16:00' }, // Wednesday
                    { dayOfWeek: 4, startTime: '07:00', endTime: '16:00' }, // Thursday
                    { dayOfWeek: 5, startTime: '07:00', endTime: '16:00' } // Friday
                ]
            },
            {
                name: 'Dr. Emily Davis',
                specialization: 'Dermatology',
                qualifications: 'MBBS, MD (Dermatology)',
                experience: 10,
                phone: '+265999999993',
                email: 'emily.davis@wezimedicare.com',
                workingHours: [
                    { dayOfWeek: 1, startTime: '10:00', endTime: '19:00' }, // Monday
                    { dayOfWeek: 2, startTime: '10:00', endTime: '19:00' }, // Tuesday
                    { dayOfWeek: 3, startTime: '10:00', endTime: '19:00' }, // Wednesday
                    { dayOfWeek: 4, startTime: '10:00', endTime: '19:00' }, // Thursday
                    { dayOfWeek: 5, startTime: '10:00', endTime: '19:00' } // Friday
                ]
            },
            {
                name: 'Dr. Robert Wilson',
                specialization: 'Neurology',
                qualifications: 'MBBS, MD (Neurology)',
                experience: 20,
                phone: '+265999999994',
                email: 'robert.wilson@wezimedicare.com',
                workingHours: [
                    { dayOfWeek: 1, startTime: '08:30', endTime: '17:30' }, // Monday
                    { dayOfWeek: 2, startTime: '08:30', endTime: '17:30' }, // Tuesday
                    { dayOfWeek: 3, startTime: '08:30', endTime: '17:30' }, // Wednesday
                    { dayOfWeek: 4, startTime: '08:30', endTime: '17:30' }, // Thursday
                    { dayOfWeek: 5, startTime: '08:30', endTime: '17:30' } // Friday
                ]
            }
        ];

        // Create doctors
        const createdDoctors = await Doctor.insertMany(doctorsData);

        console.log(`✅ ${createdDoctors.length} doctors created successfully!`);

        // Generate slots for the next 30 days for each doctor
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        for (const doctor of createdDoctors) {
            const slotsGenerated = await Doctor.generateSlotsForDateRange(
                doctor._id,
                startDate,
                endDate,
                30 // 30-minute slots
            );
            console.log(`   ${doctor.name}: ${slotsGenerated} slots generated`);
        }

        console.log('\n🎉 Doctor seeding completed successfully!');
        console.log('\n📋 Available Specializations:');
        const specializations = [...new Set(createdDoctors.map(d => d.specialization))];
        specializations.forEach(spec => console.log(`   - ${spec}`));

    } catch (error) {
        console.error('❌ Doctor seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the seed function
seedDoctors();