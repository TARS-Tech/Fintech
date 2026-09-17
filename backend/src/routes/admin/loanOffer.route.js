const router = require("express").Router();

const {
    verifyToken,
    requireAdmin,
} = require("../../middleware/auth.middleware");

const {
    getOffers,
    createOffer,
    updateOffer,
    updateOfferStatus,
} = require("../../controllers/admin/loanOffer.controller");

router.use(verifyToken, requireAdmin);

router.get("/", getOffers);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.patch("/:id/status", updateOfferStatus);

module.exports = router;