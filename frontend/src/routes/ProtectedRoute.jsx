import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/doctors" replace />;
  }

  return children;
};

export default ProtectedRoute;
