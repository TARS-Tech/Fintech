import api from "./api";

// Fetch active loan products
export const getActiveLoansService = async (category) => {
  const response = await api.get("/loans", {
    params: category ? { category } : {},
  });
  return response.data;
};

// Fetch active loan product by slug
export const getLoanBySlugService = async (slug) => {
  const response = await api.get(`/loans/${slug}`);
  return response.data;
};

// Fetch active loan offers (by loanId, loanSlug, or featured)
export const getActiveOffersService = async (params = {}) => {
  const response = await api.get("/offers", {
    params,
  });
  return response.data;
};

// Fetch single offer by ID
export const getOfferByIdService = async (id) => {
  const response = await api.get(`/offers/${id}`);
  return response.data;
};
