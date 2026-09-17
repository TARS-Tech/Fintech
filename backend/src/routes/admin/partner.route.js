const router = require("express").Router();
const {
    verifyToken,
    requireAdmin,
} = require("../../middleware/auth.middleware");
const { getPartners, createPartner, updatePartner, updatePartnerStatus, deletePartner } = require("../../controllers/admin/partner.controller");

router.use(verifyToken, requireAdmin);

router.get("/", getPartners);
router.post("/", createPartner);
router.put("/:id", updatePartner);
router.put("/:id/status", updatePartnerStatus);
router.delete("/:id", deletePartner);

module.exports = router;