import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
    const token = localStorage.getItem("adminAccessToken");
    const user = JSON.parse(localStorage.getItem("adminUser") || "null");

    if (!token || !user || user.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;