import api from "../services/api";

export const sendOtpApi = async (body) => {
    const response = await api.post("/auth/send-otp", body)
    console.log("response from sendotp api:", response.data);
    return response.data;
}

export const verifyOtpApi = async (body) => {
    const response = await api.post("/auth/verify-otp", body)
    console.log("response from verify otp api:", response.data);
    return response.data;
}