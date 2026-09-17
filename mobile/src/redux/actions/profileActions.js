import { updateProfileApi, getProfileApi } from "../../api/profileApi";
import { setUser } from "../slices/userSlice";

export const getProfile = () => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        const response = await getProfileApi(token);

        // console.log("🔥 PROFILE FROM BACKEND:", response.data);
        // console.log("🔥 PROFILE COMPLETED:", response.data?.profileCompleted);
        dispatch(
            setUser({
                profile: response.data,
            })
        );

        return { success: true }
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

export const updateProfile = (formData) => async (dispatch, getState) => {
    try {
        const token = getState().auth.accessToken;
        const response = await updateProfileApi(formData, token);
        dispatch(
            setUser({
                profile: response.data,
            })
        );

        return {
            success: true,
            message: response.message,
        };

    } catch (err) {
        console.log("error in update profile:", err)
        return {
            success: false,
            message: err.message,
        };
    }
};