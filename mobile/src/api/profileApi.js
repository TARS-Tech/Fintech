import api from "../services/api";

export const getProfileApi = async (token) => {
    const response = await api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    // console.log("res of get profile api:", response.data);

    return response.data;
}

export const updateProfileApi = async (formData, token) => {
    const response = await api.put("/profile", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}