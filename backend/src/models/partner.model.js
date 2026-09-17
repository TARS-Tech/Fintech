const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },

    type: {
        type: String,
        required: true,
        enum: ["Bank", "NBFC"],
    },

    logo: {
        type: String,
        default: "",
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        index: true,
    },
}, {
    timestamps: true,
}
)

module.exports = mongoose.model("Partner", partnerSchema);