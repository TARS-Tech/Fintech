const axios = require("axios");

const API_KEY = "key_test_1ada05f8f4024914bbbf6b18ace0e3af";
const API_SECRET = "secret_test_9782ecbbba464f029c2831adfbe61970";

const aadhaars = ["123412341234", "999941057058", "999999999999"];
const versions = ["1.0", "1.0.0", "2.0"];
const consents = ["Y", "y"];
const reasons = ["KYC verification", "Test"];

async function run() {
    try {
        console.log("Authenticating...");
        const authResponse = await axios.post(
            "https://test-api.sandbox.co.in/authenticate",
            {},
            {
                headers: {
                    "x-api-key": API_KEY,
                    "x-api-secret": API_SECRET,
                    "x-api-version": "2.0",
                },
            }
        );
        const token = authResponse.data.access_token;
        console.log("Auth success.");

        // Loop through combinations to find the matching mock example
        for (const num of aadhaars) {
            for (const ver of versions) {
                for (const consent of consents) {
                    for (const reason of reasons) {
                        try {
                            const res = await axios.post(
                                "https://test-api.sandbox.co.in/kyc/aadhaar/okyc/otp",
                                {
                                    "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
                                    aadhaar_number: num,
                                    consent: consent,
                                    reason: reason,
                                },
                                {
                                    headers: {
                                        Authorization: token,
                                        "x-api-key": API_KEY,
                                        "x-api-version": ver,
                                        "Content-Type": "application/json",
                                    }
                                }
                            );
                            console.log(`[SUCCESS] num=${num}, ver=${ver}, consent=${consent}, reason=${reason}`);
                            console.log("Response:", res.data);
                            return; // Stop on first success
                        } catch (error) {
                            // If it's a 404 mismatch, we continue.
                            // If it's a validation error or something else, print it.
                            if (error.response?.status !== 404) {
                                console.log(`[OTHER ERROR: ${error.response?.status}] num=${num}, ver=${ver}, consent=${consent}, reason=${reason}`);
                                console.log(error.response?.data);
                            }
                        }
                    }
                }
            }
        }
        console.log("No combination matched standard examples.");

    } catch (err) {
        console.error("Auth failed:", err.message);
    }
}

run();
