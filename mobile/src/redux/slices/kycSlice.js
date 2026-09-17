import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    aadhaar: {
        number: "",
        frontImage: "",
        backImage: "",

        referenceId: "",

        otpSent: false,
        verified: false,
    },

    pan: {
        number: "",
        image: "",
        verified: false,
    },

    kycCompleted: false,
    hydrated: false,
    loading: false,
};

const kycSlice = createSlice({
    name: "kyc",
    initialState,
    reducers: {

        setLoading(state, action) {
            state.loading = action.payload;
        },

        aadhaarOtpSent(state, action) {
            state.aadhaar.number = action.payload.number;
            state.aadhaar.frontImage = action.payload.frontImage;
            state.aadhaar.backImage = action.payload.backImage;

            state.aadhaar.referenceId = action.payload.referenceId;
            state.aadhaar.otpSent = true;
        },

        aadhaarVerified(state) {

            state.aadhaar.verified = true;
            state.aadhaar.otpSent = false;
        },

        setPan(state, action) {

            state.pan.verified = true;
            state.pan.number = action.payload.number;
            state.pan.image = action.payload.image;

        },

        setKycHydrated(state, action) {
            state.hydrated = action.payload;
        },

        setKycCompleted(state) {
            state.kycCompleted = true;
        },

        setkycState(state, action) {
            const { aadhaarVerified, panVerified, status } = action.payload;
            state.aadhaar.verified = !!aadhaarVerified;
            state.pan.verified = !!panVerified;
            state.kycCompleted = status === "approved";
        },

        clearKyc() {
            return initialState;
        }
    }
});

export const { aadhaarOtpSent, aadhaarVerified, setPan, setKycCompleted, setKycHydrated, setLoading, clearKyc, setkycState } = kycSlice.actions;

export default kycSlice.reducer;