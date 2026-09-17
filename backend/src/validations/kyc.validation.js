const { z } = require("zod");

const aadhaarSchema = z.object({
    aadhaarNumber: z
        .string()
        .trim()
        .regex(/^\d{12}$/, "Aadhaar Number must be 12 digits"),
});

const aadhaarOtpVerifySchema = z.object({
    aadhaarNumber: z.string().trim().regex(/^\d{12}$/, "Aadhaar Number must be 12 digits"),
    referenceId: z.string().min(1, "Reference ID is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

const panSchema = z.object({
    panNumber: z
        .string()
        .trim()
        .toUpperCase()
        .regex(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            "Invalid PAN Number"
        ),
    // nameAsPerPan: z.string().trim().min(1, "Name as per PAN is required"),
    // dateOfBirth: z.string().trim().regex(/^\d{2}-\d{2}-\d{4}$/, "Date of Birth must be in DD-MM-YYYY format"),
});

module.exports = {
    aadhaarSchema,
    aadhaarOtpVerifySchema,
    panSchema,
};