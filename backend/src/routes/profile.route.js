const router = require("express").Router();
const { updateProfile, getProfile } = require("../controllers/profile.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, upload.single("profileImage"), updateProfile);

module.exports = router;