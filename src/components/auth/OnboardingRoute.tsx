import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingRouteProps {
  children: ReactNode;
}

const OnboardingRoute = ({ children }: OnboardingRouteProps) => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  // If not authenticated, redirect to index page
  if (!isAuthenticated) {
    console.log("Not authenticated in onboarding, redirecting to index page");
    window.location.href = "/";
    return null;
  }

  // If already completed onboarding, redirect to dashboard
  if (hasCompletedOnboarding) {
    console.log("Already onboarded, redirecting to dashboard");
    return <Navigate to="/" replace />;
  }

  // Otherwise show onboarding
  return <>{children}</>;
};

export default OnboardingRoute;
