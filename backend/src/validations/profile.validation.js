const { z } = require("zod");

const profileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"], { error: "Invalid gender" }),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode")
});


module.exports = {
    profileSchema
}