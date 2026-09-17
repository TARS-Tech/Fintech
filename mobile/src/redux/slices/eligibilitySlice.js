import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    financialProfile: null,

    eligibility: {
        score: null,
        status: null,
        breakdown: {
            cibil: 0,
            salary: 0,
            existingLoans: 0,
        },
        calculatedAt: null,
    },

    loading: false,
    error: null,
    hydrated: false,
};


const eligibilitySlice = createSlice({
    name: "eligibility",
    initialState,

    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setEligibility(state, action) {
            state.financialProfile = action.payload.financialProfile;
            state.eligibility = action.payload.eligibility;
            state.error = null;
        },

        setEligibilityError(state, action) {
            state.error = action.payload;
        },

        setEligibilityHydrated(state, action) {
            state.hydrated = action.payload;
        },

        clearEligibility() {
            return initialState;
        },
    },
});

export const {
    setLoading,
    setEligibility,
    setEligibilityError,
    setEligibilityHydrated,
    clearEligibility
} = eligibilitySlice.actions;

export default eligibilitySlice.reducer;