import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';

dotenv.config();

const testConnection = async() => {
    try {
        console.log('Testing database connection...');
        console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');

        await connectDB();
        console.log('✅ Database connection successful!');

        // Test basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
        process.exit(0);
    }
};

testConnection();