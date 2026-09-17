const router = require("express").Router();
const { getActiveOffers, getOfferById } = require("../controllers/loanOffer.controller");

router.get("/", getActiveOffers);
router.get("/:id", getOfferById);

module.exports = router;
