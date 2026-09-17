const mongoose = require("mongoose");

const financialProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },

    monthlySalary: {
        type: Number,
        required: true,
        min: 0,
    },

    employmentType: {
        type: String,
        enum: [
            "salaried",
            "self-employed",
            "business",
            "other",
        ],
        required: true
    },

    company: {
        type: String,
        trim: true,
        maxlength: 150,
        required: true,
    },

    existingLoans: {
        type: Number,
        required: true,
        min: 0
        ,
    },

    existingEmi: {
        type: Number,
        required: true,
        min: 0,
    },

    cibilScore: {
        type: Number,
        min: 300,
        max: 900,
        required: true,
    },

    cibilSource: {
        type: String,
        enum: [
            "manual",
            "cibil",
            "sandbox",
        ],
        default: "manual",
    },

    cibilVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("FinancialProfile", financialProfileSchema);