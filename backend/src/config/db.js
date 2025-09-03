import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true
        });
        const { host, name } = mongoose.connection;
        const redacted = (process.env.MONGO_URI || '');
        console.log(" MongoDB connected", { host, db: name, uri: redacted });
    } catch (err) {
        console.error(" MongoDB connection error:", err.message);
        process.exit(1);
    }
};