import { Button } from "@/components/ui/button";
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
  Film, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardTopbarProps {
  pageTitle?: string;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function DashboardTopbar({ 
  pageTitle = "Dashboard", 
  onMenuToggle,
  isMobileMenuOpen = false 
}: DashboardTopbarProps) {
  const { profile, signOut, linkProfile, user } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);



  // Show profile selector if profile is generic
  const shouldShowProfileSelector = profile && (
    !profile.full_name || 
    profile.full_name === 'User' || 
    profile.role === 'USER' || 
    profile.role === 'user'
  );

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLinkVFXProfile = async () => {
    // Try to find the VFX profile and link it
    try {
      console.log('Starting VFX profile linking...');
      
      // First, let's see all profiles
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*');
      
      console.log('All profiles:', allProfiles);
      
      // Look for VFX profile specifically
      const { data: vfxProfiles } = await supabase
        .from('profiles')
        .select('*')
        .or('full_name.ilike.%VFX%,first_name.ilike.%VFX%');
      
      console.log('VFX profiles found:', vfxProfiles);
      
      if (vfxProfiles && vfxProfiles.length > 0) {
        const vfxProfile = vfxProfiles[0];
        console.log('Linking to VFX profile:', vfxProfile);
        
        if (linkProfile) {
          await linkProfile(vfxProfile.id);
          console.log('Successfully linked VFX profile');
          window.location.reload();
        }
      } else {
        console.log('No VFX profile found');
        // Let's try to create one
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: 'VFX',
              first_name: 'VFX',
              role: 'VFX Artist'
            })
            .select()
            .single();
          
          if (newProfile) {
            console.log('Created new VFX profile:', newProfile);
            window.location.reload();
          }
        }
      }
    } catch (err) {
      console.error('Error linking VFX profile:', err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profile?.id) {
        setNotifications([
          {
            id: "mock-1",
            title: "New job posted",
            description: "Senior Director position at Netflix Studios",
            time: "5m ago",
            unread: true
          },
          {
            id: "mock-2",
            title: "Connection request",
            description: "John Smith wants to connect",
            time: "1h ago",
            unread: true
          },
          {
            id: "mock-3",
            title: "Project update",
            description: "Your project 'Indie Film' has a new comment",
            time: "2h ago",
            unread: false
          }
        ]);
        setIsUsingMock(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          setIsUsingMock(true);
          setNotifications([
            {
              id: "mock-1",
              title: "New job posted",
              description: "Senior Director position at Netflix Studios",
              time: "5m ago",
              unread: true
            },
            {
              id: "mock-2",
              title: "Connection request",
              description: "John Smith wants to connect",
              time: "1h ago",
              unread: true
            }
          ]);
        } else {
          setIsUsingMock(false);
          const formatted = (data || []).map(n => {
            const now = new Date();
            const date = new Date(n.created_at);
            const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
            let timeStr = "Recently";
            if (diffMins < 1) timeStr = "Just now";
            else if (diffMins < 60) timeStr = `${diffMins}m ago`;
            else if (diffMins < 1440) timeStr = `${Math.floor(diffMins / 60)}h ago`;
            else timeStr = `${Math.floor(diffMins / 1440)}d ago`;

            return {
              id: n.id,
              title: n.title,
              description: n.description,
              time: timeStr,
              unread: n.status === 'unread'
            };
          });
          setNotifications(formatted);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscription: any;
    if (profile?.id) {
      subscription = supabase
        .channel('topbar:notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [profile?.id]);

  const handleMarkAllTopbarRead = async () => {
    if (isUsingMock) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      return;
    }
    if (!profile?.id) return;
    try {
      await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', profile.id)
        .eq('status', 'unread');
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-background/60 border-b border-yellow-200 dark:border-yellow-900/40">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
            onClick={onMenuToggle}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

        </div>

        <div className="flex items-center gap-4">



          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-yellow-500 hover:bg-yellow-600"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white dark:bg-background border border-yellow-100 dark:border-yellow-900/40" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMarkAllTopbarRead}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                  >
                    Mark all read
                  </Button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/notifications");
                      }}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors ${
                        notification.unread 
                          ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/40' 
                          : 'bg-white dark:bg-background border-gray-100 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{notification.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-500">
                      No notifications yet
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/notifications")} className="w-full border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-500 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 dark:text-white">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-yellow-50 dark:hover:bg-yellow-950/30">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    {(profile?.full_name || profile?.username || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {profile?.username || user?.email?.split('@')[0] || "user"}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {profile?.full_name || "User"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-background border border-yellow-100 dark:border-yellow-900/40" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {profile?.full_name || profile?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                    {profile?.email || user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-yellow-100 dark:bg-yellow-900/25" />
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/30 dark:text-gray-300 dark:hover:text-white">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/30 dark:text-gray-300 dark:hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/billing")} className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/30 dark:text-gray-300 dark:hover:text-white">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/support")} className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/30 dark:text-gray-300 dark:hover:text-white">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-yellow-100 dark:bg-yellow-900/25" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 dark:text-red-300"
              >
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