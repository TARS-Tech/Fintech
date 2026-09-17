const axios = require("axios");
const { getSandboxToken } = require("./sandbox.service");

exports.verifyPan = async (panNumber, nameAsPerPan, dateOfBirth) => {
    try {
        const token = await getSandboxToken();
        console.log("panNumber", panNumber, "dateOfBirth", dateOfBirth, "nameAsPerPan", nameAsPerPan)

        // console.log("token in sandbox:", token)

        const response = await axios.post(
            // "https://api.sandbox.co.in/kyc/pan/verify",
            // "https://test-api.sandbox.co.in/kyc/pan/verify",
            "https://api.sandbox.co.in/kyc/pan/verify",
            {
                "@entity": "in.co.sandbox.kyc.pan_verification.request",
                pan: panNumber,
                name_as_per_pan: nameAsPerPan,
                date_of_birth: dateOfBirth,
                consent: "Y",
                reason: "For onboarding customers",
            },
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    Authorization: token,
                    "x-api-key": process.env.SANDBOX_API_KEY,
                    "x-api-version": "1.0",
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ PAN response:", response.data);

        return {
            success: true,
            verified: response.data.data.status === "valid",
            data: response.data.data,
        };

    } catch (err) {
        // console.log(err)
        console.log("PAN Verification Error", err.response?.data?.message);
        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        console.log("Headers:", err.response?.headers);
        return {
            success: false,
            verified: false,
            message: err.response?.data?.message || "PAN Verification Failed",
        };
    }
}