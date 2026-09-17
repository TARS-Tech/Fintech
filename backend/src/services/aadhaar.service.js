const axios = require("axios");
const { getSandboxToken } = require("./sandbox.service");


// exports.verifyAadhaar = async (aadhaarNumber) => {
//     try {
//         const token = await getSandboxToken();
//         console.log(token);

//         const response = await axios.post(
//             "https://api.sandbox.co.in/kyc/aadhaar/verify",
//             {
//                 aadhaar_number: aadhaarNumber,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "x-api-key": process.env.SANDBOX_API_KEY,
//                     "x-api-version": "1.0.0",
//                     "Content-Type": "application/json",
//                 }
//             }
//         );



//         console.log("Aadhaar Verification Response", response.data);

//         return {
//             success: true,
//             verified: response.data.data.status === "VALID",
//             data: response.data.data,
//         };

//     } catch (error) {
//         console.log("Aadhaar Verification Error", error.response?.data?.message);
//         console.log(error.response?.status);
//         console.log(error.response?.data);

//         return {
//             success: false,
//             verified: false,
//             message: error.response?.data?.message || "Aadhaar Verification Failed",
//         };
//     }
// }

exports.sendAadhaarOtp = async (aadhaarNumber) => {
    try {
        const token = await getSandboxToken();
        console.log("token:", token)

        const response = await axios.post(
            // "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp",
            // "https://test-api.sandbox.co.in/kyc/aadhaar/okyc/otp",
            "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp",
            {
                "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
                aadhaar_number: aadhaarNumber,
                consent: "y",
                reason: "For KYC",
            },
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    Authorization: token,
                    "x-api-key": process.env.SANDBOX_API_KEY,
                    "x-api-version": "1.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(
            "✅ Aadhaar OTP response:",
            response.data
        );

        return {
            success: true,
            referenceId: response.data.data.reference_id,
        };
    } catch (err) {
        console.log(err.response?.data);
        console.log(
            "❌ Aadhaar OTP Error:",
            err.response?.data || err.message
        );

        return {
            success: false,
            message: err.response?.data?.message || "Failed to send Aadhaar OTP",
        };
    }
};


exports.verifyAadhaarOtp = async (referenceId, otp) => {
    try {
        const token = await getSandboxToken();

        const response = await axios.post(
            "https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify",
            // "https://test-api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify",
            {
                "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
                reference_id: referenceId,
                otp,
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

        // console.log(
        //     "✅ Aadhaar verification response:",
        //     response.data
        // );
        return {
            success: true,
            data: response.data.data,
        };

    } catch (err) {

        console.log(err.response?.data);
        console.log(
            "❌ Aadhaar verification error:",
            err.response?.data || err.message
        );

        return {
            success: false,
            message: err.response?.data?.message || "OTP Verification Failed",
        };
    }
};