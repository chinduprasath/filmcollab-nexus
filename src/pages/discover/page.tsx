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
  category?: string;
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
type CategoryFilter = "all" | 
  // Film & Media Projects
  "Short Films" | "Feature Films" | "Web Series" | "Documentaries" | "Music Videos" | "Advertisements / Commercials" | "Corporate Videos" | "Theatre / Stage Plays" |
  // Direction & Production
  "Director" | "Assistant Director" | "Producer" | "Executive Producer" | "Line Producer" | "Production Manager" | "Production Assistant" |
  // Cinematography & Camera
  "Cinematographer / DOP" | "Assistant Cameraman" | "Camera Operator" | "Steadicam Operator" | "Drone Operator" | "Gaffer" | "Lighting Technician" |
  // Actors & Performers
  "Lead Actor / Actress" | "Supporting Actor / Actress" | "Child Artist" | "Theatre Artist" | "Voice Over Artist" | "Dancer" | "Stunt Artist" |
  // Writing & Creative
  "Script Writer" | "Screenplay Writer" | "Dialogue Writer" | "Lyricist" | "Storyboard Artist" |
  // Music & Sound
  "Music Director" | "Background Score Composer" | "Singer / Vocalist" | "Instrumentalist" | "Sound Engineer" | "Foley Artist" | "Dubbing / Voice Artist" |
  // Art & Design
  "Art Director" | "Set Designer" | "Costume Designer" | "Fashion Stylist" | "Makeup Artist" | "Hair Stylist" | "Graphic Designer" | "Poster Designer" |
  // Editing & Post Production
  "Video Editor" | "VFX Artist" | "Motion Graphics Designer" | "Colorist" | "DI Supervisor" | "Sound Editor" |
  // Marketing & Distribution
  "Digital Marketer" | "Public Relations (PR)" | "Social Media Manager" | "Film Distributor" |
  // Film Community & Support
  "Film Festivals" | "Workshops & Training" | "Casting Calls" | "Location Scouts" | "Film Equipment Rentals";

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    full_name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Cinematographer with 8+ years of experience in film and commercial production. Passionate about visual storytelling and creating compelling narratives through the lens.",
    location: "Los Angeles, CA",
    role: "Cinematographer",
    website: "https://sarahjohnson.com",
    skills: ["Cinematography", "Lighting", "Color Grading", "Film Production", "Visual Storytelling"],
    experience_level: "Senior",
    category: "Cinematographer / DOP",
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
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Film Director and Producer specializing in independent films and documentaries. Award-winning filmmaker with a passion for telling authentic stories.",
    location: "Mumbai, India",
    role: "Film Director",
    skills: ["Directing", "Producing", "Screenwriting", "Post-Production", "Documentary"],
    experience_level: "Mid",
    category: "Director",
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
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Sound Designer and Audio Engineer with expertise in film and game audio. Creating immersive soundscapes that enhance storytelling.",
    location: "San Francisco, CA",
    role: "Sound Designer",
    skills: ["Sound Design", "Audio Engineering", "Music Production", "Foley", "Game Audio"],
    experience_level: "Senior",
    category: "Sound Engineer",
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
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Creative Director and Visual Effects Artist. Bringing stories to life through cutting-edge VFX and innovative visual techniques.",
    location: "New York, NY",
    role: "VFX Artist",
    skills: ["VFX", "Motion Graphics", "3D Animation", "Creative Direction", "Compositing"],
    experience_level: "Senior",
    category: "VFX Artist",
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
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Photographer and Visual Artist. Capturing moments that tell powerful stories and evoke emotions through the art of photography.",
    location: "Delhi, India",
    role: "Photographer",
    skills: ["Photography", "Photo Editing", "Visual Storytelling", "Portrait Photography", "Commercial Photography"],
    experience_level: "Mid",
    category: "Graphic Designer",
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
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Film Editor and Post-Production Specialist. Crafting compelling narratives through precise editing and seamless post-production workflows.",
    location: "London, UK",
    role: "Film Editor",
    skills: ["Video Editing", "Post-Production", "Color Correction", "Motion Graphics", "Sound Design"],
    experience_level: "Senior",
    category: "Video Editor",
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
  {
    id: "7",
    full_name: "Lisa Park",
    email: "lisa@example.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Production Designer and Art Director. Creating immersive visual worlds that bring stories to life through meticulous attention to detail.",
    location: "Seoul, South Korea",
    role: "Production Designer",
    skills: ["Production Design", "Art Direction", "Set Design", "Costume Design", "Visual Development"],
    experience_level: "Mid",
    category: "Art Director",
    created_at: "2024-03-15T08:30:00Z",
    is_verified: false,
    followers_count: 750,
    projects_count: 22,
    posts_count: 12,
    likes_count: 34,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "8",
    full_name: "David Kim",
    email: "david@example.com",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "Screenwriter and Story Consultant. Crafting compelling narratives and helping filmmakers develop their stories from concept to completion.",
    location: "Toronto, Canada",
    role: "Screenwriter",
    skills: ["Screenwriting", "Story Development", "Script Consulting", "Character Development", "Dialogue Writing"],
    experience_level: "Senior",
    category: "Script Writer",
    created_at: "2024-01-22T12:15:00Z",
    is_verified: true,
    followers_count: 1450,
    projects_count: 38,
    posts_count: 28,
    likes_count: 98,
    is_liked: false,
    is_saved: true,
  },
  {
    id: "9",
    full_name: "Emma Rodriguez",
    email: "emma@example.com",
    avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    bio: "Actress and Voice Artist. Bringing characters to life through authentic performances and expressive voice work across various media.",
    location: "Austin, TX",
    role: "Actress",
    skills: ["Acting", "Voice Acting", "Character Development", "Improvisation", "Stage Performance"],
    experience_level: "Mid",
    category: "Lead Actor / Actress",
    created_at: "2024-04-05T15:45:00Z",
    is_verified: false,
    followers_count: 920,
    projects_count: 41,
    posts_count: 19,
    likes_count: 76,
    is_liked: true,
    is_saved: false,
  },
  {
    id: "10",
    full_name: "James Wilson",
    email: "james@example.com",
    avatar_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    bio: "Music Composer and Sound Designer. Creating original scores and soundscapes that enhance storytelling and emotional impact.",
    location: "Melbourne, Australia",
    role: "Music Composer",
    skills: ["Music Composition", "Sound Design", "Orchestration", "Film Scoring", "Audio Production"],
    experience_level: "Senior",
    category: "Music Director",
    created_at: "2024-02-10T09:20:00Z",
    is_verified: true,
    followers_count: 1680,
    projects_count: 55,
    posts_count: 33,
    likes_count: 142,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "11",
    full_name: "Maria Garcia",
    email: "maria@example.com",
    avatar_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
    bio: "Documentary Filmmaker and Producer. Telling important stories that matter and creating documentaries that inspire change.",
    location: "Barcelona, Spain",
    role: "Documentary Filmmaker",
    skills: ["Documentary Filmmaking", "Producing", "Research", "Interviewing", "Social Impact"],
    experience_level: "Mid",
    category: "Producer",
    created_at: "2024-03-25T11:30:00Z",
    is_verified: false,
    followers_count: 580,
    projects_count: 18,
    posts_count: 14,
    likes_count: 52,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "12",
    full_name: "Michael Chen",
    email: "michael@example.com",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Animation Director and Character Designer. Creating memorable characters and bringing animated worlds to life through innovative techniques.",
    location: "Tokyo, Japan",
    role: "Animation Director",
    skills: ["Animation", "Character Design", "Storyboarding", "3D Modeling", "Rigging"],
    experience_level: "Senior",
    category: "Motion Graphics Designer",
    created_at: "2024-01-08T14:00:00Z",
    is_verified: true,
    followers_count: 2200,
    projects_count: 72,
    posts_count: 47,
    likes_count: 189,
    is_liked: true,
    is_saved: true,
  }
];

export default function DiscoverPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("recent");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Initialize with hardcoded data
  useEffect(() => {
    setUsers(mockUsers);
  }, []);

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

    // Filter by category
    if (categoryFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.category === categoryFilter);
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
  }, [users, query, filterType, sortType, categoryFilter]);

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

      // Simulate connection request
        toast({
          title: "Connection Request Sent",
          description: `Connection request sent to ${userName}`,
        });
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

      const currentUser = users.find(u => u.id === userId);
      const isCurrentlyLiked = currentUser?.is_liked || false;
      
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

      const currentUser = users.find(u => u.id === userId);
      const isCurrentlySaved = currentUser?.is_saved || false;
      
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Entry":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return <Briefcase className="w-4 h-4" />;
    
    // Film & Media Projects
    if (category.includes("Film") || category.includes("Series") || category.includes("Documentaries")) {
        return <Award className="w-4 h-4" />;
    }
    
    // Direction & Production
    if (category.includes("Director") || category.includes("Producer")) {
        return <UserIcon className="w-4 h-4" />;
    }
    
    // Cinematography & Camera
    if (category.includes("Cinematographer") || category.includes("Camera") || category.includes("Gaffer")) {
        return <Heart className="w-4 h-4" />;
    }
    
    // Actors & Performers
    if (category.includes("Actor") || category.includes("Artist") || category.includes("Dancer")) {
      return <Star className="w-4 h-4" />;
    }
    
    // Writing & Creative
    if (category.includes("Writer") || category.includes("Lyricist")) {
        return <GraduationCap className="w-4 h-4" />;
    }
    
    // Music & Sound
    if (category.includes("Music") || category.includes("Sound") || category.includes("Singer")) {
      return <GraduationCap className="w-4 h-4" />;
    }
    
    // Art & Design
    if (category.includes("Designer") || category.includes("Stylist") || category.includes("Artist")) {
      return <Heart className="w-4 h-4" />;
    }
    
    // Editing & Post Production
    if (category.includes("Editor") || category.includes("VFX") || category.includes("Graphics")) {
      return <Globe className="w-4 h-4" />;
    }
    
    // Marketing & Distribution
    if (category.includes("Marketer") || category.includes("PR") || category.includes("Social")) {
        return <Briefcase className="w-4 h-4" />;
    }
    
    // Film Community & Support
    if (category.includes("Festival") || category.includes("Workshop") || category.includes("Casting")) {
      return <Users className="w-4 h-4" />;
    }
    
    return <Briefcase className="w-4 h-4" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6 bg-yellow-50 min-h-screen p-6 -m-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-yellow-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Creators</h1>
              <p className="text-gray-600">
                Connect with talented filmmakers, artists, and creative professionals
              </p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Search by name, skills, or location..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); resetPaging(); }}
                  className="pl-10 h-11 border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 px-4 border-yellow-200 hover:bg-yellow-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border-yellow-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                <Select value={filterType} onValueChange={(value) => { setFilterType(value as FilterType); resetPaging(); }}>
                  <SelectTrigger className="w-full border-yellow-200 focus:border-yellow-500">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value as CategoryFilter); resetPaging(); }}>
                  <SelectTrigger className="w-full border-yellow-200 focus:border-yellow-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    
                    {/* Film & Media Projects */}
                    <SelectItem value="Short Films">Short Films</SelectItem>
                    <SelectItem value="Feature Films">Feature Films</SelectItem>
                    <SelectItem value="Web Series">Web Series</SelectItem>
                    <SelectItem value="Documentaries">Documentaries</SelectItem>
                    <SelectItem value="Music Videos">Music Videos</SelectItem>
                    <SelectItem value="Advertisements / Commercials">Advertisements / Commercials</SelectItem>
                    <SelectItem value="Corporate Videos">Corporate Videos</SelectItem>
                    <SelectItem value="Theatre / Stage Plays">Theatre / Stage Plays</SelectItem>
                    
                    {/* Direction & Production */}
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Assistant Director">Assistant Director</SelectItem>
                    <SelectItem value="Producer">Producer</SelectItem>
                    <SelectItem value="Executive Producer">Executive Producer</SelectItem>
                    <SelectItem value="Line Producer">Line Producer</SelectItem>
                    <SelectItem value="Production Manager">Production Manager</SelectItem>
                    <SelectItem value="Production Assistant">Production Assistant</SelectItem>
                    
                    {/* Cinematography & Camera */}
                    <SelectItem value="Cinematographer / DOP">Cinematographer / DOP</SelectItem>
                    <SelectItem value="Assistant Cameraman">Assistant Cameraman</SelectItem>
                    <SelectItem value="Camera Operator">Camera Operator</SelectItem>
                    <SelectItem value="Steadicam Operator">Steadicam Operator</SelectItem>
                    <SelectItem value="Drone Operator">Drone Operator</SelectItem>
                    <SelectItem value="Gaffer">Gaffer</SelectItem>
                    <SelectItem value="Lighting Technician">Lighting Technician</SelectItem>
                    
                    {/* Actors & Performers */}
                    <SelectItem value="Lead Actor / Actress">Lead Actor / Actress</SelectItem>
                    <SelectItem value="Supporting Actor / Actress">Supporting Actor / Actress</SelectItem>
                    <SelectItem value="Child Artist">Child Artist</SelectItem>
                    <SelectItem value="Theatre Artist">Theatre Artist</SelectItem>
                    <SelectItem value="Voice Over Artist">Voice Over Artist</SelectItem>
                    <SelectItem value="Dancer">Dancer</SelectItem>
                    <SelectItem value="Stunt Artist">Stunt Artist</SelectItem>
                    
                    {/* Writing & Creative */}
                    <SelectItem value="Script Writer">Script Writer</SelectItem>
                    <SelectItem value="Screenplay Writer">Screenplay Writer</SelectItem>
                    <SelectItem value="Dialogue Writer">Dialogue Writer</SelectItem>
                    <SelectItem value="Lyricist">Lyricist</SelectItem>
                    <SelectItem value="Storyboard Artist">Storyboard Artist</SelectItem>
                    
                    {/* Music & Sound */}
                    <SelectItem value="Music Director">Music Director</SelectItem>
                    <SelectItem value="Background Score Composer">Background Score Composer</SelectItem>
                    <SelectItem value="Singer / Vocalist">Singer / Vocalist</SelectItem>
                    <SelectItem value="Instrumentalist">Instrumentalist</SelectItem>
                    <SelectItem value="Sound Engineer">Sound Engineer</SelectItem>
                    <SelectItem value="Foley Artist">Foley Artist</SelectItem>
                    <SelectItem value="Dubbing / Voice Artist">Dubbing / Voice Artist</SelectItem>
                    
                    {/* Art & Design */}
                    <SelectItem value="Art Director">Art Director</SelectItem>
                    <SelectItem value="Set Designer">Set Designer</SelectItem>
                    <SelectItem value="Costume Designer">Costume Designer</SelectItem>
                    <SelectItem value="Fashion Stylist">Fashion Stylist</SelectItem>
                    <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                    <SelectItem value="Hair Stylist">Hair Stylist</SelectItem>
                    <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                    <SelectItem value="Poster Designer">Poster Designer</SelectItem>
                    
                    {/* Editing & Post Production */}
                    <SelectItem value="Video Editor">Video Editor</SelectItem>
                    <SelectItem value="VFX Artist">VFX Artist</SelectItem>
                    <SelectItem value="Motion Graphics Designer">Motion Graphics Designer</SelectItem>
                    <SelectItem value="Colorist">Colorist</SelectItem>
                    <SelectItem value="DI Supervisor">DI Supervisor</SelectItem>
                    <SelectItem value="Sound Editor">Sound Editor</SelectItem>
                    
                    {/* Marketing & Distribution */}
                    <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
                    <SelectItem value="Public Relations (PR)">Public Relations (PR)</SelectItem>
                    <SelectItem value="Social Media Manager">Social Media Manager</SelectItem>
                    <SelectItem value="Film Distributor">Film Distributor</SelectItem>
                    
                    {/* Film Community & Support */}
                    <SelectItem value="Film Festivals">Film Festivals</SelectItem>
                    <SelectItem value="Workshops & Training">Workshops & Training</SelectItem>
                    <SelectItem value="Casting Calls">Casting Calls</SelectItem>
                    <SelectItem value="Location Scouts">Location Scouts</SelectItem>
                    <SelectItem value="Film Equipment Rentals">Film Equipment Rentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <Select value={sortType} onValueChange={(value) => { setSortType(value as SortType); resetPaging(); }}>
                  <SelectTrigger className="w-full border-yellow-200 focus:border-yellow-500">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
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
                          <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold">
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
                          <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
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
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
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
