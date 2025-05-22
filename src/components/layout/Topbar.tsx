
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Moon,
  Sun,
  Menu,
  Bell,
  User,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpinningGearLogo } from "@/components/ui/SpinningGearLogo";

interface TopbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Topbar = ({ toggleSidebar, sidebarOpen }: TopbarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    // The logout function in AuthContext now handles redirection
    logout();
  };

  return (
    <header className="h-[60px] border-b border-border bg-card z-40 sticky top-0 left-0 right-0">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </Button>

          <div className="flex items-center gap-2">
            <SpinningGearLogo size={24} />
            <div className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent">GRIND</span>
              <span className="text-xl font-semibold">OS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-grindos-purple rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <User size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:inline-block">{user?.name || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
                {user?.phoneNumber && (
                  <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
