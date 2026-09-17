const LoanOffer = require("../../models/loanOffer.model");
const Loan = require("../../models/loan.model");
const Partner = require("../../models/partner.model");
const { success, error } = require("../../utils/response");


exports.getOffers = async (req, res) => {
    try {
        const offers = await LoanOffer.find()
            .populate("loanId", "name slug category")
            .populate("partnerId", "name code type logo")
            .sort({ displayOrder: 1, createdAt: -1 });

        return success(res, "Offers fetched successfully", offers);
    } catch (err) {
        console.log("Get offers error:", err);
        return error(res, 500, "Internal Server Error");
    }
};


exports.createOffer = async (req, res) => {
    try {
        const {
            loanId,
            partnerId,
            amount,
            interestRate,
            tenure,
            processingFee,
            eligibilityCriteria,
            status,
            displayOrder,
            isFeatured,
        } = req.body;

        if (
            !loanId ||
            !partnerId ||
            !amount ||
            interestRate === undefined ||
            !tenure
        ) {
            return error(res, 400, "Required offer fields are missing");
        }

        if (amount.min > amount.max) {
            return error(
                res,
                400,
                "Minimum offer amount cannot be greater than maximum amount"
            );
        }

        if (tenure.min > tenure.max) {
            return error(
                res,
                400,
                "Minimum tenure cannot be greater than maximum tenure"
            );
        }

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return error(res, 404, "Loan not found");
        }

        if (loan.status !== "active") {
            return error(res, 400, "Cannot create offer for an inactive loan");
        }

        const partner = await Partner.findById(partnerId);

        if (!partner) {
            return error(res, 404, "Partner not found");
        }

        if (partner.status !== "active") {
            return error(
                res,
                400,
                "Cannot create offer for an inactive partner"
            );
        }

        if (
            amount.min < loan.amount.min ||
            amount.max > loan.amount.max
        ) {
            return error(
                res,
                400,
                "Offer amount must fit within the loan amount range"
            );
        }

        const offer = await LoanOffer.create({
            loanId,
            partnerId,
            amount,
            interestRate,
            tenure,
            processingFee,
            eligibilityCriteria,
            status: status || "active",
            displayOrder: displayOrder || 0,
            isFeatured: isFeatured || false,
        });

        const populatedOffer = await LoanOffer.findById(offer._id)
            .populate("loanId", "name slug category")
            .populate("partnerId", "name code type logo");

        return success(
            res,
            "Offer created successfully",
            populatedOffer
        );
    } catch (err) {
        console.log("Create offer error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid loan or partner ID");
        }

        return error(res, 500, "Internal Server Error");
    }
};

exports.updateOffer = async (req, res) => {
    try {
        const { id } = req.params;

        const offer = await LoanOffer.findById(id);

        if (!offer) {
            return error(res, 404, "Offer not found");
        }

        const {
            loanId,
            partnerId,
            amount,
            interestRate,
            tenure,
            processingFee,
            eligibilityCriteria,
            displayOrder,
            isFeatured,
        } = req.body;

        const finalLoanId = loanId || offer.loanId;
        const finalPartnerId = partnerId || offer.partnerId;
        const finalAmount = amount || offer.amount;
        const finalTenure = tenure || offer.tenure;

        if (finalAmount.min > finalAmount.max) {
            return error(
                res,
                400,
                "Minimum offer amount cannot be greater than maximum amount"
            );
        }

        if (finalTenure.min > finalTenure.max) {
            return error(
                res,
                400,
                "Minimum tenure cannot be greater than maximum tenure"
            );
        }

        const loan = await Loan.findById(finalLoanId);

        if (!loan) {
            return error(res, 404, "Loan not found");
        }

        if (loan.status !== "active") {
            return error(res, 400, "Cannot use an inactive loan");
        }

        const partner = await Partner.findById(finalPartnerId);

        if (!partner) {
            return error(res, 404, "Partner not found");
        }

        if (partner.status !== "active") {
            return error(res, 400, "Cannot use an inactive partner");
        }

        if (
            finalAmount.min < loan.amount.min ||
            finalAmount.max > loan.amount.max
        ) {
            return error(
                res,
                400,
                "Offer amount must fit within the loan amount range"
            );
        }

        if (loanId !== undefined) offer.loanId = loanId;
        if (partnerId !== undefined) offer.partnerId = partnerId;
        if (amount !== undefined) offer.amount = amount;
        if (interestRate !== undefined) offer.interestRate = interestRate;
        if (tenure !== undefined) offer.tenure = tenure;
        if (processingFee !== undefined) offer.processingFee = processingFee;
        if (eligibilityCriteria !== undefined) {
            offer.eligibilityCriteria = eligibilityCriteria;
        }
        if (displayOrder !== undefined) {
            offer.displayOrder = displayOrder;
        }
        if (isFeatured !== undefined) {
            offer.isFeatured = isFeatured;
        }

        await offer.save();

        const populatedOffer = await LoanOffer.findById(offer._id)
            .populate("loanId", "name slug category")
            .populate("partnerId", "name code type logo");

        return success(
            res,
            "Offer updated successfully",
            populatedOffer
        );
    } catch (err) {
        console.error("Update offer error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid offer, loan or partner ID");
        }

        return error(res, 500, "Internal Server Error");
    }
};


exports.updateOfferStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return error(res, 400, "Invalid offer status");
        }

        const offer = await LoanOffer.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("loanId", "name slug category")
            .populate("partnerId", "name code type logo");

        if (!offer) {
            return error(res, 404, "Offer not found");
        }

        return success(
            res,
            "Offer status updated successfully",
            offer
        );
    } catch (err) {
        console.error("Update offer status error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid offer ID");
        }

        return error(res, 500, "Internal Server Error");
    }
};