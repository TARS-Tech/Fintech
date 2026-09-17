const User = require("../../models/user.model");
const Loan = require("../../models/loan.model");
const Partner = require("../../models/partner.model");
const LoanOffer = require("../../models/loanOffer.model");
const { success, error } = require("../../utils/response");

exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalCustomers,
            activeLoans,
            activePartners,
            activeOffers,
        ] = await Promise.all([
            User.countDocuments({ role: "customer" }),
            Loan.countDocuments({ status: "active" }),
            Partner.countDocuments({ status: "active" }),
            LoanOffer.countDocuments({ status: "active" }),
        ]);

        return success(res, "Dashboard stats fetched successfully", {
            totalCustomers,
            activeLoans,
            activePartners,
            activeOffers,
        });

    } catch (err) {
        console.log("Dashboard stats error:", err);

        return error(res, 500, "Internal Server Error");
    }
};