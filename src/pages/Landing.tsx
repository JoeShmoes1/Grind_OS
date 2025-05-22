import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SpinningGearLogo } from "@/components/ui/SpinningGearLogo";
import { ExternalLink } from "lucide-react";

const Landing = () => {
  const { login, isAuthenticated, hasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (!hasCompletedOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  const handleGoToLogin = () => {
    navigate("/auth");
  };

  const handleGoToSignUp = () => {
    navigate("/auth?signup=true");
  };

  const handleViewLandingPage = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <SpinningGearLogo size={96} className="text-grindos-purple" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent mb-4">
          GRIND OS
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          The personal operating system for peak performance
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleGoToLogin}
            className="w-full bg-grindos-purple hover:bg-grindos-purple/90 text-white py-6 text-lg"
          >
            Sign In to GRIND OS
          </Button>

          <Button
            onClick={handleGoToSignUp}
            variant="outline"
            className="w-full py-6 text-lg"
          >
            Sign Up Free
          </Button>

          <Button
            onClick={handleViewLandingPage}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Landing Page
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            Sign in or sign up to access your personal productivity system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
