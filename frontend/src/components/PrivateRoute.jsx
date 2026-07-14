import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const rolePath = {
  student: "/student/my-orders",
  guard: "/guard/pending-deliveries",
  admin: "/admin/overview",
};

const FullPageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        Loading your dashboard...
      </div>
    </div>
  );
};

export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={rolePath[user?.role] || "/login"} replace />;
  }

  return <Outlet />;
}
