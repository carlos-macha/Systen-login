import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../../fireBase/FireBase";

const ProtectedRoute = () => {
    const user = !!auth.currentUser; // Verifica se existe um usuário autenticado
    return user ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;