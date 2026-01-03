import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("Jwt_token");
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.warning("Please login to continue", {
        toastId: "auth-warning",
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
