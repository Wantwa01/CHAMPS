import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["adult-patient", "guardian"], required: true },
    nationality: { type: String, enum: ["Malawian", "Non-Malawian"], required: true },
    nationalId: { type: String },
    passportNumber: { type: String },
    guardianFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }], // if guardian
    otpCode: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);