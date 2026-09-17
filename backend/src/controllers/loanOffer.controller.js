const mongoose = require("mongoose");
const LoanOffer = require("../models/loanOffer.model");
const Loan = require("../models/loan.model");
const Partner = require("../models/partner.model");
const { success, error } = require("../utils/response");

// Fetch active loan offers for customer app
exports.getActiveOffers = async (req, res) => {
    try {
        const { loanId, loanSlug, category, featured } = req.query;

        const query = { status: "active" };

        if (featured === "true") {
            query.isFeatured = true;
        }

        const targetLoanIdentifier = loanId || loanSlug;

        if (targetLoanIdentifier) {
            if (mongoose.Types.ObjectId.isValid(targetLoanIdentifier)) {
                query.loanId = targetLoanIdentifier;
            } else {
                // If targetLoanIdentifier is a slug string like "personal-loan"
                const loan = await Loan.findOne({
                    slug: targetLoanIdentifier.trim().toLowerCase(),
                    status: "active",
                });

                if (loan) {
                    query.loanId = loan._id;
                } else {
                    return success(res, "No active offers found for this loan", []);
                }
            }
        }

        const offers = await LoanOffer.find(query)
            .populate({
                path: "loanId",
                select: "name slug category description amount tenure interestRate features status",
                match: { status: "active" }
            })
            .populate({
                path: "partnerId",
                select: "name code type logo status",
                match: { status: "active" }
            })
            .sort({ displayOrder: 1, isFeatured: -1, createdAt: -1 });

        // Filter out offers where populated loan or partner is inactive
        const validOffers = offers.filter(offer => offer.loanId && offer.partnerId);

        return success(res, "Active loan offers fetched successfully", validOffers);
    } catch (err) {
        console.error("Get active offers error:", err);
        return error(res, 500, "Internal Server Error");
    }
};

// Fetch offer by ID
exports.getOfferById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return error(res, 400, "Invalid offer ID format");
        }

        const offer = await LoanOffer.findOne({ _id: id, status: "active" })
            .populate({
                path: "loanId",
                select: "name slug category description amount tenure interestRate features status",
                match: { status: "active" }
            })
            .populate({
                path: "partnerId",
                select: "name code type logo status",
                match: { status: "active" }
            });

        if (!offer || !offer.loanId || !offer.partnerId) {
            return error(res, 404, "Loan offer not found or inactive");
        }

        return success(res, "Loan offer fetched successfully", offer);
    } catch (err) {
        console.error("Get offer by ID error:", err);
        return error(res, 500, "Internal Server Error");
    }
};
