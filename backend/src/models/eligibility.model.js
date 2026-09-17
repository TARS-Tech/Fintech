const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },

    score: {
        type: Number,
        required: true,
        min: 0,
        max: 80,
    },

    status: {
        type: String,
        enum: ["eligible", "not_eligible"],
        required: true,
    },

    breakdown: {
        cibil: {
            type: Number,
            required: true,
            min: 0,
            max: 30,
        },

        salary: {
            type: Number,
            required: true,
            min: 0,
            max: 20,
        },

        existingLoans: {
            type: Number,
            required: true,
            min: 0,
            max: 30,
        },
    },

    calculatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model("Eligibility", eligibilitySchema);