const axios = require("axios");

const API_KEY = "key_test_1ada05f8f4024914bbbf6b18ace0e3af";
const API_SECRET = "secret_test_9782ecbbba464f029c2831adfbe61970";
const PAN_NUMBER = "ABCDE1234F";

const entities = [
    null,
    "in.co.sandbox.kyc.pan_verification.request",
    "in.co.sandbox.kyc.pan.request",
    "in.co.sandbox.kyc.pan_details.request",
    "in.co.sandbox.kyc.pan.verify.request"
];
const versions = ["1.0", "1.0.0", "2.0"];

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

        for (const ent of entities) {
            for (const ver of versions) {
                try {
                    const body = { pan: PAN_NUMBER };
                    if (ent) {
                        body["@entity"] = ent;
                    }

                    const res = await axios.post(
                        "https://test-api.sandbox.co.in/kyc/pan/verify",
                        body,
                        {
                            headers: {
                                Authorization: token,
                                "x-api-key": API_KEY,
                                "x-api-version": ver,
                                "Content-Type": "application/json",
                            }
                        }
                    );
                    console.log(`[SUCCESS] ent=${ent}, ver=${ver}`);
                    console.log("Response:", res.data);
                    return; // Exit on first success
                } catch (error) {
                    if (error.response?.status !== 404) {
                        console.log(`[ERROR: ${error.response?.status}] ent=${ent}, ver=${ver}`);
                        console.log(error.response?.data);
                    }
                }
            }
        }
        console.log("No PAN combination matched standard examples.");

    } catch (err) {
        console.error("Auth failed:", err.message);
    }
}

run();
