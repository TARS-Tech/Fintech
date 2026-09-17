const mongoose = require("mongoose");

const loanOfferSchema = new mongoose.Schema({
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true,
        index: true,
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
        required: true,
        index: true,
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
    },

    interestRate: {
        type: Number,
        required: true,
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

    processingFee: {
        type: String,
        default: "Up to 2%",
        trim: true,
    },


    eligibilityCriteria: {
        minCibilScore: {
            type: Number,
            default: 650,
        },

        minMonthlySalary: {
            type: Number,
            default: 25000,
        },
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

    isFeatured: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LoanOffer", loanOfferSchema);