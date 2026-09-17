const { z } = require("zod");

const sendOtpSchema = z.object({
  email: z.email(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/),

  otp: z.string().length(6),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
};
