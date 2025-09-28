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
import { useState } from "react";
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
  const shouldShowProfileSelector = profile && (!profile.full_name || profile.full_name === 'User' || profile.role === 'USER');

  const handleSignOut = () => {
    console.log('Sign out button clicked!');
    console.log('Performing immediate signout and redirect...');
    
    // Clear any stored auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Clear any cookies if they exist
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Immediate redirect to landing page
    console.log('Redirecting to landing page...');
    window.location.href = '/';
  };

  const handleLinkVFXProfile = async () => {
    // Try to find the VFX profile and link it
    try {
      console.log('Starting VFX profile linking...');
      
      // First, let's see all profiles
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*');
      
      console.log('All profiles:', allProfiles);
      
      // Look for VFX profile specifically
      const { data: vfxProfiles, error: vfxError } = await supabase
        .from('profiles')
        .select('*')
        .or('full_name.ilike.%VFX%,first_name.ilike.%VFX%');
      
      console.log('VFX profiles found:', vfxProfiles);
      
      if (vfxProfiles && vfxProfiles.length > 0) {
        const vfxProfile = vfxProfiles[0];
        console.log('Linking to VFX profile:', vfxProfile);
        
        const result = await linkProfile(vfxProfile.id);
        if (!result.error) {
          console.log('Successfully linked VFX profile');
          // Force a page refresh to update the display
          window.location.reload();
        } else {
          console.error('Error linking profile:', result.error);
        }
      } else {
        console.log('No VFX profile found');
        // Let's try to create one
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: 'VFX',
              first_name: 'VFX',
              role: 'VFX Artist'
            })
            .select()
            .single();
          
          if (newProfile && !createError) {
            console.log('Created new VFX profile:', newProfile);
            window.location.reload();
          }
        }
      }
    } catch (err) {
      console.error('Error linking VFX profile:', err);
    }
  };

  const mockNotifications = [
    {
      id: 1,
      title: "New job posted",
      description: "Senior Director position at Netflix Studios",
      time: "5 minutes ago",
      unread: true
    },
    {
      id: 2,
      title: "Connection request",
      description: "John Smith wants to connect",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "Project update",
      description: "Your project 'Indie Film' has a new comment",
      time: "2 hours ago",
      unread: false
    }
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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
          {/* Temporary VFX Profile Link Button */}
          {shouldShowProfileSelector && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLinkVFXProfile}
                className="text-xs"
              >
                Link VFX Profile
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={async () => {
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      // Directly update the current user's profile
                      const { error } = await supabase
                        .from('profiles')
                        .upsert({
                          user_id: user.id,
                          full_name: 'VFX',
                          first_name: 'VFX',
                          role: 'VFX Artist'
                        });
                      
                      if (!error) {
                        console.log('Profile updated successfully');
                        window.location.reload();
                      }
                    }
                  } catch (err) {
                    console.error('Error updating profile:', err);
                  }
                }}
                className="text-xs"
              >
                Set as VFX
              </Button>
            </div>
          )}


          {/* Notifications */}
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
                  <h3 className="font-semibold">Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        notification.unread ? 'bg-primary/5 border-primary/20' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" size="sm" onClick={() => navigate("/notifications")}>
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Alex Rodriguez" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    A
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    Alex Rodriguez
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Director
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Alex Rodriguez
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Director
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/billing")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/support")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
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