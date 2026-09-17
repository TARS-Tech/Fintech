const axios = require("axios");

let accessToken = null;
let expiresAt = null;

exports.getSandboxToken = async () => {
    try {
        if (accessToken && expiresAt > Date.now()) {
            return accessToken;
        }

        // const response = await axios.post(
        //     "https://api.sandbox.co.in/authenticate",
        //     {},
        //     {
        //         headers: {
        //             "x-api-key": process.env.SANDBOX_API_KEY,
        //             "x-api-secret": process.env.SANDBOX_API_SECRET,
        //             "x-api-version": "2.0",
        //         },
        //     }
        // );

        // dev test mode
        const response = await axios.post(
            // "https://test-api.sandbox.co.in/authenticate",
            "https://api.sandbox.co.in/authenticate",
            {},
            {
                headers: {
                    "x-api-key": process.env.SANDBOX_API_KEY,
                    "x-api-secret": process.env.SANDBOX_API_SECRET,
                    "x-api-version": "1.0.0",
                },
            }
        );

        accessToken = response.data.data.access_token;
        // console.log("Sandbox token fetched:", accessToken ? "OK" : "EMPTY");
        console.log("✅ Sandbox token generated");

        expiresAt = Date.now() + 23 * 60 * 60 * 1000;

        return accessToken;

    } catch (err) {
        console.log(
            "❌ Sandbox Authentication Error:",
            err.response?.data || err.message
        );

        accessToken = null;
        expiresAt = null;
        throw new Error("Sandbox Authentication Failed");

    }
};