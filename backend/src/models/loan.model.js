const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        enum: ["personal", "home", "business", "education", "vehicle", "gold"],
        index: true,
    },

    description: {
        type: String,
        default: "",
        trim: true,
    },

    amount: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        step: {
            type: Number,
            default: 5000,
        },
    },

    tenure: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            default: "months",
        },
    },

    interestRate: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            default: "% p.a.",
        },
    },

    features: {
        type: [String],
        default: [],
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        index: true,
    },

    displayOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,

})

module.exports = mongoose.model("Loan", LoanSchema);