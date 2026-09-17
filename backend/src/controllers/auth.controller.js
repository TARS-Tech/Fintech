const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/jwt.service");

const { generateOtp } = require("../services/otp.service");
const {
  sendOtpSchema,
  verifyOtpSchema,
} = require("../validations/auth.validation");
const { success, error } = require("../utils/response");

exports.sendOtp = async (req, res) => {
  try {
    const validation = sendOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return error(res, 400, validation.error.issues[0].message);
    }

    const { phone, email } = validation.data;

    const otp = generateOtp();

    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      await User.create({
        phone,
        email,
      });
    }

    console.log("OTP:", otp);

    return success(res, "OTP sent successfully", {
      otp: otp,
    });
  } catch (err) {
    console.log(err);

    return error(res, 500, "Internal Server Error");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const validation = verifyOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return error(res, 400, validation.error.issues[0].message);
    }

    const { phone, otp } = validation.data;

    const otpDoc = await Otp.findOne({
      phone,
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return error(res, 400, "OTP not found");
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });

      return error(res, 400, "OTP expired");
    }

    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;

      await otpDoc.save();

      return error(res, 400, "Invalid OTP");
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return error(res, 404, "User not found");
    }

    user.isVerified = true;

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;

    await user.save();

    await Otp.deleteOne({ _id: otpDoc._id });

    return success(res, "Login Successful", {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        countryCode: user.countryCode,
        name: user.name,
        dob: user.dob,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        kycCompleted: user.kycCompleted,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.log("error", err.message);

    return error(res, 500, "Internal Server Error");
  }
};
