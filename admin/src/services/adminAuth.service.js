import api from "./api";

export const adminLogin = async (email, password) => {
    const response = await api.post("/admin/auth/login", { email, password });
    return response.data;
};