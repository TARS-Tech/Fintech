import { useSelector } from "react-redux";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

export default function AppRouter() {
    const { isAuthenticated, loading } = useSelector((state) => state.auth)

    if (loading) {
        return null;
    }

    return isAuthenticated
        ? <AppNavigator />
        : <AuthNavigator />;
}