
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";
import { useAddXP } from "@/utils/xpUtils";
import { useToast } from "@/components/ui/use-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // State to track if sidebar is open (full width) or minimized (icons only)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, user, isPremium, hasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();
  const { awardDailyActionXP } = useAddXP();
  const { toast } = useToast();

  // Toggle between full sidebar and icons-only mode
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Check if user needs to be redirected
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!hasCompletedOnboarding) {
      navigate("/onboarding");
    }
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  // Award XP for daily login
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const lastLoginKey = `lastLogin_${user.email}`;
      const lastLogin = localStorage.getItem(lastLoginKey);
      const today = new Date().toDateString();

      if (!lastLogin || lastLogin !== today) {
        // Award XP for daily login
        awardDailyActionXP('login');

        // Update last login date
        localStorage.setItem(lastLoginKey, today);

        // Show toast notification
        toast({
          title: "Welcome back! +10 XP",
          description: "You've earned XP for logging in today.",
        });
      }
    }
  }, [isAuthenticated, user?.email, awardDailyActionXP, toast]);

  if (!isAuthenticated || !hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex">
        <Sidebar open={sidebarOpen} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} p-4 md:p-6`}>
          {/* Premium upgrade banner for non-premium users - positioned to avoid overlapping */}
          {!isPremium && (
            <div className="fixed top-20 right-6 w-64 p-4 bg-card border border-primary shadow-lg rounded-lg z-50 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Diamond className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <h3 className="font-medium">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground">Get access to all premium features for just $2.99/month</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/premium-checkout")}
                className="bg-grindos-purple hover:bg-grindos-purple/90 w-full"
              >
                Upgrade Now
              </Button>
            </div>
          )}

          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
