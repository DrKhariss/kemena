import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function RequireAuth({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center text-army-light">Loading…</p>;
  }

  if (!user) {
    return <Navigate to="/mixing/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/mixing/account" replace />;
  }

  return children;
}
