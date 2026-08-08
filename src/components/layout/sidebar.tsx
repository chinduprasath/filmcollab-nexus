import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Monitor,
  Building2,
  MapPin,
  Megaphone
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
    section: "CONTENT",
    items: [
      { name: "Talent Hub", icon: Search, href: "/discover" },
      { name: "Talent Directory", icon: UserCheck, href: "/directory" },
      { name: "Companies Directory", icon: Building2, href: "/studios" },
      { name: "Shooting Locations", icon: MapPin, href: "/locations" }
    ]
  },
  {
    section: "OPPORTUNITIES",
    items: [
      { name: "Casting Calls", icon: Megaphone, href: "/casting-calls" },
      { name: "Jobs", icon: Briefcase, href: "/jobs" },
      { name: "Industry Hub", icon: Calendar, href: "/industry-hub" },
      { name: "Projects", icon: FolderOpen, href: "/projects" }
    ]
  },
  {
    section: "NETWORKING",
    items: [
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      sessionStorage.setItem('sidebarScrollPos', target.scrollTop.toString());
    };
    
    let viewport: Element | null = null;
    if (scrollRef.current) {
      setTimeout(() => {
        if (!scrollRef.current) return;
        viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          const savedScroll = sessionStorage.getItem('sidebarScrollPos');
          if (savedScroll) {
            viewport.scrollTop = parseInt(savedScroll, 10);
          }
          viewport.addEventListener('scroll', handleScroll);
        }
      }, 50);
    }
    
    return () => {
      if (viewport) {
        viewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!profile?.id) {
        // Fallback to local storage for guest
        try {
          const saved = localStorage.getItem("chat_conversations");
          if (saved) {
            const conversations = JSON.parse(saved);
            const total = conversations.reduce((acc: number, c: { unread?: number }) => acc + (c.unread || 0), 0);
            setUnreadCount(total);
          }
        } catch (e) {
          console.error(e);
        }
        return;
      }

        try {
          const { data: unreadMsgs, error } = await supabase
            .from("messages")
            .select("sender_id, created_at")
            .eq("receiver_id", profile.id)
            .eq("is_read", false);
  
          if (!error && unreadMsgs) {
            // Use local storage to parse actual read timestamps and bypass RLS failure
            const readConvs = JSON.parse(localStorage.getItem("read_conversations") || "{}");
            const actualUnread = unreadMsgs.filter(m => new Date(m.created_at).getTime() > (readConvs[m.sender_id] || 0)).length;
            setUnreadCount(actualUnread);
          }
        } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 4000);
    return () => clearInterval(interval);
  }, [profile?.id]);

  return (
    <div className={cn("flex h-full w-64 flex-col bg-white dark:bg-background border-r border-yellow-200 dark:border-yellow-900/40", isCollapsed && "w-16", className)}>
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-yellow-200 dark:border-yellow-900/40 relative", isCollapsed ? "justify-center" : "justify-between px-6")}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
            <div className="h-4 w-4 bg-white rounded-sm opacity-90"></div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">FilmCollab</span>
          )}
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0",
              isCollapsed ? "absolute -right-4 top-4 bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-full shadow-sm z-50 hover:bg-gray-50 dark:hover:bg-gray-800" : "hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
            )}
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
      <ScrollArea ref={scrollRef} className="flex-1 px-3 py-4">
        <div className="space-y-8">
          {navigationItems.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 hover:text-gray-900 dark:hover:text-yellow-400 transition-colors relative",
                      isActive(item.href) && "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <div className="relative flex items-center">
                      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                      {isCollapsed && item.name === "Messages" && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-600 text-white text-[8px] font-bold rounded-full h-4 min-w-[16px] px-0.5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && <span>{item.name}</span>}
                    {!isCollapsed && item.name === "Messages" && unreadCount > 0 && (
                      <span className={cn(
                        "ml-auto bg-yellow-600 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center",
                        isActive(item.href) && "bg-white text-yellow-650"
                      )}>
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Theme section */}
      <div className="border-t border-yellow-200 dark:border-yellow-900/40 p-4">
        {!isCollapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-3">Theme</p>
        )}
        
        <div 
          className={cn(
            "flex items-center rounded-full p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer relative",
            isCollapsed ? "flex-col h-16 w-8 mx-auto" : "w-full h-8"
          )}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <div 
            className={cn(
              "absolute bg-white dark:bg-gray-600 rounded-full shadow-sm transition-all duration-200 ease-in-out",
              isCollapsed 
                ? cn("w-6 h-[28px] left-[3px]", theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark")) ? "top-[33px]" : "top-[3px]")
                : cn("h-6 w-[calc(50%-4px)] top-1", theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark")) ? "left-[calc(50%+2px)]" : "left-1")
            )} 
          />
          <div className={cn("relative z-10 flex items-center justify-center transition-colors", isCollapsed ? "h-1/2 w-full" : "w-1/2 h-full", theme === 'light' || (theme === 'system' && !document.documentElement.classList.contains('dark')) ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400')}>
            <Sun className="h-4 w-4" />
          </div>
          <div className={cn("relative z-10 flex items-center justify-center transition-colors", isCollapsed ? "h-1/2 w-full" : "w-1/2 h-full", theme === 'dark' || (theme === 'system' && document.documentElement.classList.contains('dark')) ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400')}>
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}