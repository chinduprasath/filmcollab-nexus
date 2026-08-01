import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  BarChart3,
  Users,
  FileText,
  FolderOpen,
  Briefcase,
  Image,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  UserCog,
  LogOut,
  TicketCheck,
  UsersRound,
  MapPin,
  Settings
} from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AdminSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const adminNavigationItems = [
  { name: "Overview", icon: BarChart3, href: "/admin-dashboard" },
  { name: "Analytics", icon: BarChart3, href: "/admin-dashboard/analytics" },
  { name: "Users", icon: Users, href: "/admin-dashboard/users" },
  { name: "Projects", icon: FolderOpen, href: "/admin-dashboard/projects" },
  { name: "Jobs", icon: Briefcase, href: "/admin-dashboard/jobs" },
  { name: "Team Members", icon: UserCog, href: "/admin-dashboard/team" },
  { name: "Tickets", icon: TicketCheck, href: "/admin-dashboard/tickets" },
  { name: "Posts", icon: FileText, href: "/admin-dashboard/posts" },
  { name: "Communities", icon: UsersRound, href: "/admin-dashboard/communities" },
  { name: "Directory", icon: Image, href: "/admin-dashboard/directory" },
  { name: "Locations", icon: MapPin, href: "/admin-dashboard/locations" },
  { name: "Settings", icon: Settings, href: "/admin-dashboard/settings" }
];

export function AdminSidebar({ className, isCollapsed = false, onToggle }: AdminSidebarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn(
        "flex h-full flex-col bg-white border-r border-gray-200 relative",
        isCollapsed ? "w-16" : "w-64",
        "transition-all duration-300",
        className
      )}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4 relative">
        <div className="flex items-center gap-2 pr-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Admin Portal
            </span>
          )}
        </div>
        {onToggle && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={cn(
                "h-8 w-8 rounded-full bg-gray-100 border border-gray-200 shadow-sm p-0",
                "hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-600",
                "transition-all duration-200 text-gray-500"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {adminNavigationItems.filter(item => {
            if (item.name === "Overview") return true;
            return hasPermission(item.name);
          }).map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start h-10 px-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors",
                isActive(item.href) && "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Theme Settings */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Theme
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50",
                theme === "light" && "bg-yellow-50 text-yellow-600"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50",
                theme === "dark" && "bg-yellow-50 text-yellow-600"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50",
                theme === "system" && "bg-yellow-50 text-yellow-600"
              )}
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}