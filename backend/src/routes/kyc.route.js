const router = require("express").Router();
const { verifyToken } = require("../middleware/auth.middleware");
const uploadKyc = require("../middleware/uploadKyc.middleware");
const { verifyPan, getKycStatusController, sendAadhaarOtp, verifyAadhaarOtp } = require("../controllers/kyc.controller");

// router.post("/verify-aadhaar", verifyToken, uploadKyc.fields([{ name: "aadhaarFront", maxCount: 1 }, { name: "aadhaarBack", maxCount: 1 }]), verifyAadhaar);
router.post("/send-aadhaar-otp", verifyToken, sendAadhaarOtp);
router.post("/verify-aadhaar-otp", verifyToken, uploadKyc.fields([{ name: "aadhaarFront", maxCount: 1 }, { name: "aadhaarBack", maxCount: 1 }]), verifyAadhaarOtp);
router.post("/verify-pan", verifyToken, uploadKyc.single("panImage"), verifyPan);
router.get("/status", verifyToken, getKycStatusController);

module.exports = router;