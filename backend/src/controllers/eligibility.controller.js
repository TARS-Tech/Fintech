const { createOrUpdateEligibility, getEligibility } = require("../services/eligibility.service")
const { error, success } = require("../utils/response")
const { financialProfileValidation } = require("../validations/eligibility.validation")

exports.calculateEligibility = async (req, res) => {
    try {
        const validation = financialProfileValidation.safeParse(req.body);

        if (!validation.success) {
            return error(
                res,
                400,
                validation.error.issues[0].message
            );
        }

        const result = await createOrUpdateEligibility(req.user.id, validation.data);

        return success(
            res,
            "Eligibility calculated successfully",
            result
        );
    } catch (err) {
        console.log(
            "Eligibility calculation error:",
            err
        );

        return error(
            res,
            500,
            "Failed to calculate eligibility"
        );
    }
};

exports.getEligibility = async (req, res) => {
    try {
        const eligibility = await getEligibility(req.user.id);

        return success(
            res,
            "Eligibility fetched successfully",
            eligibility
        );
    } catch (err) {
        console.log(
            "Eligibility fetch error:",
            err
        );

        return error(
            res,
            500,
            "Failed to fetch eligibility"
        );
    }
}

