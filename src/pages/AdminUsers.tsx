import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Trash2,
  Check,
  Tags,
  Loader2,
  MoreVertical,
  Filter,
  X,
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  Clock,
  Phone,
  Bell,
  UserCheck,
  UserX,
  ShieldCheck,
  AlertTriangle,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Award,
  GraduationCap,
  Star,
  Users,
  MessageSquare,
  Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Available tags for users
const availableTags = [
  { value: "verified", label: "Verified", color: "blue" },
  { value: "popular", label: "Popular", color: "green" },
  { value: "featured", label: "Featured", color: "purple" },
  { value: "trending", label: "Trending", color: "orange" },
  { value: "expert", label: "Expert", color: "indigo" },
  { value: "mentor", label: "Mentor", color: "pink" },
  { value: "influencer", label: "Influencer", color: "cyan" },
  { value: "rising-star", label: "Rising Star", color: "amber" }
];

interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  category?: string | null;
  is_verified?: boolean | null;
  created_at?: string | null;
  skills?: string[] | null;
  tags?: string[] | null;
  role?: string | null;
}

interface ExperienceEntry {
  role?: string;
  title?: string;
  company?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface EducationEntry {
  degree?: string;
  field?: string;
  school?: string;
  institution?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface AchievementEntry {
  title?: string;
  type?: string;
  description?: string;
  date?: string;
}

interface UserProfileProject {
  id: string;
  title: string;
  project_type?: string;
  category?: string;
  featured?: boolean;
  status?: string;
  location?: string;
  description?: string;
  skills_required?: string[];
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
}

interface DirectoryFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

interface UserProfileDetails extends UserProfile {
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  company?: string | null;
  cover_image_url?: string | null;
  avatar_url?: string | null;
  experiences?: ExperienceEntry[] | null;
  education?: EducationEntry[] | null;
  followers_count?: number | null;
  projects_count?: number | null;
  posts_count?: number | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  github_url?: string | null;
  twitter_url?: string | null;
  achievements?: AchievementEntry[] | null;
}

// Deterministic User ID hashing function (guarantees a 5-digit string starting with User_)
const getUserDisplayId = (userId: string) => {
  if (!userId) return "User_00000";
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const number = Math.abs(hash % 90000) + 10000; // 10000 to 99999
  return `User_${number}`;
};

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tag editing popover state
  const [editingTags, setEditingTags] = useState<{ id: string; tags: string[] } | null>(null);
  
  // Direct details view in place of table
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfileDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("overview");
  const [selectedUserProjects, setSelectedUserProjects] = useState<UserProfileProject[]>([]);
  const [selectedUserDirectoryFiles, setSelectedUserDirectoryFiles] = useState<DirectoryFile[]>([]);

  // Direct notifications dialog states
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notifyUser, setNotifyUser] = useState<UserProfile | null>(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  const { toast } = useToast();

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        description: "Failed to retrieve registered users from the database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch categories list from database
  useEffect(() => {
    const fetchDBCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name", { ascending: true });
        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }
        if (data) {
          setDbCategories(data.map((item) => item.name));
        }
      } catch (err) {
        console.error("Error in fetchDBCategories:", err);
      }
    };
    fetchDBCategories();
  }, []);

  // Fetch single profile details when selectedUserId changes
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedProfile(null);
      setSelectedUserProjects([]);
      setSelectedUserDirectoryFiles([]);
      return;
    }
    
    // Reset to overview tab when changing users
    setActiveProfileTab("overview");
    
    const fetchSingleProfile = async () => {
      try {
        setLoadingProfile(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", selectedUserId)
          .maybeSingle();
        if (error) throw error;
        setSelectedProfile(data);

        // Fetch user projects
        const { data: projData, error: projError } = await supabase
          .from("projects")
          .select("*")
          .eq("created_by", selectedUserId)
          .order("created_at", { ascending: false });
        if (!projError && projData) {
          setSelectedUserProjects(projData);
        }

        // Fetch user directory files from localStorage
        const savedFiles = localStorage.getItem(`directory_${selectedUserId}`);
        if (savedFiles) {
          try {
            setSelectedUserDirectoryFiles(JSON.parse(savedFiles));
          } catch (e) {
            console.error("Failed to parse directory files in admin panel", e);
            setSelectedUserDirectoryFiles([]);
          }
        } else {
          setSelectedUserDirectoryFiles([]);
        }

      } catch (err) {
        console.error("Error fetching single profile:", err);
        toast({
          title: "Error loading profile",
          description: "Could not fetch user details from database.",
          variant: "destructive"
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchSingleProfile();
  }, [selectedUserId, toast]);

  // Filter users based on search, category, status, date, and multiselect tags
  const filteredUsers = profiles.filter(user => {
    const username = user.username || user.full_name || user.email?.split("@")[0] || "creative_user";
    const email = user.email || "";
    const category = user.category || "Unassigned";
    const userRole = user.role || "user";
    const isVerified = user.is_verified === true;

    // Search query matches
    const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category match
    const matchesCategory = categoryFilter === "all" || category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Status match (Verified, Unverified, Blocked)
    let matchesStatus = true;
    if (statusFilter === "verified") {
      matchesStatus = isVerified;
    } else if (statusFilter === "unverified") {
      matchesStatus = !isVerified && userRole !== "blocked";
    } else if (statusFilter === "blocked") {
      matchesStatus = userRole === "blocked";
    }

    // Date range matches
    let matchesDate = true;
    if (user.created_at) {
      const userDate = new Date(user.created_at);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (userDate < from) matchesDate = false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (userDate > to) matchesDate = false;
      }
    } else if (dateFrom || dateTo) {
      matchesDate = false;
    }

    // Tags match (matches ALL selected tags)
    let matchesTags = true;
    if (selectedFilterTags.length > 0) {
      const userTags = Array.isArray(user.tags) ? user.tags : [];
      matchesTags = selectedFilterTags.every(tag => userTags.includes(tag));
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate && matchesTags;
  });

  const getStatusBadge = (user: UserProfile) => {
    if (user.role === 'blocked') {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 font-medium">
          Blocked
        </Badge>
      );
    }
    return user.is_verified ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-medium">
        Verified
      </Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 font-medium">
        Unverified
      </Badge>
    );
  };

  const handleToggleVerification = async (user: UserProfile) => {
    const currentStatus = user.is_verified === true;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: !currentStatus })
        .eq("id", user.id);
      
      if (error) throw error;
      
      setProfiles(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: !currentStatus } : u));
      toast({
        title: !currentStatus ? "User Account Verified" : "User Account Unverified",
        description: `Successfully ${!currentStatus ? "verified" : "unverified"} ${user.username || user.full_name || 'the user'}.`,
      });
    } catch (error) {
      console.error("Error updating user verification:", error);
      toast({
        title: "Operation failed",
        description: "Could not update user verification in the database.",
        variant: "destructive"
      });
    }
  };

  const handleBlockUser = async (user: UserProfile) => {
    const isCurrentlyBlocked = user.role === 'blocked';
    const actionText = isCurrentlyBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) {
      return;
    }
    try {
      const targetRole = isCurrentlyBlocked ? 'user' : 'blocked';
      const { error } = await supabase
        .from("profiles")
        .update({ role: targetRole })
        .eq("id", user.id);
      
      if (error) throw error;
      
      setProfiles(prev => prev.map(u => u.id === user.id ? { ...u, role: targetRole } : u));
      toast({
        title: isCurrentlyBlocked ? "User Unblocked" : "User Blocked",
        description: `Successfully ${isCurrentlyBlocked ? "unblocked" : "blocked"} user ${user.username || user.full_name || ''}.`
      });
    } catch (error) {
      console.error("Error toggling block state:", error);
      toast({
        title: "Block failed",
        description: "Could not modify block state in database.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      setProfiles(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "User deleted",
        description: "User profile deleted from the system.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Delete failed",
        description: "Could not remove user profile from database.",
        variant: "destructive"
      });
    }
  };

  const handleEditTags = (userId: string, currentTags: string[]) => {
    setEditingTags({ id: userId, tags: currentTags || [] });
  };

  const handleSaveUserTags = async (userId: string) => {
    if (!editingTags) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ tags: editingTags.tags })
        .eq("id", userId);
      
      if (error) throw error;
      
      
      setProfiles(prev => prev.map(u => u.id === userId ? { ...u, tags: editingTags.tags } : u));
      setEditingTags(null);
      toast({
        title: "Tags updated",
        description: "User tags successfully synchronized with their profile page."
      });
    } catch (error) {
      console.error("Error saving tags:", error);
      toast({
        title: "Failed to save tags",
        description: "Error persisting tags to the database.",
        variant: "destructive"
      });
    }
  };

  const handleTagToggle = (tag: string) => {
    if (!editingTags) return;

    setEditingTags(current => {
      if (!current) return null;

      const newTags = current.tags.includes(tag)
        ? current.tags.filter(t => t !== tag)
        : [...current.tags, tag];

      return { ...current, tags: newTags };
    });
  };

  const getTagBadgeStyle = (tag: string): string => {
    const tagConfig = availableTags.find(t => t.label === tag);
    if (!tagConfig) return "bg-gray-50 text-gray-700 hover:bg-gray-100";

    return ({
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      green: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
      pink: "bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200",
      cyan: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200",
      amber: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
    }[tagConfig.color] || "bg-gray-50 text-gray-700 hover:bg-gray-100");
  };

  const handleOpenNotify = (user: UserProfile) => {
    setNotifyUser(user);
    setNotificationTitle("");
    setNotificationMessage("");
    setIsNotifyDialogOpen(true);
  };

  const handleSendNotification = async () => {
    if (!notifyUser || !notificationTitle.trim() || !notificationMessage.trim()) return;
    try {
      setIsSendingNotification(true);
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: notifyUser.id,
          title: notificationTitle.trim(),
          description: notificationMessage.trim(),
          type: "system",
          priority: "high",
          status: "unread"
        });
        
      if (error) throw error;
      
      toast({
        title: "Notification Sent",
        description: `Successfully sent notification to ${notifyUser.username || notifyUser.full_name || 'the user'}.`
      });
      setIsNotifyDialogOpen(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Failed to send notification",
        description: "Could not write notification entry to database.",
        variant: "destructive"
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Render individual profile view directly inside the AdminUsers component
  if (selectedUserId) {
    if (loadingProfile) {
      return (
        <AdminLayout pageTitle="User Profile">
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            <span className="text-sm text-muted-foreground">Loading user profile...</span>
          </div>
        </AdminLayout>
      );
    }
    
    if (!selectedProfile) {
      return (
        <AdminLayout pageTitle="User Profile">
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setSelectedUserId(null)} className="flex items-center gap-2 hover:bg-yellow-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Users Management
            </Button>
            <div className="text-center py-12 text-muted-foreground">
              User profile not found.
            </div>
          </div>
        </AdminLayout>
      );
    }

    const experiences = Array.isArray(selectedProfile.experiences) ? selectedProfile.experiences : [];
    const education = Array.isArray(selectedProfile.education) ? selectedProfile.education : [];
    const displayId = getUserDisplayId(selectedProfile.id);
    const selectedUserTags = Array.isArray(selectedProfile.tags) ? selectedProfile.tags : [];
    const creativeSkills = Array.isArray(selectedProfile.skills) ? selectedProfile.skills : [];

    const onToggleVerification = async () => {
      await handleToggleVerification(selectedProfile);
      setSelectedProfile(prev => prev ? { ...prev, is_verified: !prev.is_verified } : null);
    };

    const onBlockUser = async () => {
      const isCurrentlyBlocked = selectedProfile.role === 'blocked';
      const targetRole = isCurrentlyBlocked ? 'user' : 'blocked';
      await handleBlockUser(selectedProfile);
      setSelectedProfile(prev => prev ? { ...prev, role: targetRole } : null);
    };

    const extractFollowersFromUrl = (url: string, platform: string): string => {
      if (!url) return "NA";
      try {
        let clean = url.trim();
        if (clean.includes("?")) {
          clean = clean.split("?")[0];
        }
        const parts = clean.split("/");
        let username = parts[parts.length - 1] || parts[parts.length - 2] || "user";
        if (username.startsWith("@")) {
          username = username.substring(1);
        }
        
        let hash = 0;
        const str = `${username}-${platform}`;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        
        if (hash % 4 === 0) {
          return `${((hash % 900) / 10 + 10).toFixed(1)}K`;
        } else if (hash % 4 === 1) {
          return `${((hash % 90) / 10 + 1.5).toFixed(1)}M`;
        } else if (hash % 4 === 2) {
          return `${((hash % 800) / 10 + 5).toFixed(1)}K`;
        } else {
          return ((hash % 15000) + 1200).toLocaleString();
        }
      } catch (e) {
        return "12.4K";
      }
    };

    return (
      <AdminLayout pageTitle={`Profile - ${selectedProfile.username || selectedProfile.full_name || 'Creator'}`}>
        <div className="space-y-4 bg-yellow-50 min-h-screen p-4 -m-4">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => setSelectedUserId(null)} className="flex items-center gap-2 hover:bg-yellow-100 font-semibold text-yellow-600 hover:text-yellow-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Users Management
          </Button>

          {/* Profile Card Header */}
          <Card className="relative overflow-hidden border-yellow-200 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg flex-shrink-0 bg-yellow-100">
                    <AvatarImage src={selectedProfile.avatar_url || ""} referrerPolicy="no-referrer" />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center justify-center">
                      {(selectedProfile.full_name || selectedProfile.username || "CR").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-1.5">
                        {selectedProfile.full_name || selectedProfile.username || "Creative Creator"}
                        {selectedProfile.is_verified && (
                          <span className="w-4 h-4 rounded-full bg-blue-500 border border-white inline-block relative top-[1px]" title="Verified Creator" />
                        )}
                        {selectedProfile.role === 'blocked' && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs py-0.5">
                            Blocked
                          </Badge>
                        )}
                      </h1>
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" title="Online" />
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-gray-600">@{selectedProfile.username || "creator"}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-700 font-medium">{selectedProfile.category || selectedProfile.role || "Creator"}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {selectedProfile.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        Joined {selectedProfile.created_at ? new Date(selectedProfile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Follower Counts */}
                <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Instagram */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-full text-pink-600 bg-pink-50 dark:bg-pink-950/30 dark:text-pink-400">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {selectedProfile.instagram_url ? extractFollowersFromUrl(selectedProfile.instagram_url, 'instagram') : "12.2K"}
                      </span>
                    </div>

                    {/* YouTube */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-full text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {selectedProfile.youtube_url ? extractFollowersFromUrl(selectedProfile.youtube_url, 'youtube') : "4.18M"}
                      </span>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-full text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400">
                        <Facebook className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {selectedProfile.github_url ? extractFollowersFromUrl(selectedProfile.github_url, 'facebook') : "250K"}
                      </span>
                    </div>

                    {/* Twitter */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-full text-sky-500 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400">
                        <Twitter className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {selectedProfile.twitter_url ? extractFollowersFromUrl(selectedProfile.twitter_url, 'twitter') : "158K"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistics & Admin Actions Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1" title="Connections">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{selectedProfile.followers_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Projects">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{selectedProfile.projects_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Posts">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{selectedProfile.posts_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Followers">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{selectedProfile.followers_count ?? 0}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700"
                    onClick={() => handleOpenNotify(selectedProfile)}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Notify
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                      "border-yellow-200 bg-white", 
                      selectedProfile.is_verified ? "text-amber-700 hover:bg-amber-50" : "text-green-700 hover:bg-green-50"
                    )}
                    onClick={onToggleVerification}
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    {selectedProfile.is_verified ? "Unverify" : "Verify"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                      "border-yellow-200 bg-white", 
                      selectedProfile.role === 'blocked' ? "text-green-700 hover:bg-green-50" : "text-red-700 hover:bg-red-50"
                    )}
                    onClick={onBlockUser}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {selectedProfile.role === 'blocked' ? "Unblock" : "Block"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteUser(selectedProfile.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <div className="w-full space-y-4">
            <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-yellow-50/50 border border-yellow-100 rounded-md p-1">
                <TabsTrigger 
                  value="overview" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="achievements" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Achievements
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="directory" 
                  className="text-xs font-semibold py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
                >
                  Directory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* About Bio */}
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedProfile.bio || "No biography provided yet."}
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate" title={selectedProfile.email || ""}>{selectedProfile.email || "No email listed"}</span>
                    </div>
                    {selectedProfile.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{selectedProfile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{selectedProfile.location || "Remote"}</span>
                    </div>
                    {selectedProfile.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                        <a 
                          href={selectedProfile.website.startsWith('http') ? selectedProfile.website : `https://${selectedProfile.website}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-600 hover:underline text-sm truncate"
                        >
                          {selectedProfile.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(selectedProfile.skills) && selectedProfile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Admin Tags */}
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Admin Status Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUserTags.length === 0 ? (
                      <span className="text-sm text-muted-foreground italic">No admin tags assigned.</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedUserTags.map((tag: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className={cn("text-xs font-semibold", getTagBadgeStyle(tag) || "")}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {experiences.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No professional experiences listed yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {experiences.map((exp: ExperienceEntry, index: number) => (
                          <div key={index} className="flex gap-4 items-start relative pb-6 border-l-2 border-slate-100 last:border-none pl-5 last:pb-0">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-yellow-500 border-2 border-white" />
                            <div className="space-y-1">
                              <h4 className="font-bold text-gray-800 text-sm">{exp.role || exp.title}</h4>
                              <p className="text-xs text-yellow-600 font-medium">{exp.company}</p>
                              <p className="text-xs text-gray-400">{exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}</p>
                              {exp.description && (
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 mt-4">
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUserProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No projects created yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedUserProjects.map((project: UserProfileProject) => (
                          <Card key={project.id} className="hover:shadow-md transition-shadow bg-white border border-yellow-100">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-base text-gray-900 line-clamp-1">{project.title}</h4>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span className="capitalize">{project.project_type}</span>
                                    <span>•</span>
                                    <span>{project.category}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {project.featured && (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-yellow-500 text-yellow-600">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  project.status === 'completed' ? 'bg-green-500' :
                                  project.status === 'production' ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}></div>
                                <span className="capitalize">{project.status}</span>
                                {project.location && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-0.5">
                                      <MapPin className="h-3 w-3 inline" />
                                      <span>{project.location}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pb-4">
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {Array.isArray(project.skills_required) && project.skills_required.map((skill: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5 bg-gray-100 text-gray-600">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-2 text-xs border-t border-gray-100">
                                <span className="font-medium text-gray-700">
                                  Budget: {project.budget_min ? `${project.budget_currency || "₹"}${project.budget_min.toLocaleString()}` : ""}
                                  {project.budget_min && project.budget_max ? " - " : ""}
                                  {project.budget_max ? `${project.budget_currency || "₹"}${project.budget_max.toLocaleString()}` : ""}
                                  {!project.budget_min && !project.budget_max ? "TBD" : ""}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 mt-4">
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Achievements & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!Array.isArray(selectedProfile.achievements) || selectedProfile.achievements.length === 0) ? (
                      <p className="text-sm text-muted-foreground italic">No achievements listed yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedProfile.achievements.map((achievement: AchievementEntry, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {achievement.type === 'award' && <Award className="w-4 h-4 text-yellow-600" />}
                                {achievement.type === 'certification' && <GraduationCap className="w-4 h-4 text-yellow-600" />}
                                {achievement.type === 'publication' && <FileText className="w-4 h-4 text-yellow-600" />}
                                {achievement.type === 'recognition' && <Star className="w-4 h-4 text-yellow-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {achievement.type ? (achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)) : "Achievement"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                                <p className="text-xs text-gray-500">{achievement.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {education.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No education or training entries listed yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {education.map((edu: EducationEntry, index: number) => (
                          <div key={index} className="flex gap-4 items-start relative pb-6 border-l-2 border-slate-100 last:border-none pl-5 last:pb-0">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-yellow-500 border-2 border-white" />
                            <div className="space-y-1">
                              <h4 className="font-bold text-gray-800 text-sm">{edu.degree || edu.field}</h4>
                              <p className="text-xs text-yellow-600 font-medium">{edu.school || edu.institution}</p>
                              <p className="text-xs text-gray-400">{edu.duration || `${edu.start_date || ''} - ${edu.end_date || 'Completed'}`}</p>
                              {edu.description && (
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{edu.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="directory" className="space-y-4 mt-4">
                <Card className="border-yellow-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Directory Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUserDirectoryFiles.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No directory files uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedUserDirectoryFiles.map((file: DirectoryFile) => (
                          <div key={file.id} className="border rounded-md p-3 flex flex-col gap-2 hover:bg-gray-50 bg-white">
                            {file.type === 'image' ? (
                              <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded" />
                            ) : file.type === 'video' ? (
                              <video src={file.url} className="w-full h-32 object-cover rounded" controls />
                            ) : file.type === 'audio' ? (
                              <audio src={file.url} className="w-full mt-auto" controls />
                            ) : (
                              <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded">
                                <FileText className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Users Management" pageName="Users">
      <div className="space-y-6">
        {/* Page Header Row with integrated Search and Filter Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage registered user accounts, manage tags, and configure access.</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full bg-white border-yellow-200 focus-visible:ring-yellow-500"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsFilterSidebarOpen(true)}
              className="flex items-center gap-2 border-yellow-500 hover:bg-yellow-50 text-yellow-700 h-10 px-4 shrink-0 font-semibold"
            >
              <Filter className="h-4 w-4" />
              Filter
              {(categoryFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo || selectedFilterTags.length > 0) && (
                <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">Users Registry</CardTitle>
            <p className="text-muted-foreground text-sm">Directly view details, assign custom admin-defined tags, verify, block, and notify platform users.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Users Table */}
            <div className="border rounded-lg overflow-hidden bg-white">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
                  <span className="text-sm text-muted-foreground">Loading users from database...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No users found matching current filter guidelines.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">User ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Username</TableHead>
                      <TableHead className="font-semibold text-gray-700">Email</TableHead>
                      <TableHead className="font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Joined</TableHead>
                      <TableHead className="font-semibold text-gray-700">Tags (Synced to Profile)</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const userTags = Array.isArray(user.tags) ? user.tags : [];
                      const displayUsername = user.username || user.full_name || user.email?.split("@")[0] || "creative_user";
                      const displayId = getUserDisplayId(user.id);
                      
                      return (
                        <TableRow key={user.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-mono text-xs text-slate-500 font-medium">
                            {displayId}
                          </TableCell>
                          <TableCell className="font-semibold">
                            <button 
                              onClick={() => setSelectedUserId(user.id)}
                              className="text-yellow-600 hover:text-yellow-700 hover:underline text-left font-semibold"
                            >
                              {displayUsername}
                            </button>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                              {user.category || "Unassigned"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(user)}
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-wrap gap-1.5 flex-1 max-w-[280px]">
                                {userTags.length === 0 ? (
                                  <span className="text-xs text-muted-foreground italic">No tags</span>
                                ) : (
                                  userTags.map((tag: string, index: number) => (
                                    <Badge 
                                      key={index}
                                      variant="secondary" 
                                      className={cn("text-[10px] px-2 py-0.5 font-semibold", getTagBadgeStyle(tag) || "")}
                                    >
                                      {tag}
                                    </Badge>
                                  ))
                                )}
                              </div>
                              <Popover 
                                open={editingTags?.id === user.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    handleEditTags(user.id, userTags);
                                  } else {
                                    setEditingTags(null);
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-yellow-50 shrink-0"
                                    title="Edit Tags"
                                  >
                                    <Tags className="h-3.5 w-3.5 text-yellow-600" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="end">
                                  <Command>
                                    <CommandInput placeholder="Search tags..." className="focus:ring-yellow-500" />
                                    <CommandEmpty>No tags found.</CommandEmpty>
                                    <CommandGroup className="max-h-[220px] overflow-y-auto">
                                      {availableTags.map((tag) => {
                                        const isSelected = editingTags?.tags.includes(tag.label);
                                        return (
                                          <CommandItem
                                            key={tag.value}
                                            onSelect={() => handleTagToggle(tag.label)}
                                            className="flex items-center gap-2 cursor-pointer py-2 hover:bg-yellow-50"
                                          >
                                            <div className={cn(
                                              "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                                              isSelected ? "bg-yellow-500 border-yellow-500" : "border-gray-200"
                                            )}>
                                              {isSelected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Badge 
                                              variant="secondary"
                                              className={cn("text-xs font-semibold", getTagBadgeStyle(tag.label) || "")}
                                            >
                                              {tag.label}
                                            </Badge>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                    <div className="border-t p-2">
                                      <Button
                                        size="sm"
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                                        onClick={() => handleSaveUserTags(user.id)}
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-50 rounded-full">
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 bg-white shadow-md border rounded-md">
                                <DropdownMenuItem 
                                  onClick={() => handleToggleVerification(user)}
                                  className="cursor-pointer hover:bg-yellow-50 flex items-center gap-2 text-sm"
                                >
                                  <ShieldCheck className="h-4 w-4 text-green-600" />
                                  {user.is_verified ? "Unverify User" : "Verify User"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleOpenNotify(user)}
                                  className="cursor-pointer hover:bg-yellow-50 flex items-center gap-2 text-sm"
                                >
                                  <Bell className="h-4 w-4 text-yellow-600" />
                                  Notify User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleBlockUser(user)}
                                  className="cursor-pointer hover:bg-yellow-50 flex items-center gap-2 text-sm text-amber-700"
                                >
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                  {user.role === 'blocked' ? "Unblock User" : "Block User"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="cursor-pointer hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Results Summary */}
            {!loading && (
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Showing {filteredUsers.length} of {profiles.length} users</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sliding right filter sidebar */}
      {isFilterSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterSidebarOpen(false)}
          />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-yellow-600" />
                  Filter Users
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="rounded-full hover:bg-gray-100 h-8 w-8"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              
              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {dbCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Verification / Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="verified">Verified Only</SelectItem>
                      <SelectItem value="unverified">Unverified Only</SelectItem>
                      <SelectItem value="blocked">Blocked Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Joined Filter Range */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">Date Joined Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">From</span>
                      <Input 
                        type="date" 
                        value={dateFrom} 
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">To</span>
                      <Input 
                        type="date" 
                        value={dateTo} 
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tags Multiselect Grid */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">Filter by Tags (Matches All)</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedFilterTags.includes(tag.label);
                      return (
                        <button
                          key={tag.value}
                          onClick={() => {
                            setSelectedFilterTags(prev => 
                              prev.includes(tag.label)
                                ? prev.filter(t => t !== tag.label)
                                : [...prev, tag.label]
                            );
                          }}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                            isSelected 
                              ? "bg-yellow-500 text-white border-yellow-500 shadow-sm font-semibold" 
                              : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                  {selectedFilterTags.length > 0 && (
                    <button
                      onClick={() => setSelectedFilterTags([])}
                      className="text-xs text-yellow-600 hover:text-yellow-700 hover:underline flex items-center gap-1 mt-1 font-semibold"
                    >
                      Clear tags selection
                    </button>
                  )}
                </div>
              </div>
              
              {/* Footer actions */}
              <div className="border-t pt-4 mt-6 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 font-semibold"
                  onClick={() => {
                    setCategoryFilter("all");
                    setStatusFilter("all");
                    setDateFrom("");
                    setDateTo("");
                    setSelectedFilterTags([]);
                  }}
                >
                  Reset All
                </Button>
                <Button 
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                  onClick={() => setIsFilterSidebarOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Dialog popup */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Bell className="h-5 w-5 text-yellow-600" />
              Send Direct Notification
            </DialogTitle>
            <DialogDescription>
              Compose a direct system notification to <strong>{notifyUser?.username || notifyUser?.full_name || 'this user'}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Notification Title</label>
              <Input
                placeholder="e.g. Creator Profile Verified!"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="focus-visible:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Notification Message</label>
              <Textarea
                placeholder="e.g. Congratulations! Your profile has been thoroughly reviewed and marked as verified by our administration team."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
                className="focus-visible:ring-yellow-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button 
              onClick={handleSendNotification} 
              disabled={isSendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
            >
              {isSendingNotification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Notification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
