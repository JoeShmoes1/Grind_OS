
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";
import { XPModal } from "@/components/xp/XPModal";
import {
  Activity,
  Book,
  Calendar,
  Settings,
  Compass,
  FileText,
  Search,
  Archive,
  CheckSquare,
  Bot, // Using Bot icon instead of Robot
  DollarSign,
  RefreshCw,
  Network,
  Shield,
  Swords,
  LayoutDashboard,
  BarChart
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  isActive?: boolean;
}

// AI section
const aiNavItems: NavItem[] = [
  { name: "AI Assistant", icon: Bot, path: "/ai-assistant" },
];

// Dashboard section
const dashboardNavItems: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

// Main rooms
const mainNavItems: NavItem[] = [
  { name: "GM Room", icon: Activity, path: "/gm" },
  { name: "Task Room", icon: CheckSquare, path: "/tasks" },
  { name: "Ritual Room", icon: Calendar, path: "/rituals" },
  { name: "Calendar Room", icon: Calendar, path: "/calendar" },
  { name: "Vision Room", icon: Compass, path: "/vision" },
  { name: "Journal Room", icon: Book, path: "/journal" },
  { name: "Note Room", icon: FileText, path: "/notes" },
  { name: "Cashflow Room", icon: DollarSign, path: "/cashflow" },
  { name: "Reset Room", icon: RefreshCw, path: "/reset" },
  { name: "Mindmap Room", icon: Network, path: "/mindmap" },
  { name: "Vault Room", icon: Shield, path: "/vault" },
];

const secondaryNavItems: NavItem[] = [
  { name: "Arena", icon: Swords, path: "/arena" },
  { name: "Search", icon: Search, path: "/search" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { userXP, getXPForNextLevel, getXPProgress } = useXP();
  const [showXPModal, setShowXPModal] = useState(false);

  // Calculate XP values
  const userLevel = userXP.level;
  const currentXP = userXP.totalXPEarned;
  const maxXp = getXPForNextLevel();
  const xpPercentage = getXPProgress();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "GR";

    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }

    return nameParts[0].substring(0, 2).toUpperCase();
  };

  // Helper function to determine if a route is active
  const isActive = (path: string): boolean => {
    if (path === "/gm" && location.pathname === "/") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <aside
      className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-card z-30 border-r border-border transition-all duration-300 overflow-y-auto ${
        open ? 'w-64' : 'w-16 sidebar-minimized'
      }`}
    >
      <div className="p-4">
        {/* User Profile */}
        <div className="user-profile mb-8 p-4 bg-gradient-to-br from-grindos-purple/20 to-grindos-dark-purple/10 rounded-xl border border-grindos-purple/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-grindos-purple text-white rounded-full flex items-center justify-center font-medium text-lg">
              {getUserInitials()}
            </div>
            <div>
              <p className="font-medium">{user?.name || "Grinder"}</p>
              <p className="text-xs text-muted-foreground">Level {userLevel} Grinder</p>
            </div>
          </div>

          <div
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowXPModal(true)}
          >
            <div className="flex justify-between text-xs mb-1.5">
              <span>XP: {userXP.totalXPEarned}/{maxXp}</span>
              <span>{Math.round(xpPercentage)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-grindos-purple to-grindos-blue animate-pulse-subtle"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* XP Modal */}
          <XPModal isOpen={showXPModal} onClose={() => setShowXPModal(false)} />
        </div>

        {/* AI Assistant Section */}
        <div className="mb-6">
          <h3 className="sidebar-section-title text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">AI</h3>
          <nav>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/ai-assistant"
                  className={`nav-link ${isActive('/ai-assistant') ? 'active' : ''}`}
                >
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Dashboard Section */}
        <div className="mb-6">
          <h3 className="sidebar-section-title text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Analytics</h3>
          <nav>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="sidebar-section-title text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Rooms</h3>
          <nav>
            <ul className="space-y-1.5">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <h3 className="sidebar-section-title text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">System</h3>
          <nav>
            <ul className="space-y-1.5">
              {secondaryNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};
