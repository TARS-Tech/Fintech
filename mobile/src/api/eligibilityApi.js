import api from "../services/api";

export const getEligibilityApi = async (token) => {
    const response = await api.get("/eligibility", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const calculateEligibilityApi = async (body, token) => {
    const response = await api.post("/eligibility/calculate", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}