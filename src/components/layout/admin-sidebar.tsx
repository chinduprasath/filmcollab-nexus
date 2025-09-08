import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

const adminNavigationItems = [
  {
    section: "MANAGEMENT",
    items: [
      { name: "Users", icon: Users, href: "/admin-dashboard/users" },
      { name: "Reports", icon: BarChart3, href: "/admin-dashboard/reports" },
      { name: "Settings", icon: Settings, href: "/admin-dashboard/settings" }
    ]
  },
  {
    section: "CONTENT",
    items: [
      { name: "Posts Management", icon: FileText, href: "/admin-dashboard/posts" },
      { name: "Jobs Management", icon: FileText, href: "/admin-dashboard/jobs" }
    ]
  }
];

export function AdminSidebar({ className, isCollapsed = false }: AdminSidebarProps) {
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
    <div className={cn("flex h-full w-64 flex-col bg-destructive/5 border-r border-destructive/20", isCollapsed && "w-16", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-destructive/20 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
              Admin Portal
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {adminNavigationItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-destructive/80">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3 text-foreground hover:bg-destructive/10 hover:text-destructive",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Button>
                ))}
              </div>
              {!isCollapsed && <Separator className="my-4 bg-destructive/20" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Admin section */}
      <div className="border-t border-destructive/20 p-3">
        <div className="space-y-2">
          {/* Admin info */}
          {!isCollapsed && profile && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{profile.full_name || 'Admin'}</p>
              <p className="text-xs text-destructive font-semibold">{profile.role}</p>
            </div>
          )}
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-foreground hover:bg-destructive/10",
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
              "w-full justify-start text-foreground hover:bg-destructive/10",
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