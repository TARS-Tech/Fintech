const KYC = require("../models/kyc.model");
const User = require("../models/user.model");
const { verifyAadhaarOtp, sendAadhaarOtp } = require("../services/aadhaar.service");
const { verifyPan } = require("../services/pan.service");
const { generateMockOtp, verifyMockOtp } = require("../utils/mockKyc");
const { error, success } = require("../utils/response");
const { aadhaarSchema, aadhaarOtpVerifySchema, panSchema } = require("../validations/kyc.validation");
const { encrypt } = require("../services/encryption.service");
const { maskPan, maskAadhaar } = require("../utils/maskSensitiveData");


const USE_MOCK = process.env.USE_MOCK_KYC === "true";

exports.sendAadhaarOtp = async (req, res) => {
    try {
        const validation = aadhaarSchema.safeParse(req.body);

        if (!validation.success) {
            return error(res, 400, validation.error.issues[0].message);
        }

        const { aadhaarNumber } = validation.data;


        let response;
        if (USE_MOCK) {
            const mock = generateMockOtp(aadhaarNumber);
            response = {
                success: true,
                referenceId: mock.referenceId,
                otp: mock.otp,
            };
        } else {
            response = await sendAadhaarOtp(aadhaarNumber);
        }


        console.log("send verify otp aadhaar:", response)

        if (!response.success) {
            return error(res, 400, response.message);
        }

        return success(res, "OTP Sent", {
            referenceId: response.referenceId,
            otp: response.otp,
        });

    } catch (err) {
        console.log(err.message)

        return error(res, 500, "Internal Server Error");
    }
}

exports.verifyAadhaarOtp = async (req, res) => {
    try {
        const validation = await aadhaarOtpVerifySchema.safeParse(req.body);

        if (!validation.success) {
            return error(res, 400, validation.error.issues[0].message);
        }

        const { referenceId, otp, aadhaarNumber } = validation.data;

        const aadhaarFront = req.files?.aadhaarFront?.[0]?.path || "";
        const aadhaarBack = req.files?.aadhaarBack?.[0]?.path || "";

        let verify;

        if (USE_MOCK) {
            verify = verifyMockOtp(referenceId, otp);
        } else {
            verify = await verifyAadhaarOtp(referenceId, otp);
        }

        if (!verify.success) {
            return error(res, 400, verify.message);
        }


        const encryptedAadhaar = encrypt(aadhaarNumber);
        let kyc = await KYC.findOne({ userId: req.user.id });

        if (!kyc) {
            kyc = await KYC.create({
                userId: req.user.id,
                aadhaar: {
                    encrypted: encryptedAadhaar.encrypted,
                    iv: encryptedAadhaar.iv,
                    authTag: encryptedAadhaar.authTag,
                    masked: maskAadhaar(aadhaarNumber),
                },

                aadhaarFront,
                aadhaarBack,
                aadhaarVerified: true,
            });
        } else {

            kyc.aadhaar = {
                encrypted: encryptedAadhaar.encrypted,
                iv: encryptedAadhaar.iv,
                authTag: encryptedAadhaar.authTag,
                masked: maskAadhaar(aadhaarNumber),
            };
            kyc.aadhaarFront = aadhaarFront;
            kyc.aadhaarBack = aadhaarBack;
            kyc.aadhaarVerified = true;

            await kyc.save();
        }

        return success(res, "Aadhaar verified successfully", {
            aadhaarVerified: true,
        });

    } catch (err) {
        console.log(err);
        return error(res, 500, "Internal Server Error");
    }
}

exports.verifyPan = async (req, res) => {
    try {
        const validation = await panSchema.safeParse(req.body);

        if (!validation.success) {
            return error(res, 400, validation.error.issues[0].message);
        }

        const { panNumber } = validation.data;

        const panImage = req.file?.path || "";

        const user = await User.findById(req.user.id);
        const nameAsPerPan = user.name;
        const dob = new Date(user.dob);

        // const dateOfBirth = "11/11/2001"
        // const nameAsPerPan = "John Ronald Doe"
        // const panNumber = "XXXPX1234A"

        const dateOfBirth =
            String(dob.getDate()).padStart(2, "0") +
            "/" +
            String(dob.getMonth() + 1).padStart(2, "0") +
            "/" +
            dob.getFullYear();

        let verify;

        if (USE_MOCK) {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

            verify = {
                success: panRegex.test(panNumber.toUpperCase())
            };
        } else {
            verify = await verifyPan(panNumber, nameAsPerPan, dateOfBirth);
        }

        if (!verify.success || !verify.verified) {
            return error(res, 400, verify.message || "PAN verification failed");
        }

        const encryptedPan = encrypt(panNumber);

        const kyc = await KYC.findOne({ userId: req.user.id });

        if (!kyc) {
            return error(res, 400, "Please verify Pan first");
        }

        kyc.pan = {
            encrypted: encryptedPan.encrypted,
            iv: encryptedPan.iv,
            authTag: encryptedPan.authTag,
            masked: maskPan(panNumber),
        };

        kyc.panImage = panImage;
        kyc.panVerified = true;

        if (kyc.aadhaarVerified && kyc.panVerified) {

            kyc.status = "approved";
            kyc.kycCompleted = true;
            kyc.verifiedAt = new Date();

            await User.findByIdAndUpdate(req.user.id, {
                kycCompleted: true,
            });

        }

        await kyc.save();

        return success(res, "PAN verified successfully", {
            panVerified: true,
            kycCompleted: kyc.status === "approved"
        });

    } catch (err) {

        console.log(err);

        return error(res, 500, "Internal Server Error");

    }

};


exports.getKycStatusController = async (req, res) => {

    try {

        const kyc = await KYC.findOne({
            userId: req.user.id
        });

        if (!kyc) {

            return success(res, "KYC not started", {
                aadhaarVerified: false,
                panVerified: false,
                status: "pending"
            });

        }

        // console.log("kyc statius:",
        //     {
        //         aadhaar: kyc.aadhaar?.masked || "",
        //         pan: kyc.pan?.masked || "",

        //         aadhaarVerified: kyc.aadhaarVerified,
        //         panVerified: kyc.panVerified,

        //         status: kyc.status,
        //         kycCompleted: kyc.kycCompleted,
        //     }
        // )

        return success(res, "KYC Status", {
            aadhaar: kyc.aadhaar?.masked || "",
            pan: kyc.pan?.masked || "",

            aadhaarVerified: kyc.aadhaarVerified,
            panVerified: kyc.panVerified,

            status: kyc.status,
            kycCompleted: kyc.kycCompleted,
        });

    } catch (err) {

        console.log(err);

        return error(res, 500, "Internal Server Error");

    }

};