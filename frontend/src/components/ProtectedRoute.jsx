import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    if (allowedRoles && allowedRoles.includes("doctor")) {
      return <Navigate to="/doctor/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === "doctor" ? "/doctor/profile" : "/profile"} replace />;
  }

  return children;
}

export default ProtectedRoute;
