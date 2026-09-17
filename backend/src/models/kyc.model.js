const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // One KYC per user
    },

    // aadhaarNumber: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },

    // panNumber: {
    //     type: String,
    //     uppercase: true,
    //     trim: true,
    //     default: "",
    // },
    // panName : {
    //     type: String,
    //     required: true,
    // },

    aadhaar: {
        encrypted: {
            type: String,
            default: "",
        },
        iv: {
            type: String,
            default: "",
        },
        authTag: {
            type: String,
            default: "",
        },
        masked: {
            type: String,
            default: "",
        },
    },

    pan: {
        encrypted: {
            type: String,
            default: "",
        },
        iv: {
            type: String,
            default: "",
        },
        authTag: {
            type: String,
            default: "",
        },
        masked: {
            type: String,
            default: "",
        },
    },

    aadhaarFront: {
        type: String,
        default: ""
    },

    aadhaarBack: {
        type: String,
        default: ""
    },

    panImage: {
        type: String,
        default: ""
    },

    aadhaarVerified: {
        type: Boolean,
        default: false,
    },

    panVerified: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },

    kycCompleted: {
        type: Boolean,
        default: false,
    },

    aadhaarResponse: {
        type: Object,
        default: {},
    },

    panResponse: {
        type: Object,
        default: {},
    },

    verifiedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("KYC", kycSchema);