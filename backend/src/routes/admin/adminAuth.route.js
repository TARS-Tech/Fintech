const { login } = require("../../controllers/admin/adminAuth.controller");
const { verifyToken, requireAdmin } = require("../../middleware/auth.middleware");

const router = require("express").Router();


router.post("/login", login);

router.get("/test", verifyToken, requireAdmin, (req, res) => {
    return res.json({
        success: true,
        message: "Admin access verified",
        user: req.user,
    });
})

module.exports = router;