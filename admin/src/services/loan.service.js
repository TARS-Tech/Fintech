import api from "./api";

export const getLoans = async () => {
    const response = await api.get("/admin/loans");

    return response.data;
}

export const createLoan = async (data) => {
    const response = await api.post("/admin/loans", data);
    return response.data;
}

export const updateLoan = async (id, data) => {
    const response = await api.put(`/admin/loans/${id}`, data);
    return response.data;
}

export const updateLoanStatus = async (id, status) => {
    const response = await api.patch(
        `/admin/loans/${id}/status`,
        { status }
    );
    return response.data;
}
