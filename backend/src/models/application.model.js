const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
    applicationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true,
    },

    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanOffer",
        required: true,
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
        required: true,
    },

    requestAmount: {
        type: Number,
        required: true,
    },

    requestedTenure: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [
            "submitted",
            "under_review",
            "referred_to_partner",
            "approved_by_partner",
            "rejected",
            "disbursed",
        ],
        default: "submitted",
        index: true,
    },

    offerSnapshot: {
        partnerName: {
            type: String,
            required: true,
        },

        partnerType: {
            type: String,
            required: true,
        },

        partnerLogo: {
            type: String,
            default: "",
        },

        interestRate: {
            type: Number,
            required: true,
        },

        processingFee: {
            type: String,
            required: true,
        },

        requestedAmount: {
            type: Number,
            required: true,
        },

        requestedTenure: {
            type: Number,
            required: true,
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
    },

    eligibilitySnapshot: {
        score: {
            type: Number,
            default: null,
        },

        status: {
            type: String,
            default: null,
        },

        breakdown: {
            type: Object,
            default: {},
        },
    },

    financialSnapshot: {
        monthlySalary: {
            type: Number,
            default: null,
        },

        cibilScore: {
            type: Number,
            default: null,
        },

        existingEmi: {
            type: Number,
            default: null,
        },

        employmentType: {
            type: String,
            default: null,
        },
    },

    statusHistory: [
        {
            status: {
                type: String,
                required: true,
            },

            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            changedAt: {
                type: Date,
                default: Date.now,
            },

            remarks: {
                type: String,
                default: "",
            },
        },
    ],

    partnerReferenceId: {
        type: String,
        default: "",
        trim: true,
    },

    remarks: {
        type: String,
        default: "",
        trim: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Application", applicationSchema);