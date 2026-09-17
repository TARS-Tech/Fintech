const { z } = require("zod");

const financialProfileValidation = z.object({
    monthlySalary: z
        .number()
        .min(0, "Monthly salary cannot be negative"),

    employmentType: z.enum(["salaried", "self-employed", "business", "other"]),

    company: z
        .string()
        .trim()
        .min(2, "Company name must be at least 2 characters")
        .max(150, "Company name is too long"),

    existingLoans: z
        .number()
        .int("Existing loans must be a whole number")
        .min(0, "Existing loans cannot be negative"),

    existingEmi: z
        .number()
        .min(0, "Existing EMI cannot be negative"),

    cibilScore: z
        .number()
        .int("CIBIL score must be a whole number")
        .min(300, "Invalid CIBIL score")
        .max(900, "Invalid CIBIL score"),
});

module.exports = {
    financialProfileValidation,
};