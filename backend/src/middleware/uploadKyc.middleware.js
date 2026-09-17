const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "fintech/kyc",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const uploadKyc = multer({ storage });

module.exports = uploadKyc;