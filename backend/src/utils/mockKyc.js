const crypto = require("crypto");

const otpStore = new Map();

exports.generateMockOtp = (aadhaarNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const referenceId = crypto.randomUUID();

    otpStore.set(referenceId, {
        otp,
        aadhaarNumber,
        expires: Date.now() + 5 * 60 * 1000,
    });

    console.log("================================");
    console.log(" MOCK OTP :", otp);
    console.log(" Reference :", referenceId);
    console.log("================================");

    return {
        referenceId,
        otp,
    };
};

exports.verifyMockOtp = (referenceId, otp) => {

    const data = otpStore.get(referenceId);

    if (!data) {
        return {
            success: false,
            message: "Invalid Reference ID",
        };
    }

    if (Date.now() > data.expires) {

        otpStore.delete(referenceId);

        return {
            success: false,
            message: "OTP Expired",
        };
    }

    if (data.otp !== otp) {

        return {
            success: false,
            message: "Invalid OTP",
        };

    }

    otpStore.delete(referenceId);

    return {
        success: true,
    };

};