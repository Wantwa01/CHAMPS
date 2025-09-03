import mongoose from "mongoose";
import Admin from "../models/Admin.js"; // adjust path if needed
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedAdmin = async() => {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (existingAdmin) {
        console.log("Admin already exists");
        process.exit();
    }

    const admin = new Admin({
        name: process.env.SEED_ADMIN_NAME,
        email: process.env.SEED_ADMIN_EMAIL,
        password: process.env.SEED_ADMIN_PASSWORD, // schema should hash it
        role: "SystemAdmin",
    });

    await admin.save();
    console.log("Top-level system admin seeded successfully");
    process.exit();
};

seedAdmin();