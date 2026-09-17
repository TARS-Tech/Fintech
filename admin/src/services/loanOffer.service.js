import api from "./api";

export const getLoanOffers = async () => {
    const response = await api.get("/admin/offers");
    return response.data;
};

export const createLoanOffer = async (data) => {
    const response = await api.post("/admin/offers", data);
    return response.data;
};

export const updateLoanOffer = async (id, data) => {
    const response = await api.put(`/admin/offers/${id}`, data);
    return response.data;
};

export const updateLoanOfferStatus = async (id, status) => {
    const response = await api.patch(
        `/admin/offers/${id}/status`,
        { status }
    );

    return response.data;

};
