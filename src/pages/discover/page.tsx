"use client";

import { useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User as UserIcon,
  MessageCircle,
  UserPlus,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Globe,
  MoreVertical,
  Bookmark,
  Share2,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  role?: string;
  website?: string;
  skills?: string[];
  experience_level?: string;
  industry?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  created_at: string;
  is_verified?: boolean;
  followers_count?: number;
  projects_count?: number;
  posts_count?: number;
  likes_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
}

type FilterType = "all" | "verified" | "new" | "popular";
type SortType = "recent" | "popular" | "alphabetical";
type IndustryFilter = "all" | "film" | "television" | "advertising" | "documentary" | "animation" | "photography" | "music" | "other";

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    full_name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar_url: "/placeholder/avatar1.jpg",
    bio: "Cinematographer with 8+ years of experience in film and commercial production. Passionate about visual storytelling.",
    location: "Los Angeles, CA",
    role: "Cinematographer",
    website: "https://sarahjohnson.com",
    skills: ["Cinematography", "Lighting", "Color Grading", "Film Production"],
    experience_level: "Senior",
    industry: "film",
    portfolio_url: "https://portfolio.sarahjohnson.com",
    linkedin_url: "https://linkedin.com/in/sarahjohnson",
    created_at: "2024-01-15T10:00:00Z",
    is_verified: true,
    followers_count: 1250,
    projects_count: 45,
    posts_count: 23,
    likes_count: 89,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "2",
    full_name: "Raj Patel",
    email: "raj@example.com",
    avatar_url: "/placeholder/avatar2.jpg",
    bio: "Film Director and Producer specializing in independent films and documentaries.",
    location: "Mumbai, India",
    role: "Film Director",
    skills: ["Directing", "Producing", "Screenwriting", "Post-Production"],
    experience_level: "Mid",
    industry: "documentary",
    created_at: "2024-02-20T14:30:00Z",
    is_verified: false,
    followers_count: 890,
    projects_count: 28,
    posts_count: 15,
    likes_count: 45,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "3",
    full_name: "Amelia Chen",
    email: "amelia@example.com",
    avatar_url: "/placeholder/avatar3.jpg",
    bio: "Sound Designer and Audio Engineer with expertise in film and game audio.",
    location: "San Francisco, CA",
    role: "Sound Designer",
    skills: ["Sound Design", "Audio Engineering", "Music Production", "Foley"],
    experience_level: "Senior",
    industry: "music",
    github_url: "https://github.com/ameliachen",
    created_at: "2024-03-10T09:15:00Z",
    is_verified: true,
    followers_count: 2100,
    projects_count: 67,
    posts_count: 42,
    likes_count: 156,
    is_liked: true,
    is_saved: false,
  },
  {
    id: "4",
    full_name: "Alex Rodriguez",
    email: "alex@example.com",
    avatar_url: "/placeholder/avatar4.jpg",
    bio: "Creative Director and Visual Effects Artist. Bringing stories to life through cutting-edge VFX.",
    location: "New York, NY",
    role: "VFX Artist",
    skills: ["VFX", "Motion Graphics", "3D Animation", "Creative Direction"],
    experience_level: "Senior",
    industry: "animation",
    portfolio_url: "https://alexrodriguez.vfx",
    created_at: "2024-01-05T16:45:00Z",
    is_verified: true,
    followers_count: 3200,
    projects_count: 89,
    posts_count: 56,
    likes_count: 234,
    is_liked: false,
    is_saved: true,
  },
  {
    id: "5",
    full_name: "Priya Sharma",
    email: "priya@example.com",
    avatar_url: "/placeholder/avatar5.jpg",
    bio: "Photographer and Visual Artist. Capturing moments that tell powerful stories.",
    location: "Delhi, India",
    role: "Photographer",
    skills: ["Photography", "Photo Editing", "Visual Storytelling", "Portrait Photography"],
    experience_level: "Mid",
    industry: "photography",
    website: "https://priyasharma.photography",
    created_at: "2024-04-12T11:20:00Z",
    is_verified: false,
    followers_count: 650,
    projects_count: 34,
    posts_count: 18,
    likes_count: 67,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "6",
    full_name: "Marcus Thompson",
    email: "marcus@example.com",
    avatar_url: "/placeholder/avatar6.jpg",
    bio: "Film Editor and Post-Production Specialist. Crafting compelling narratives through precise editing.",
    location: "London, UK",
    role: "Film Editor",
    skills: ["Video Editing", "Post-Production", "Color Correction", "Motion Graphics"],
    experience_level: "Senior",
    industry: "television",
    linkedin_url: "https://linkedin.com/in/marcusthompson",
    created_at: "2024-02-28T13:10:00Z",
    is_verified: true,
    followers_count: 1800,
    projects_count: 52,
    posts_count: 31,
    likes_count: 123,
    is_liked: true,
    is_saved: false,
  },
];

export default function DiscoverPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("recent");
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Fetch users from database
  useEffect(() => {
    fetchUsers();
  }, []); // Run once on mount

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          first_name,
          last_name,
          role,
          category,
          bio,
          location,
          website,
          skills,
          experience_level,
          industry,
          portfolio_url,
          linkedin_url,
          github_url,
          is_verified,
          followers_count,
          projects_count,
          posts_count,
          likes_count,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }


      if (!profiles || profiles.length === 0) {
        setUsers([]);
        return;
      }

      // Filter out admin users (include both real users and sample profiles)
      const filteredProfiles = profiles.filter(profile => {
        // Must have a first name
        if (!profile.first_name) return false;
        
        // Filter out admin users by name
        if (profile.first_name.toLowerCase().includes('admin')) return false;
        
        // Filter out admin users by role
        if (profile.role && profile.role.toLowerCase().includes('admin')) return false;
        
        return true;
      });

      // Get current user's likes and saves if authenticated
      let likedUserIds = new Set();
      let savedUserIds = new Set();
      
      if (user?.id) {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (currentProfile) {
          const [likesResult, savesResult] = await Promise.all([
            supabase
              .from('user_likes')
              .select('liked_user_id')
              .eq('user_id', currentProfile.id),
            supabase
              .from('user_saves')
              .select('saved_user_id')
              .eq('user_id', currentProfile.id)
          ]);

          likedUserIds = new Set(likesResult.data?.map(like => like.liked_user_id) || []);
          savedUserIds = new Set(savesResult.data?.map(save => save.saved_user_id) || []);
        }
      }

      // Transform data
      const usersWithInteractions: User[] = filteredProfiles.map(profile => {
        // Create full_name from first_name and last_name
        const fullName = profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}`
          : profile.first_name || 'Unknown User';
          
        return {
          id: profile.id,
          full_name: fullName,
          email: '',
          avatar_url: undefined,
          role: profile.role,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          skills: profile.skills || [],
          experience_level: profile.experience_level,
          industry: profile.industry,
          portfolio_url: profile.portfolio_url,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
          created_at: profile.created_at || new Date().toISOString(),
          is_verified: profile.is_verified || false,
          followers_count: profile.followers_count || 0,
          projects_count: profile.projects_count || 0,
          posts_count: profile.posts_count || 0,
          likes_count: profile.likes_count || 0,
          is_liked: likedUserIds.has(profile.id),
          is_saved: savedUserIds.has(profile.id),
        };
      });

      setUsers(usersWithInteractions);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let filteredUsers = [...users];

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredUsers = filteredUsers.filter((user) =>
        user.full_name.toLowerCase().includes(searchTerm) ||
        user.bio?.toLowerCase().includes(searchTerm) ||
        user.skills?.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        user.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        switch (filterType) {
          case "verified":
            return user.is_verified;
          case "new":
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(user.created_at) > thirtyDaysAgo;
          case "popular":
            return (user.followers_count || 0) > 1000;
          default:
            return true;
        }
      });
    }

    // Filter by industry
    if (industryFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.industry === industryFilter);
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      switch (sortType) {
        case "popular":
          return (b.followers_count || 0) - (a.followers_count || 0);
        case "alphabetical":
          return a.full_name.localeCompare(b.full_name);
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filteredUsers;
  }, [users, query, filterType, sortType, industryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPaging() {
    setPage(1);
  }

  // Handle connect with user
  const handleConnect = async (userId: string, userName: string) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to connect with users.",
        });
        return;
      }

      // Get current user's profile ID
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !currentProfile) {
        throw new Error('User profile not found');
      }

      // Check if connection already exists
      const { data: existingConnection, error: checkError } = await supabase
        .from('connections')
        .select('*')
        .eq('user_id', currentProfile.id)
        .eq('connected_user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingConnection) {
        toast({
          variant: "destructive",
          title: "Already Connected",
          description: `You already have a connection with ${userName}`,
        });
        return;
      }

      // Create connection request
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: currentProfile.id,
          connected_user_id: userId,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Already Connected",
            description: `You already have a connection with ${userName}`,
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Connection Request Sent",
          description: `Connection request sent to ${userName}`,
        });
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send connection request. Please try again.",
      });
    }
  };

  // Handle message user
  const handleMessage = async (userId: string, userName: string) => {
    try {
      // In production, implement messaging logic
      // Navigate to messages or open chat
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${userName}`,
      });
    } catch (error) {
      console.error('Error opening chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open chat. Please try again.",
      });
    }
  };

  // Handle like user
  const handleLike = async (userId: string, userName: string) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to like users.",
        });
        return;
      }

      // Get current user's profile ID
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !currentProfile) {
        throw new Error('User profile not found');
      }

      const currentUser = users.find(u => u.id === userId);
      const isCurrentlyLiked = currentUser?.is_liked || false;

      if (isCurrentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', currentProfile.id)
          .eq('liked_user_id', userId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('user_likes')
          .insert({
            user_id: currentProfile.id,
            liked_user_id: userId
          });

        if (error) throw error;
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { 
                ...u, 
                is_liked: !u.is_liked, 
                likes_count: u.is_liked ? (u.likes_count || 0) - 1 : (u.likes_count || 0) + 1 
              }
            : u
        )
      );
      
      toast({
        title: isCurrentlyLiked ? "User Unliked" : "User Liked",
        description: isCurrentlyLiked 
          ? `You unliked ${userName}'s profile`
          : `You liked ${userName}'s profile`,
      });
    } catch (error) {
      console.error('Error liking user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like user. Please try again.",
      });
    }
  };

  // Handle save user
  const handleSave = async (userId: string, userName: string) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to save users.",
        });
        return;
      }

      // Get current user's profile ID
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !currentProfile) {
        throw new Error('User profile not found');
      }

      const currentUser = users.find(u => u.id === userId);
      const isCurrentlySaved = currentUser?.is_saved || false;

      if (isCurrentlySaved) {
        // Unsave
        const { error } = await supabase
          .from('user_saves')
          .delete()
          .eq('user_id', currentProfile.id)
          .eq('saved_user_id', userId);

        if (error) throw error;
      } else {
        // Save
        const { error } = await supabase
          .from('user_saves')
          .insert({
            user_id: currentProfile.id,
            saved_user_id: userId
          });

        if (error) throw error;
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, is_saved: !u.is_saved }
            : u
        )
      );
      
      toast({
        title: isCurrentlySaved ? "User Unsaved" : "User Saved",
        description: isCurrentlySaved 
          ? `You unsaved ${userName}'s profile`
          : `You saved ${userName}'s profile`,
      });
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save user. Please try again.",
      });
    }
  };

  // Handle share user
  const handleShare = async (userId: string, userName: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${userName}'s Profile`,
          text: `Check out ${userName}'s profile on FilmCollab`,
          url: `${window.location.origin}/profile/${userId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/profile/${userId}`);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share profile. Please try again.",
      });
    }
  };

  const getExperienceColor = (level?: string) => {
    switch (level) {
      case "Senior":
        return "bg-green-100 text-green-800 border-green-200";
      case "Mid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Entry":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getIndustryIcon = (industry?: string) => {
    switch (industry) {
      case "film":
        return <Award className="w-4 h-4" />;
      case "television":
        return <Globe className="w-4 h-4" />;
      case "advertising":
        return <Briefcase className="w-4 h-4" />;
      case "documentary":
        return <UserIcon className="w-4 h-4" />;
      case "animation":
        return <Star className="w-4 h-4" />;
      case "photography":
        return <Heart className="w-4 h-4" />;
      case "music":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 bg-gray-50 min-h-screen p-6 -m-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Creators</h1>
              <p className="text-gray-600">
                Connect with talented filmmakers, artists, and creative professionals
              </p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, skills, or location..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
                  className="pl-10 h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 px-4 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                <Select value={filterType} onValueChange={(value) => { setFilterType(value as FilterType); resetPaging(); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="new">New Users (30 days)</SelectItem>
                    <SelectItem value="popular">Popular (1000+ followers)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <Select value={industryFilter} onValueChange={(value) => { setIndustryFilter(value as IndustryFilter); resetPaging(); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="film">Film</SelectItem>
                    <SelectItem value="television">Television</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <Select value={sortType} onValueChange={(value) => { setSortType(value as SortType); resetPaging(); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Users Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading creators...</p>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No creators found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find more creators.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-all duration-200 border-gray-200 rounded-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {user.full_name}
                          </CardTitle>
                          <div className="mt-1">
                            <span className="text-sm text-gray-600">{user.role}</span>
                            {user.location && (
                              <div className="text-sm text-gray-500 mt-1">
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Like Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(user.id, user.full_name)}
                          className={`h-8 w-8 p-0 ${user.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart className={`w-4 h-4 ${user.is_liked ? 'fill-current' : ''}`} />
                        </Button>
                        <span className="text-xs text-gray-500">{user.likes_count || 0}</span>
                        
                        {/* 3 Dots Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleSave(user.id, user.full_name)}
                              className="flex items-center gap-2"
                            >
                              <Bookmark className="w-4 h-4" />
                              {user.is_saved ? 'Unsave' : 'Save'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleShare(user.id, user.full_name)}
                              className="flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Bio */}
                    {user.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                    )}
                    
                    {/* Skills - Only show 2 skills */}
                    {user.skills && user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {user.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{user.skills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleConnect(user.id, user.full_name)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button
                        onClick={() => handleMessage(user.id, user.full_name)}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} creators
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1} 
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 px-3">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
