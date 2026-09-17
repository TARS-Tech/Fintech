const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const { calculateEligibility, getEligibility } = require("../controllers/eligibility.controller");
const router = express.Router();

router.post("/calculate", verifyToken, calculateEligibility);
router.get("/", verifyToken, getEligibility);

module.exports = router;