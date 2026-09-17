import api from "./api";

export const getCustomers = async (search = "") => {
    const response = await api.get("/admin/customers", {
        params: search ? { search } : {},
    });

    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await api.get(`/admin/customers/${id}`);

    return response.data;
};