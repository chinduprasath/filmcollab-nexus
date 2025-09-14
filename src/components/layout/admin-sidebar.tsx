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
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const adminNavigationItems = [
  { name: "Overview", icon: BarChart3, href: "/admin-dashboard" },
  { name: "Analytics", icon: BarChart3, href: "/admin-dashboard/analytics" },
  { name: "Users", icon: Users, href: "/admin-dashboard/users" },
  { name: "Posts", icon: FileText, href: "/admin-dashboard/posts" },
  { name: "Projects", icon: FolderOpen, href: "/admin-dashboard/projects" },
  { name: "Jobs", icon: Briefcase, href: "/admin-dashboard/jobs" },
  { name: "Directory", icon: Image, href: "/admin-dashboard/directory" },
  { name: "Profile", icon: User, href: "/admin-dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/admin-dashboard/settings" }
];

export function AdminSidebar({ className, isCollapsed = false, onToggle }: AdminSidebarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-white border-r border-gray-200", isCollapsed && "w-16", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Portal
            </span>
          )}
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {adminNavigationItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start h-10 px-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors",
                isActive(item.href) && "bg-purple-600 text-white hover:bg-purple-600",
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
                "h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                theme === "light" && "bg-gray-100 text-gray-700"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                theme === "dark" && "bg-gray-100 text-gray-700"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                theme === "system" && "bg-gray-100 text-gray-700"
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