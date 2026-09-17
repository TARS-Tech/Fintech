import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setLoading } from "../../redux/slices/authSlice";
import { setUser, setUserHydrated } from "../../redux/slices/userSlice";
import { getAccessToken, getRefreshToken, removeTokens } from "../../services/auth";
import { getProfile } from "../../redux/actions/profileActions";
import { getKycState } from "../../redux/actions/kycActions";

export default function StartupScreen() {
    const dispatch = useDispatch();


    useEffect(() => {
        init()
    }, [])


    const init = async () => {
        try {
            const accessToken = await getAccessToken();
            const refreshToken = await getRefreshToken();

            if (!accessToken || !refreshToken) {
                dispatch(setUserHydrated(true));
                dispatch(setLoading(false));
                return;
            }

            dispatch(login({
                accessToken, refreshToken
            }))

            // console.log("access token:", accessToken)

            const res = await dispatch(getProfile());

            if (!res?.success) {

                await removeTokens();

                dispatch(logout());

                dispatch(setUserHydrated(true));
                dispatch(setLoading(false));

                return;
            }

            dispatch(setUser(res.data));
            await dispatch(getKycState());
            dispatch(setUserHydrated(true));

            dispatch(setLoading(false))
        } catch (error) {

            console.log(
                "Startup hydration error:",
                error
            );

            dispatch(setUserHydrated(true));
            dispatch(setLoading(false));
        } finally {
            dispatch(setUserHydrated(true));
        }
    }
    return null;
}