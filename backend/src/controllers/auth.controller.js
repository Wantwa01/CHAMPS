import User from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register super admin
export const registerSuperAdmin = async(req, res) => {
    try {
        const { username, phone, password, nationality } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            phone,
            password: hashedPassword,
            role: "super-admin",
            nationality
        });

        res.status(201).json({ message: "Super Admin created", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// login
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};