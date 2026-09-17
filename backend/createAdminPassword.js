require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/user.model");

const ADMIN_EMAIL = "admin@finpilot.com";
const ADMIN_PASSWORD = "Admin@12345";

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const existingAdmin = await User.findOne({
            email: ADMIN_EMAIL,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            phone: 9999999999,
            name: "FinPilot Admin",
            role: "admin",
            isVerified: true,
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Password:", ADMIN_PASSWORD);

        process.exit(0);
    } catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
}

createAdmin();