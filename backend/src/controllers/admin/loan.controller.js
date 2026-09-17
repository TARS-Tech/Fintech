const Loan = require("../../models/loan.model");
const { success, error } = require("../../utils/response");

exports.getLoan = async (req, res) => {
    try {
        const loans = await Loan.find().sort({ displayOrder: 1, createdAt: -1 });

        return success(res, "Loan fetched successfully", loans);
    } catch (err) {
        console.log("Get loans error:", err);
        return error(res, 500, "Internal Server Error");
    }
};

exports.createLoan = async (req, res) => {
    try {
        const {
            name,
            slug,
            category,
            description,
            amount,
            tenure,
            interestRate,
            features,
            status,
            displayOrder,
        } = req.body;

        if (!name || !slug || !category || !amount || !tenure || !interestRate) {
            return error(res, 400, "Required loan fields are missing");
        }

        if (amount.min > amount.max) {
            return error(
                res,
                400,
                "Minimum loan amount cannot be greater than maximum amount"
            );
        }

        if (tenure.min > tenure.max) {
            return error(
                res,
                400,
                "Minimum tenure cannot be greater than maximum tenure"
            );
        }

        if (interestRate.min > interestRate.max) {
            return error(
                res,
                400,
                "Minimum interest rate cannot be greater than maximum interest rate"
            );
        }

        const existingLoan = await Loan.findOne({
            slug: slug.trim().toLowerCase(),
        });

        if (existingLoan) {
            return error(res, 400, "Loan with this slug already exists");
        }

        const loan = await Loan.create({
            name: name.trim(),
            slug: slug.trim().toLowerCase(),
            category,
            description: description || "",
            amount,
            tenure,
            interestRate,
            features: features || [],
            status: status || "active",
            displayOrder: displayOrder || 0,
        });

        return success(res, "Loan created successfully", loan);
    } catch (err) {
        console.error("Create loan error:", err);

        if (err.code === 11000) {
            return error(res, 409, "Loan with this slug already exists");
        }

        return error(res, 500, "Internal Server Error");
    }
};


exports.updateLoan = async (req, res) => {
    try {
        const { id } = req.params;

        const loan = await Loan.findById(id);

        if (!loan) {
            return error(res, 404, "Loan not found");
        }

        const {
            name,
            slug,
            category,
            description,
            amount,
            tenure,
            interestRate,
            features,
            displayOrder,
        } = req.body;

        if (amount && amount.min > amount.max) {
            return error(
                res,
                400,
                "Minimum loan amount cannot be greater than maximum amount"
            );
        }

        if (tenure && tenure.min > tenure.max) {
            return error(
                res,
                400,
                "Minimum tenure cannot be greater than maximum tenure"
            );
        }

        if (interestRate && interestRate.min > interestRate.max) {
            return error(
                res,
                400,
                "Minimum interest rate cannot be greater than maximum interest rate"
            );
        }

        if (slug) {
            const existingLoan = await Loan.findOne({
                slug: slug.trim().toLowerCase(),
                _id: { $ne: id },
            });

            if (existingLoan) {
                return error(res, 409, "Loan with this slug already exists");
            }

            loan.slug = slug.trim().toLowerCase();
        }

        if (name !== undefined) loan.name = name.trim();
        if (category !== undefined) loan.category = category;
        if (description !== undefined) loan.description = description;
        if (amount !== undefined) loan.amount = amount;
        if (tenure !== undefined) loan.tenure = tenure;
        if (interestRate !== undefined) loan.interestRate = interestRate;
        if (features !== undefined) loan.features = features;
        if (displayOrder !== undefined) loan.displayOrder = displayOrder;

        await loan.save();

        return success(res, "Loan updated successfully", loan);
    } catch (err) {
        console.error("Update loan error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid loan ID");
        }

        if (err.code === 11000) {
            return error(res, 409, "Loan with this slug already exists");
        }

        return error(res, 500, "Internal Server Error");
    }
};

exports.updateLoanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return error(res, 400, "Invalid loan status");
        }

        const loan = await Loan.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!loan) {
            return error(res, 404, "Loan not found");
        }

        return success(res, "Loan status updated successfully", loan);

    } catch (err) {
        console.error("Update loan status error:", err);

        if (err.name === "CastError") {
            return error(res, 400, "Invalid loan ID");
        }

        return error(res, 500, "Internal Server Error");
    }
}