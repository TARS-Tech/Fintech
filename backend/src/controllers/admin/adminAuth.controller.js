const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../../services/jwt.service");
const { success, error } = require("../../utils/response");


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // console.log("email:", email, "pass:", password)

        if (!email || !password) {
            return error(res, 400, "Email and password are required")
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });


        // console.log("Found user:", user ? {
        //     id: user._id,
        //     email: user.email,
        //     role: user.role,
        //     hasPassword: !!user.password,
        // } : null);

        if (!user) {
            return error(res, 401, "Invalid email or password");
        }

        if (user.role !== "admin") {
            return error(res, 403, "Admin access required");
        }

        if (!user.password) {
            return error(res, 401, "Admin account is not configured");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return error(res, 401, "Invalid email or password");
        }

        user.isVerified = true;

        const accessToken = generateAccessToken(
            user._id,
            user.role
        );

        const refreshToken = generateRefreshToken(
            user._id,
            user.role
        );

        user.refreshToken = refreshToken;

        await user.save();

        // console.log("user:", user)

        return success(res, "Admin login successful", {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        console.error("Admin login error:", err);

        return error(res, 500, "Internal Server Error");
    }
};

