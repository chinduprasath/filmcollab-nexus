import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Shield, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface AdminTopbarProps {
  pageTitle?: string;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AdminTopbar({ 
  pageTitle = "Admin Dashboard", 
  onMenuToggle,
  isMobileMenuOpen = false 
}: AdminTopbarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const mockAdminNotifications = [
    {
      id: 1,
      title: "New user registration",
      description: "5 new users registered today",
      time: "10 minutes ago",
      unread: true,
      type: "info"
    },
    {
      id: 2,
      title: "Content flagged",
      description: "A post has been reported by users",
      time: "30 minutes ago",
      unread: true,
      type: "warning"
    },
    {
      id: 3,
      title: "System backup completed",
      description: "Daily backup finished successfully",
      time: "2 hours ago",
      unread: false,
      type: "success"
    }
  ];

  const unreadCount = mockAdminNotifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-destructive/20">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users, reports..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Admin Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Admin Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockAdminNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        notification.unread ? 'bg-destructive/5 border-destructive/20' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-destructive flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Admin Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={profile?.full_name || 'Admin'} />
                  <AvatarFallback className="bg-gradient-to-br from-destructive to-orange-500 text-primary-foreground">
                    {profile?.first_name?.[0] || profile?.full_name?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    {profile?.full_name || 'Admin User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    admin@filmcollab.com
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs leading-none text-destructive font-semibold">
                    {profile?.role || 'ADMIN'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin-dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Admin Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin-dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}