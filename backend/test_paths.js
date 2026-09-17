const axios = require("axios");

const API_KEY = "key_test_1ada05f8f4024914bbbf6b18ace0e3af";
const API_SECRET = "secret_test_9782ecbbba464f029c2831adfbe61970";
const PAN_NUMBER = "ABCDE1234F";

const paths = [
    "/kyc/pan/verify",
    "/api/kyc/pan/verify",
    "/api/v1/kyc/pan/verify",
    "/api/v2/kyc/pan/verify",
];

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

        for (const p of paths) {
            try {
                const res = await axios.post(
                    `https://test-api.sandbox.co.in${p}`,
                    {
                        pan: PAN_NUMBER
                    },
                    {
                        headers: {
                            Authorization: token,
                            "x-api-key": API_KEY,
                            "x-api-version": "2.0",
                            "Content-Type": "application/json",
                        }
                    }
                );
                console.log(`[SUCCESS] Path: ${p}`, res.data);
            } catch (error) {
                console.log(`[ERROR: ${error.response?.status}] Path: ${p}`, error.response?.data?.message || error.message);
            }
        }

    } catch (err) {
        console.error("Auth failed:", err.message);
    }
}

run();
