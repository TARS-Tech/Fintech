const router = require("express").Router();
const { getLoan, createLoan, updateLoan, updateLoanStatus } = require("../../controllers/admin/loan.controller");
const { verifyToken, requireAdmin } = require("../../middleware/auth.middleware");

router.use(verifyToken, requireAdmin);

router.get("/", getLoan);
router.post("/", createLoan);
router.put("/:id", updateLoan)
router.put("/:id/status", updateLoanStatus)


module.exports = router;
