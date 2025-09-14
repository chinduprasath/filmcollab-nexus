import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Briefcase,
  Users,
  FolderOpen,
  Share2,
  UserCheck,
  Calendar,
  Search,
  MessageCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigationItems = [
  {
    section: "MAIN",
    items: [
      { name: "Dashboard", icon: Home, href: "/dashboard" }
    ]
  },
  {
    section: "OPPORTUNITIES",
    items: [
      { name: "Jobs", icon: Briefcase, href: "/jobs" },
      { name: "Industry Hub", icon: Calendar, href: "/industry-hub" },
      { name: "Projects", icon: FolderOpen, href: "/projects" }
    ]
  },
  {
    section: "CONTENT",
    items: [
      { name: "Posts", icon: Share2, href: "/posts" },
      { name: "Directory", icon: UserCheck, href: "/directory" }
    ]
  },
  {
    section: "NETWORKING",
    items: [
      { name: "Community", icon: Users, href: "/community" },
      { name: "Discover", icon: Search, href: "/discover" },
      { name: "Messages", icon: MessageCircle, href: "/messages" },
      { name: "Connections", icon: Heart, href: "/connections" }
    ]
  }
];

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
  const { signOut, profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-slate-900 border-r border-slate-700", isCollapsed && "w-16", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <div className="h-4 w-4 bg-white rounded-sm opacity-90"></div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white">FilmCollab</span>
          )}
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
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
        <div className="space-y-8">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors",
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
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Theme section */}
      <div className="border-t border-slate-700 p-4">
        <div className="space-y-3">
          {!isCollapsed && (
            <div className="px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Theme</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800",
                theme === "light" && "bg-slate-800 text-white"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800",
                theme === "dark" && "bg-purple-600 text-white hover:bg-purple-600"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800",
                theme === "system" && "bg-slate-800 text-white"
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