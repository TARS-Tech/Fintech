import { login } from "../slices/authSlice";
import { setUser } from "../slices/userSlice";

import { saveTokens } from "../../services/auth";
import { sendOtpApi, verifyOtpApi } from "../../api/authApi";
import { getKycState } from "./kycActions";

export const sendOtp = async (body) => {
    const response = await sendOtpApi(body);
    console.log("response from sendotp:", response)
    return response;
}

export const verifyOtp = (body) => async (dispatch) => {
    try {
        // console.log("1");
        const response = await verifyOtpApi(body);
        // console.log("2");
        const data = response.data;

        // console.log("res verifyOtp data:", data)
        // console.log("3", data);

        await saveTokens(data.accessToken, data.refreshToken);
        // console.log("4");

        dispatch(login({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        }));

        // console.log("5");
        dispatch(setUser({
            profile: data.user
        }));

        await dispatch(getKycState());

        // console.log("6");

        return { success: true };
    } catch (error) {
        console.log("VERIFY OTP ERROR");
        console.log(error);
        console.log(error.message);

        return {
            success: false,
            message: error.message,
        };
    }
}