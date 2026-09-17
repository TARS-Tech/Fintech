const FinancialProfile = require("../models/financialProfile.model");
const Eligibilty = require("../models/eligibility.model");

const calculateCibilPoints = (score) => {
    if (score >= 750) return 30;
    if (score >= 700) return 20;
    if (score >= 650) return 10;

    return 0;
};

const calculateSalaryPoints = (salary) => {
    if (salary >= 50000) return 20;
    if (salary >= 30000) return 10;

    return 0;
};

const calculateLoanPoints = (loans) => {
    if (loans === 0) return 30;
    if (loans === 1) return 20;
    if (loans === 2) return 10;

    return 0;
};

const calculateEligibility = ({
    cibilScore,
    monthlySalary,
    existingLoans,
}) => {
    const cibilPoints = calculateCibilPoints(cibilScore);

    const salaryPoints = calculateSalaryPoints(monthlySalary);

    const loanPoints = calculateLoanPoints(existingLoans);

    const totalScore = cibilPoints + salaryPoints + loanPoints;

    return {
        score: totalScore,
        status: totalScore >= 70 ? "eligible" : "not_eligible",
        breakdown: {
            cibil: cibilPoints,
            salary: salaryPoints,
            existingLoans: loanPoints,
        }
    }
};


const createOrUpdateEligibility = async (userId, data) => {
    const financialProfile = await FinancialProfile.findOneAndUpdate(
        { userId },
        {
            ...data,
            userId,
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );

    const result = await calculateEligibility({
        cibilScore: financialProfile.cibilScore,
        monthlySalary: financialProfile.monthlySalary,
        existingLoans: financialProfile.existingLoans,
    });

    const eligibility = await Eligibilty.findOneAndUpdate(
        { user: userId },
        {
            user: userId,
            score: result.score,
            status: result.status,
            breakdown: result.breakdown,
            calculatedAt: new Date(),
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );

    return {
        financialProfile,
        eligibility,
    };
};

const getEligibility = async (userId) => {
    const eligibility = await Eligibilty.findOne({ user: userId });
    // const financialProfile = await FinancialProfile.findOne({ userId });
    if (!eligibility) {
        return {
            eligibility: {
                score: null,
                status: null,
                breakdown: {
                    cibil: null,
                    salary: null,
                    existingLoans: null,
                },
                calculatedAt: null,
            },
            financialProfile: {
                age: null,
                employmentType: null,
                monthlySalary: null,
                existingLoans: null,
                cibilScore: null,
                userId: userId,
            },
        }
    }

    return {
        eligibility,
        // financialProfile,
    };
};

module.exports = {
    calculateEligibility,
    createOrUpdateEligibility,
    getEligibility,
};