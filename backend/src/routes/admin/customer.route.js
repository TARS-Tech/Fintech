const router = require("express").Router();
const { getCustomers, getCustomerById } = require("../../controllers/admin/customer.controller");
const {
    verifyToken,
    requireAdmin,
} = require("../../middleware/auth.middleware");

router.use(verifyToken, requireAdmin);

router.get("/", getCustomers);
router.get("/:id", getCustomerById);

module.exports = router;
