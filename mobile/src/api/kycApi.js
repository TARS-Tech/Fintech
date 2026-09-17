import api from "../services/api";

export const sendAadhaarOtpApi = async (body, token) => {
    const response = await api.post(
        "/kyc/send-aadhaar-otp",
        body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const verifyAadhaarOtpApi = async (formData, token) => {
    const response = await api.post(
        "/kyc/verify-aadhaar-otp",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const verifyPanApi = async (formData, token) => {
    const response = await api.post(
        "/kyc/verify-pan",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getKycStateApi = async (token) => {
    const response = await api.get("/kyc/status", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};