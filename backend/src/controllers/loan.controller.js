const mongoose = require("mongoose");
const Loan = require("../models/loan.model");
const { success, error } = require("../utils/response");

// Fetch active loan products for customer app
exports.getActiveLoans = async (req, res) => {
    try {
        const { category } = req.query;
        const query = { status: "active" };

        if (category && category !== "all") {
            query.category = category;
        }

        const loans = await Loan.find(query).sort({ displayOrder: 1, createdAt: -1 });

        return success(res, "Active loan products fetched successfully", loans);
    } catch (err) {
        console.error("Get active loans error:", err);
        return error(res, 500, "Internal Server Error");
    }
};

// Fetch active loan product by slug or ID
exports.getLoanBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const queryConditions = [{ slug: slug.trim().toLowerCase() }];
        if (mongoose.Types.ObjectId.isValid(slug)) {
            queryConditions.push({ _id: slug });
        }

        const loan = await Loan.findOne({
            $or: queryConditions,
            status: "active",
        });

        if (!loan) {
            return error(res, 404, "Loan product not found or inactive");
        }

        return success(res, "Loan product fetched successfully", loan);
    } catch (err) {
        console.error("Get loan by slug error:", err);
        return error(res, 500, "Internal Server Error");
    }
};
