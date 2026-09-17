const User = require("../models/user.model");
const { profileSchema } = require("../validations/profile.validation");
const { success, error } = require("../utils/response");

exports.updateProfile = async (req, res) => {
    try {
        const validation = profileSchema.safeParse(req.body);

        if (!validation.success) {
            return error(res, 400, validation.error.issues[0].message);
        }

        const { name, dob, gender, address, city, state, pincode } = validation.data;

        // Parse dob from "DD / MM / YYYY" format sent by the mobile app
        let parsedDob = null;
        if (dob) {
            const parts = dob.split("/").map(p => p.trim());
            if (parts.length === 3) {
                const [day, month, year] = parts;
                parsedDob = new Date(`${year}-${month}-${day}`);
            }
        }

        const updateData = {
            name,
            dob: parsedDob,
            gender,
            address,
            city,
            state,
            pincode,
            profileCompleted: true,
        };

        if (req.file) {
            updateData.profileImage = req.file ? req.file.path : "";
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            {
                new: true,
            }
        );

        return success(
            res,
            "Profile Updated",
            user
        );
    } catch (err) {
        console.log("error in updateProfile:", err);

        return error(res, 500, "Internal Server Error");
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return error(res, 404, "User not found");
        }
        return success(res, "Profile fetched successfully", user);
    } catch (err) {
        console.log("error", err.message);
        return error(res, 500, "Internal Server Error");
    }
}