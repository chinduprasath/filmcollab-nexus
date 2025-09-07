import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Briefcase,
  Users,
  FolderOpen,
  FileText,
  BookOpen,
  Globe,
  Search,
  MessageCircle,
  UserPlus,
  ChevronRight,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

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
      { name: "Industry Hub", icon: Globe, href: "/industry-hub" },
      { name: "Projects", icon: FolderOpen, href: "/projects" }
    ]
  },
  {
    section: "CONTENT",
    items: [
      { name: "Posts", icon: FileText, href: "/posts" },
      { name: "Directory", icon: BookOpen, href: "/directory" }
    ]
  },
  {
    section: "NETWORKING",
    items: [
      { name: "Community", icon: Users, href: "/community" },
      { name: "Discover", icon: Search, href: "/discover" },
      { name: "Messages", icon: MessageCircle, href: "/messages" },
      { name: "Connections", icon: UserPlus, href: "/connections" }
    ]
  }
];

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const { signOut, profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border", isCollapsed && "w-16", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">FilmCollab</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Button>
                ))}
              </div>
              {!isCollapsed && <Separator className="my-4 bg-sidebar-border" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="space-y-2">
          {/* User info */}
          {!isCollapsed && profile && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-sidebar-foreground">{profile.full_name || 'User'}</p>
              <p className="text-xs text-sidebar-foreground/60">{profile.role}</p>
            </div>
          )}
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            ) : (
              <Sun className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            )}
            {!isCollapsed && <span>Toggle theme</span>}
          </Button>

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}