const { z } = require("zod");

const sendOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-10))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Please enter a valid 10-digit mobile number",
    }),
});

const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-10))
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Please enter a valid 10-digit mobile number",
    }),

  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
};
