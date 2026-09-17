const User = require("../../models/user.model");
const KYC = require("../../models/kyc.model");
const FinancialProfile = require("../../models/financialProfile.model");
const Eligibility = require("../../models/eligibility.model");
const { success, error } = require("../../utils/response");

exports.getCustomers = async (req, res) => {
    try {
        const { search } = req.query;

        const query = {
            role: "customer",
        };

        if (search) {
            const conditions = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]

            if (!isNaN(search)) {
                conditions.push({
                    phone: Number(search),
                });
            }
            query.$or = conditions;
        }

        const customers = await User.find(query)
            .select("_id name email phone countryCode profileCompleted kycCompleted createdAt")
            .sort({ createdAt: -1 });

        return success(res, "Customers fetched successfully", customers);
    } catch (err) {
        console.log("Get customers error", err);
        return error(res, 500, "Internal Server Error");
    }
}

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await User.findOne({
            _id: id,
            role: "customer",
        }).select(
            "_id name email phone countryCode dob gender address city state pincode profileImage profileCompleted kycCompleted createdAt"
        );

        if (!customer) {
            return error(res, 404, "Customer not found");
        }

        const [kyc, financialProfile, eligibility] = await Promise.all([
            KYC.findOne({ userId: customer._id }).select(
                "aadhaar.masked pan.masked aadhaarVerified panVerified status kycCompleted verifiedAt"
            ),

            FinancialProfile.findOne({
                userId: customer._id,
            }).select(
                "monthlySalary employmentType company existingLoans existingEmi cibilScore cibilSource cibilVerified"
            ),

            Eligibility.findOne({
                user: customer._id,
            }).select(
                "score status breakdown calculatedAt"
            ),
        ]);

        return success(res, "Customer details fetched successfully", {
            customer,
            kyc: kyc || null,
            financialProfile: financialProfile || null,
            eligibility: eligibility || null,
        });
    } catch (err) {
        console.log("Get customer details error:", err);

        return error(res, 500, "Internal Server Error");
    }
}