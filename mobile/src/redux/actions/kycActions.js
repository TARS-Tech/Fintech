import { getKycStateApi, sendAadhaarOtpApi, verifyAadhaarOtpApi, verifyPanApi } from "../../api/kycApi";
import { aadhaarOtpSent, aadhaarVerified, setPan, setKycCompleted, setkycState } from "../slices/kycSlice";

export const sendAadhaarOtp = (body) => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        const response = await sendAadhaarOtpApi(
            {
                aadhaarNumber: body.aadhaarNumber.replace(/\s/g, ""),
            }, token
        );

        if (!response.success) {
            return { success: false, message: response.message };
        }

        dispatch(aadhaarOtpSent({
            number: body.aadhaarNumber.replace(/\s/g, ""),
            frontImage: body.frontImage,
            backImage: body.backImage,
            referenceId: response.data.referenceId,
        }))
        // console.log("response in send aadhaar otp : ", response.data)

        return {
            success: true,
            message: response.message,
            otp: response.data?.otp,
        }
    } catch (error) {
        console.log("error in send aadhaar otp:", error.response?.data?.message || error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
        }
    }
}

export const verifyAadhaarOtp = (otp) => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        const aadhaar = getState().kyc.aadhaar;
        const formData = new FormData();
        formData.append("referenceId", aadhaar.referenceId);
        formData.append("aadhaarNumber", aadhaar.number.replace(/\s/g, ""));
        formData.append("otp", otp);
        formData.append(
            "aadhaarFront",
            {
                uri: aadhaar.frontImage.uri,
                name: "front.jpg",
                type: "image/jpeg",
            }
        );

        formData.append(
            "aadhaarBack",
            {
                uri: aadhaar.backImage.uri,
                name: "back.jpg",
                type: "image/jpeg",
            }
        );

        const response = await verifyAadhaarOtpApi(formData, token);
        if (!response.success) {
            return { success: false, message: response.message };
        }
        console.log("response in verify aadhaar : ", response.data)
        dispatch(aadhaarVerified());

        return {
            success: true,
            message: response.message,
        }
    } catch (err) {
        console.log("error in verify aadhaar:", err.response?.data?.message || err.message);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
        }
    }
}

export const verifyPan = (body) => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        const formData = new FormData();
        formData.append("panNumber", body.panNumber);
        formData.append("panImage", {
            uri: body.panImage.uri,
            name: "pan.jpg",
            type: "image/jpeg",
        });

        const response = await verifyPanApi(formData, token);
        if (!response.success) {
            return { success: false, message: response.message };
        }
        console.log("response in verify pan : ", response.data)
        dispatch(setPan({
            number: body.panNumber,
            image: body.panImage.uri,
        }));
        if (response.data.kycCompleted) {
            dispatch(setKycCompleted());
        }

        return {
            success: true,
            message: response.message,
        }
    } catch (err) {
        console.log("error in verify pan:", err.response?.data?.message || err.message);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
        }
    }
}

export const getKycState = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        if (!token) return { success: false, message: "No access token" }

        const response = await getKycStateApi(token);

        if (response.success && response.data) {
            dispatch(setkycState({
                aadhaarVerified: response.data.aadhaarVerified,
                panVerified: response.data.panVerified,
                status: response.data.status,
            }));
            return {
                success: true,
            }
        }

        return { success: false, message: response.message };
    } catch (err) {
        console.log("Error in fetching KYC status:", err.response?.data?.message || err.message);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
        };
    }
};