import { calculateEligibilityApi, getEligibilityApi } from "../../api/eligibilityApi";
import { setEligibility, setEligibilityError, setLoading } from "../slices/eligibilitySlice";


export const calculateEligibility = (body) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(setEligibilityError(null));

        const token = getState().auth.accessToken;

        if (!token) {
            return {
                success: false,
                message: "No access token",
            };
        }

        const response = await calculateEligibilityApi(body, token);

        if (!response.success) {
            dispatch(setEligibilityError(response.message));
            return {
                success: false,
                message: response.message,
            };
        }

        dispatch(setEligibility(response.data));

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to calculate eligibility";


        dispatch(
            setEligibilityError(message)
        );

        return {
            success: false,
            message,
        };

    } finally {
        dispatch(setLoading(false));
    }
};

export const getEligibility = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(setEligibilityError(null));

        const token = getState().auth.accessToken;

        if (!token) {
            return {
                success: false,
                message: "No access token",
            };
        }

        const response = await getEligibilityApi(token);

        if (!response.success) {
            dispatch(setEligibilityError(response.message));
            return {
                success: false,
                message: response.message,
            };
        }

        dispatch(setEligibility(response.data));

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to get eligibility";


        dispatch(
            setEligibilityError(message)
        );

        return {
            success: false,
            message,
        };

    } finally {
        dispatch(setLoading(false));
    }
};
