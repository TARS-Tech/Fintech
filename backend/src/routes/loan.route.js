const router = require("express").Router();
const { getActiveLoans, getLoanBySlug } = require("../controllers/loan.controller");

router.get("/", getActiveLoans);
router.get("/:slug", getLoanBySlug);

module.exports = router;
