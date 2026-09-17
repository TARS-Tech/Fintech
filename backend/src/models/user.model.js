const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      default: "+91",
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    dob: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    password: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    kycCompleted: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
