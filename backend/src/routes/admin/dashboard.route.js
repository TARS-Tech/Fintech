const router = require("express").Router();
const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");
const {
    verifyToken,
    requireAdmin,
} = require("../../middleware/auth.middleware");

router.get(
    "/stats",
    verifyToken,
    requireAdmin,
    getDashboardStats
);

module.exports = router;