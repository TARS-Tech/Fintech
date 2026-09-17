const axios = require("axios");

const API_KEY = "key_test_1ada05f8f4024914bbbf6b18ace0e3af";
const API_SECRET = "secret_test_9782ecbbba464f029c2831adfbe61970";
const PAN_NUMBER = "ABCDE1234F"; // Mock PAN

async function run() {
    try {
        console.log("1. Authenticating...");
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
        console.log("Token obtained:", token ? "Success" : "Failed");

        console.log("\n--- Testing PAN Verify WITHOUT Bearer prefix ---");
        try {
            const resPan = await axios.post(
                "https://test-api.sandbox.co.in/kyc/pan/verify",
                {
                    pan: PAN_NUMBER,
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
            console.log("PAN Success:", resPan.data);
        } catch (error) {
            console.log("PAN Failed:", error.response?.status, error.response?.data);
        }

    } catch (err) {
        console.error("Auth failed:", err.response?.status, err.response?.data || err.message);
    }
}

run();
