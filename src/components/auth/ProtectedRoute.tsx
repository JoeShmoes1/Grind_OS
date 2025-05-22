
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const location = useLocation();

  // Redirect to the static index.html page if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to index page");
    window.location.href = "/";
    return null;
  }

  if (!hasCompletedOnboarding && location.pathname !== "/premium-checkout") {
    console.log("Not onboarded, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
