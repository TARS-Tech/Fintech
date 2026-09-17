import api from "./api";

export const getPartners = async (params = {}) => {
    const response = await api.get("/admin/partners", {
        params,
    });

    return response.data;
};

export const createPartner = async (data) => {
    const response = await api.post("/admin/partners", data);

    return response.data;
};

export const updatePartner = async (id, data) => {
    const response = await api.put(`/admin/partners/${id}`, data);

    return response.data;
};

export const updatePartnerStatus = async (id, status) => {
    const response = await api.patch(
        `/admin/partners/${id}/status`,
        { status }
    );

    return response.data;
};

export const deletePartner = async (id) => {
    const response = await api.delete(`/admin/partners/${id}`);

    return response.data;
};