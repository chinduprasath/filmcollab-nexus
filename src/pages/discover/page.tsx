"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  ChevronDown,
  X,
  Check,
  Clock,
  UserCheck,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories: string[] = [
  // Film & Media Projects
  "Short Films", "Feature Films", "Web Series", "Documentaries", "Music Videos", "Advertisements / Commercials", "Corporate Videos", "Theatre / Stage Plays",
  // Direction & Production
  "Director", "Assistant Director", "Producer", "Executive Producer", "Line Producer", "Production Manager", "Production Assistant",
  // Cinematography & Camera
  "Cinematographer / DOP", "Assistant Cameraman", "Camera Operator", "Steadicam Operator", "Drone Operator", "Gaffer", "Lighting Technician",
  // Actors & Performers
  "Lead Actor / Actress", "Supporting Actor / Actress", "Child Artist", "Theatre Artist", "Voice Over Artist", "Dancer", "Stunt Artist",
  // Writing & Creative
  "Script Writer", "Screenplay Writer", "Dialogue Writer", "Lyricist", "Storyboard Artist",
  // Music & Sound
  "Music Director", "Background Score Composer", "Singer / Vocalist", "Instrumentalist", "Sound Engineer", "Foley Artist", "Dubbing / Voice Artist",
  // Art & Design
  "Art Director", "Set Designer", "Costume Designer", "Fashion Stylist", "Makeup Artist", "Hair Stylist", "Graphic Designer", "Poster Designer",
  // Editing & Post Production
  "Video Editor", "VFX Artist", "Motion Graphics Designer", "Colorist", "DI Supervisor", "Sound Editor",
  // Marketing & Distribution
  "Digital Marketer", "Public Relations (PR)", "Social Media Manager", "Film Distributor",
  // Film Community & Support
  "Film Festivals", "Workshops & Training", "Casting Calls", "Location Scouts", "Film Equipment Rentals"
];

interface User {
  id: string;
  full_name: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  role?: string;
  website?: string;
  skills?: string[];
  tags?: string[];
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
  connection_status?: string | null;
  connection_initiator?: string | null;
  allow_connections_from?: string;
  total_experience?: string;
  price_per_day?: number;
  price_per_hour?: number;
  price_negotiable?: boolean;
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
    tags: ["Featured", "Expert"],
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
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("recent");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minLikes, setMinLikes] = useState(0);
  const [currentTab, setCurrentTab] = useState<"discover" | "liked" | "saved">("discover");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*, settings(privacy_settings)");

      if (profilesError) {
        throw profilesError;
      }

      let likedUserIds: string[] = [];
      let savedUserIds: string[] = [];
      
      interface DBConnection {
        id: string;
        user_id: string;
        connected_user_id: string;
        status: string;
        created_at?: string;
        updated_at?: string;
      }
      let connectionsData: DBConnection[] = [];

      if (profile?.id) {
        const { data: likesData } = await supabase
          .from("user_likes")
          .select("liked_user_id")
          .eq("user_id", profile.id);

        if (likesData) {
          likedUserIds = likesData.map(l => l.liked_user_id);
        }

        const { data: savesData } = await supabase
          .from("user_saves")
          .select("saved_user_id")
          .eq("user_id", profile.id);

        if (savesData) {
          savedUserIds = savesData.map(s => s.saved_user_id);
        }

        const { data: connData } = await supabase
          .from("connections")
          .select("*")
          .or(`user_id.eq.${profile.id},connected_user_id.eq.${profile.id}`);

        if (connData) {
          connectionsData = connData;
        }
      }

      interface DBProfile {
        id: string;
        user_id: string | null;
        full_name?: string | null;
        username?: string | null;
        email?: string | null;
        avatar_url?: string | null;
        bio?: string | null;
        location?: string | null;
        role?: string | null;
        website?: string | null;
        skills?: string[] | null;
        tags?: string[] | null;
        experience_level?: string | null;
        category?: string | null;
        portfolio_url?: string | null;
        linkedin_url?: string | null;
        created_at?: string | null;
        is_verified?: boolean | null;
        followers_count?: number | null;
        projects_count?: number | null;
        posts_count?: number | null;
        likes_count?: number | null;
        total_experience?: string | null;
        price_per_day?: number | null;
        price_per_hour?: number | null;
        price_negotiable?: boolean | null;
        settings?: any[];
      }

      const mappedUsers: User[] = ((profilesData as DBProfile[]) || [])
        .filter((p: DBProfile) => {
          // Exclude logged-in user profile from discover list
          if (profile?.id && p.id === profile.id) return false;
          if (user?.id && p.user_id === user.id) return false;
          // Exclude admins
          const roleLower = (p.role || "").toLowerCase();
          if (roleLower === "admin") return false;
          // Check profile visibility from settings
          const privacySettings = Array.isArray(p.settings) 
            ? (p.settings.length > 0 ? p.settings[0].privacy_settings : null)
            : (p.settings ? (p.settings as any).privacy_settings : null);
          const visibility = privacySettings?.profileVisibility || 'public';
          if (visibility !== 'public') return false;
          return true;
        })
        .map((p: DBProfile) => {
          const conn = connectionsData.find(c => 
            (c.user_id === profile?.id && c.connected_user_id === p.id) || 
            (c.user_id === p.id && c.connected_user_id === profile?.id)
          );
          return {
            id: p.id,
            user_id: p.user_id || undefined,
            full_name: p.full_name || p.username || "Anonymous",
            username: p.username || "",
            email: p.email || "",
            avatar_url: p.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            bio: p.bio || "",
            location: p.location || "",
            role: p.category || p.role || "Creator",
            website: p.website || "",
            skills: p.skills || [],
            tags: p.tags || [],
            experience_level: p.experience_level || "Entry",
            category: p.category || "",
            portfolio_url: p.portfolio_url || "",
            linkedin_url: p.linkedin_url || "",
            created_at: p.created_at || new Date().toISOString(),
            is_verified: p.is_verified || false,
            followers_count: p.followers_count || 0,
            projects_count: p.projects_count || 0,
            posts_count: p.posts_count || 0,
            likes_count: p.likes_count || 0,
            is_liked: likedUserIds.includes(p.id),
            is_saved: savedUserIds.includes(p.id),
            connection_status: conn?.status || null,
            connection_initiator: conn?.user_id || null,
            total_experience: p.total_experience || null,
            price_per_day: p.price_per_day || null,
            price_per_hour: p.price_per_hour || null,
            price_negotiable: p.price_negotiable || null,
            allow_connections_from: Array.isArray(p.settings) 
              ? (p.settings.length > 0 ? p.settings[0].privacy_settings?.allowConnectionRequests : null)
              : (p.settings ? (p.settings as any).privacy_settings?.allowConnectionRequests : null),
          };
        });

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching discover users:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch creators from the database.",
      });
    } finally {
      setLoading(false);
    }
  }, [profile?.id, user?.id, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [categoriesList, setCategoriesList] = useState<string[]>(categories);

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
        if (data && data.length > 0) {
          const names = data.map((item) => item.name);
          setCategoriesList(names);
        }
      } catch (err) {
        console.error("Error in fetchDBCategories:", err);
      }
    };
    fetchDBCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categoriesList;
    const term = categorySearch.toLowerCase();
    return categoriesList.filter((cat) => cat.toLowerCase().includes(term));
  }, [categorySearch, categoriesList]);

  const handleToggleCategory = (category: string) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    resetPaging();
  };

  const filtered = useMemo(() => {
    let filteredUsers = [...users];

    // Filter out logged-in user profile from discover list
    if (profile?.id) {
      filteredUsers = filteredUsers.filter((u) => u.id !== profile.id);
    } else if (user?.id) {
      filteredUsers = filteredUsers.filter((u) => u.user_id !== user.id);
    }

    // Filter by tab
    if (currentTab === "liked") {
      filteredUsers = filteredUsers.filter((u) => u.is_liked);
    } else if (currentTab === "saved") {
      filteredUsers = filteredUsers.filter((u) => u.is_saved);
    }

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredUsers = filteredUsers.filter((u) =>
        u.full_name.toLowerCase().includes(searchTerm) ||
        u.username?.toLowerCase().includes(searchTerm) ||
        u.role?.toLowerCase().includes(searchTerm) ||
        u.bio?.toLowerCase().includes(searchTerm) ||
        u.skills?.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        u.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filteredUsers = filteredUsers.filter((u) => {
        switch (filterType) {
          case "verified":
            return u.is_verified;
          case "new": {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(u.created_at) > thirtyDaysAgo;
          }
          case "popular":
            return (u.followers_count || 0) > 1000;
          default:
            return true;
        }
      });
    }

    // Filter by category (multi-select)
    if (categoryFilters.length > 0) {
      filteredUsers = filteredUsers.filter((u) => u.category && categoryFilters.includes(u.category));
    }

    // Filter by location
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase();
      filteredUsers = filteredUsers.filter((u) =>
        u.location?.toLowerCase().includes(loc)
      );
    }

    // Filter by likes (slider)
    if (minLikes > 0) {
      filteredUsers = filteredUsers.filter((u) => (u.likes_count || 0) >= minLikes);
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
  }, [users, currentTab, query, filterType, sortType, categoryFilters, locationFilter, minLikes, profile?.id, user?.id]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPaging() {
    setPage(1);
  }

  // Handle connect with user
  const handleConnect = async (userId: string, userName: string, currentStatus?: string | null, initiatorId?: string | null) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to connect with users.",
        });
        return;
      }

      if (!profile?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Your user profile could not be found.",
        });
        return;
      }

      if (currentStatus === "accepted") {
        toast({
          title: "Connected",
          description: `You are already connected with ${userName}.`,
        });
        return;
      }

      if (currentStatus === "pending") {
        if (initiatorId && initiatorId !== profile.id) {
          // Accept connection request!
          const { error: updateError } = await supabase
            .from("connections")
            .update({ status: "accepted" })
            .match({ user_id: initiatorId, connected_user_id: profile.id });

          if (updateError) throw updateError;

          toast({
            title: "Connection Request Accepted",
            description: `You are now connected with ${userName}!`,
          });
          
          // Insert notification for the initiator
          await supabase.from("notifications").insert({
            user_id: initiatorId,
            title: "Connection Accepted",
            description: `${profile.full_name || profile.username || 'Someone'} accepted your connection request.`,
            type: "connection",
            action_url: `/profile/${profile.id}`
          });
          
          fetchUsers(); // Refresh users
          return;
        } else {
          toast({
            title: "Request Pending",
            description: `Your connection request to ${userName} is still pending.`,
          });
          return;
        }
      }

      // Check if connection already exists in DB
      const { data: existingConnection, error: checkError } = await supabase
        .from("connections")
        .select("*")
        .or(`and(user_id.eq.${profile.id},connected_user_id.eq.${userId}),and(user_id.eq.${userId},connected_user_id.eq.${profile.id})`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingConnection) {
        toast({
          title: "Connection Already Exists",
          description: `You already have a connection status of '${existingConnection.status}' with ${userName}.`,
        });
        fetchUsers();
        return;
      }

      // Create a pending connection request
      const { error: insertError } = await supabase
        .from("connections")
        .insert({
          user_id: profile.id,
          connected_user_id: userId,
          status: "pending",
        });

      if (insertError) throw insertError;

      toast({
        title: "Connection Request Sent",
        description: `Connection request sent to ${userName}`,
      });
      
      // Insert notification for the recipient
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "New Connection Request",
        description: `${profile.full_name || profile.username || 'Someone'} sent you a connection request.`,
        type: "connection",
        action_url: `/profile/${profile.id}`
      });
      
      fetchUsers(); // Refresh to update UI state
    } catch (error) {
      console.error('Error in handleConnect:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform connection action. Please try again.",
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

      if (!profile?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Your user profile could not be found.",
        });
        return;
      }

      const currentUserItem = users.find(u => u.id === userId);
      const isCurrentlyLiked = currentUserItem?.is_liked || false;

      if (isCurrentlyLiked) {
        // Remove notification if unliked
        await supabase
          .from("notifications")
          .delete()
          .eq("user_id", userId)
          .eq("action_url", `/profile/${profile.id}`)
          .eq("type", "profile");
        
        // Unliking
        const { error: deleteError } = await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", profile.id)
          .eq("liked_user_id", userId);

        if (deleteError) throw deleteError;

        const currentLikesCount = currentUserItem?.likes_count || 0;
        const newLikesCount = Math.max(0, currentLikesCount - 1);
        
        // Update DB
        await supabase
          .from("profiles")
          .update({ likes_count: newLikesCount })
          .eq("id", userId);

        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, is_liked: false, likes_count: newLikesCount }
              : u
          )
        );
      } else {
        // Liking
        const { error: insertError } = await supabase
          .from("user_likes")
          .insert({
            user_id: profile.id,
            liked_user_id: userId,
          });

        if (insertError) throw insertError;
        
        // Add notification for the user
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "New Profile Like",
          description: `${profile.full_name || profile.username || 'Someone'} liked your profile.`,
          type: "profile",
          action_url: `/profile/${profile.id}`
        });

        const currentLikesCount = currentUserItem?.likes_count || 0;
        const newLikesCount = currentLikesCount + 1;

        // Update DB
        await supabase
          .from("profiles")
          .update({ likes_count: newLikesCount })
          .eq("id", userId);

        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, is_liked: true, likes_count: newLikesCount }
              : u
          )
        );
      }

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

      if (!profile?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Your user profile could not be found.",
        });
        return;
      }

      const currentUserItem = users.find(u => u.id === userId);
      const isCurrentlySaved = currentUserItem?.is_saved || false;

      if (isCurrentlySaved) {
        // Unsaving
        const { error: deleteError } = await supabase
          .from("user_saves")
          .delete()
          .eq("user_id", profile.id)
          .eq("saved_user_id", userId);

        if (deleteError) throw deleteError;

        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, is_saved: false }
              : u
          )
        );
      } else {
        // Saving
        const { error: insertError } = await supabase
          .from("user_saves")
          .insert({
            user_id: profile.id,
            saved_user_id: userId,
          });

        if (insertError) throw insertError;

        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, is_saved: true }
              : u
          )
        );
      }

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
      <div className="space-y-6 bg-yellow-50/50 dark:bg-background min-h-screen p-6 -m-6 transition-colors duration-200">
        {/* Header */}
        <div className="bg-white dark:bg-background p-6 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-sans tracking-tight">Discover Creators</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
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
                  className="pl-10 h-11 border-yellow-200 dark:border-yellow-900/40 rounded-lg focus:border-yellow-500 focus:ring-yellow-500 bg-white dark:bg-background dark:text-white"
                />
              </div>
              
              {/* Filter Sheet (Right Sidebar) */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-4 border-yellow-200 dark:border-yellow-900/40 hover:!bg-yellow-50 dark:hover:!bg-yellow-950/25 hover:!text-yellow-600 dark:hover:!text-yellow-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-background relative shrink-0 animate-fade-in"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(filterType !== "all" || categoryFilters.length > 0 || locationFilter || minLikes > 0 || sortType !== "recent") && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-white dark:bg-background border-l border-yellow-200 dark:border-yellow-900/40 p-0">
                  <div className="p-6 border-b border-yellow-100 dark:border-yellow-900/20 flex items-center justify-between">
                    <div>
                      <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white">Filter Creators</SheetTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Refine your creative connections</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterType("all");
                        setCategoryFilters([]);
                        setLocationFilter("");
                        setMinLikes(0);
                        setSortType("recent");
                        resetPaging();
                      }}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 font-medium"
                    >
                      Reset All
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6 pb-8">
                      {/* Filter by Type */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Filter by Type</label>
                        <Select value={filterType} onValueChange={(value) => { setFilterType(value as FilterType); resetPaging(); }}>
                          <SelectTrigger className="w-full border-yellow-200 dark:border-yellow-900/40 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-background border-yellow-100 dark:border-yellow-900/40 text-gray-900 dark:text-white">
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="verified">Verified Only</SelectItem>
                            <SelectItem value="new">New Users (30 days)</SelectItem>
                            <SelectItem value="popular">Popular (1000+ followers)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort by */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Sort by</label>
                        <Select value={sortType} onValueChange={(value) => { setSortType(value as SortType); resetPaging(); }}>
                          <SelectTrigger className="w-full border-yellow-200 dark:border-yellow-900/40 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white text-sm">
                            <SelectValue placeholder="Select sort" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-background border-yellow-100 dark:border-yellow-900/40 text-gray-900 dark:text-white">
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="alphabetical">Alphabetical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="e.g. Austin, Toronto, Delhi..."
                            value={locationFilter}
                            onChange={(e) => { setLocationFilter(e.target.value); resetPaging(); }}
                            className="pl-9 border-yellow-200 dark:border-yellow-900/40 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white text-sm h-10"
                          />
                        </div>
                      </div>

                      {/* Likes Count Slider */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Minimum Likes</label>
                          <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400 px-2.5 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-900/30">
                            {minLikes}+ Likes
                          </span>
                        </div>
                        <Slider
                          value={[minLikes]}
                          onValueChange={(val) => { setMinLikes(val[0]); resetPaging(); }}
                          max={250}
                          step={5}
                          className="py-2 animate-pulse-slow"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                          <span>0</span>
                          <span>125</span>
                          <span>250</span>
                        </div>
                      </div>

                      {/* Category (Multi-select) */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase block">Categories</label>
                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between border-yellow-200 dark:border-yellow-900/40 text-left font-normal hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 bg-white dark:bg-background text-gray-700 dark:text-gray-300 text-sm h-10"
                            >
                              <span className="truncate">
                                {categoryFilters.length === 0
                                  ? "Select Categories..."
                                  : `${categoryFilters.length} Selected`}
                              </span>
                              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] p-0 bg-white dark:bg-background border border-yellow-200 dark:border-yellow-900/40 shadow-lg" align="start">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  placeholder="Search categories..."
                                  value={categorySearch}
                                  onChange={(e) => setCategorySearch(e.target.value)}
                                  className="pl-8 h-8 text-xs border-yellow-100 dark:border-yellow-900/40 focus:ring-yellow-500 bg-white dark:bg-background text-gray-900 dark:text-white"
                                />
                              </div>
                              {categoryFilters.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCategoryFilters([])}
                                  className="h-8 px-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  Clear
                                </Button>
                              )}
                            </div>
                            <div className="h-60 overflow-y-auto p-2" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                              <div className="space-y-0.5">
                                {filteredCategories.map((cat) => {
                                  const isChecked = categoryFilters.includes(cat);
                                  return (
                                    <div
                                      key={cat}
                                      onClick={() => handleToggleCategory(cat)}
                                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/40 cursor-pointer transition-colors"
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => handleToggleCategory(cat)}
                                        className="border-yellow-400 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white h-4 w-4"
                                      />
                                      <span className="text-xs text-gray-700 dark:text-gray-300">{cat}</span>
                                    </div>
                                  );
                                })}
                                {filteredCategories.length === 0 && (
                                  <p className="text-center text-xs text-gray-500 py-4">No categories found</p>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                         {categoryFilters.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto mt-2 p-1.5 border border-dashed border-yellow-200 dark:border-yellow-900/40 rounded-md bg-yellow-50/30 dark:bg-yellow-950/20">
                            {categoryFilters.map((cat) => (
                              <Badge
                                key={cat}
                                variant="secondary"
                                className="text-[10px] bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30 pr-1 flex items-center gap-1"
                              >
                                {cat}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleCategory(cat);
                                  }}
                                  className="rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/40 p-0.5"
                                >
                                  <X className="w-2.5 h-2.5 text-yellow-700 dark:text-yellow-400" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex justify-between items-center bg-white dark:bg-background p-2 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
          <Tabs value={currentTab} onValueChange={(val) => { setCurrentTab(val as "discover" | "liked" | "saved"); resetPaging(); }} className="w-full sm:w-auto">
            <TabsList className="bg-yellow-50/50 dark:bg-background border border-yellow-100 dark:border-yellow-900/40 p-1">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 text-sm px-4 py-2 font-medium transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 text-sm px-4 py-2 font-medium transition-all"
              >
                <Heart className="w-4 h-4 mr-2" />
                Liked
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 text-sm px-4 py-2 font-medium transition-all"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-2 hidden sm:block font-mono">
            {filtered.length} {filtered.length === 1 ? 'Creator' : 'Creators'} found
          </div>
        </div>

        {/* Users Grid */}
        <div className="bg-white dark:bg-background rounded-lg shadow-sm p-6 border border-yellow-100 dark:border-yellow-900/40">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Loading creators...</p>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No creators found</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Try adjusting your search or filters to find more creators.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((userItem) => (
                <Card key={userItem.id} className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border border-yellow-100 dark:border-yellow-900/40">
                            <AvatarImage src={userItem.avatar_url} alt={userItem.full_name} />
                            <AvatarFallback className="bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                              {userItem.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{userItem.full_name}</span>
                              {userItem.tags?.map(skill => {
                                const tagConfig = [
                                  { label: "Verified", color: "bg-blue-50 text-blue-700 border-blue-200" },
                                  { label: "Popular", color: "bg-green-50 text-green-700 border-green-200" },
                                  { label: "Featured", color: "bg-purple-50 text-purple-700 border-purple-200" },
                                  { label: "Trending", color: "bg-orange-50 text-orange-700 border-orange-200" },
                                  { label: "Expert", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                                  { label: "Mentor", color: "bg-pink-50 text-pink-700 border-pink-200" },
                                  { label: "Influencer", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
                                  { label: "Rising Star", color: "bg-amber-50 text-amber-700 border-amber-200" }
                                ].find(t => t.label === skill);
                                if (!tagConfig) return null;
                                return (
                                  <Badge key={skill} variant="outline" className={`${tagConfig.color} text-[10px] px-2 py-0.5 rounded-full font-medium h-fit leading-tight`}>
                                    {skill}
                                  </Badge>
                                );
                              })}
                            </CardTitle>
                            <div className="mt-1 flex flex-col">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium flex-wrap">
                                <span className="text-yellow-600 dark:text-yellow-500 font-semibold flex items-center gap-1.5">
                                  @{userItem.username || userItem.full_name.toLowerCase().replace(/\s+/g, "")}
                                </span>
                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                <span className="text-gray-600 dark:text-gray-300 truncate">{userItem.role}</span>
                              </div>
                              {userItem.location && (
                                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-0.5 truncate">
                                  <MapPin className="w-3 h-3 mr-0.5 text-gray-300 dark:text-gray-600" />
                                  {userItem.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* Like Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(userItem.id, userItem.full_name)}
                            className={`h-8 w-8 p-0 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-full transition-colors ${userItem.is_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 dark:text-gray-500 hover:text-red-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${userItem.is_liked ? 'fill-current animate-bounce-short' : ''}`} />
                          </Button>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 font-mono">{userItem.likes_count || 0}</span>
                          
                          {/* 3 Dots Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-background border border-gray-100 dark:border-gray-800 shadow-md text-gray-900 dark:text-white">
                              <DropdownMenuItem 
                                onClick={() => handleSave(userItem.id, userItem.full_name)}
                                className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20"
                              >
                                <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                {userItem.is_saved ? 'Unsave' : 'Save'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleShare(userItem.id, userItem.full_name)}
                                className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20"
                              >
                                <Share2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Bio */}
                      {userItem.bio && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{userItem.bio}</p>
                      )}
                      
                      {/* Pricing and Experience */}
                      {(userItem.total_experience || userItem.price_per_day || userItem.price_per_hour) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {userItem.total_experience && (
                            <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                              <Briefcase className="w-3 h-3 text-gray-500" />
                              {userItem.total_experience}
                            </span>
                          )}
                          {(userItem.price_per_day || userItem.price_per_hour) && (
                            <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-md border border-yellow-200 dark:border-yellow-800/50">
                              <Award className="w-3 h-3" />
                              {userItem.price_per_hour ? `₹${userItem.price_per_hour}/hr` : ''}
                              {userItem.price_per_hour && userItem.price_per_day ? ' • ' : ''}
                              {userItem.price_per_day ? `₹${userItem.price_per_day}/day` : ''}
                              {userItem.price_negotiable ? ' (Neg.)' : ''}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Skills - Only show 2 skills */}
                      {userItem.skills && userItem.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {userItem.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-[10px] bg-yellow-50/40 dark:bg-yellow-950/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30">
                              {skill}
                            </Badge>
                          ))}
                          {userItem.skills.length > 2 && (
                            <Badge variant="outline" className="text-[10px] bg-gray-50 dark:bg-background text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800">
                              +{userItem.skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </div>
                  
                  <CardContent className="pt-0 pb-4">
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {userItem.id !== user?.id && (
                        userItem.connection_status === "accepted" ? (
                          <Button
                            className="flex-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/40 hover:bg-green-100 dark:hover:bg-green-950/30 font-medium text-xs h-9 transition-all cursor-default"
                            size="sm"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Connected
                          </Button>
                        ) : userItem.connection_status === "pending" ? (
                          userItem.connection_initiator === profile?.id ? (
                            <Button
                              className="flex-1 bg-gray-100 dark:bg-background text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 font-medium text-xs h-9 cursor-not-allowed"
                              size="sm"
                              disabled
                            >
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              Request Sent
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleConnect(userItem.id, userItem.full_name, userItem.connection_status, userItem.connection_initiator)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-xs transition-all h-9"
                              size="sm"
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                              Accept Request
                            </Button>
                          )
                        ) : (
                          <Button
                            onClick={() => handleConnect(userItem.id, userItem.full_name, userItem.connection_status, userItem.connection_initiator)}
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium text-xs transition-all h-9 disabled:opacity-50"
                            size="sm"
                            disabled={userItem.allow_connections_from === 'none' || userItem.allow_connections_from === 'connections'}
                          >
                            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                            Connect
                          </Button>
                        )
                      )}
                      <Button
                        onClick={() => navigate(`/profile/${userItem.id}`)}
                        variant="outline"
                        className={`${userItem.id === user?.id ? "w-full" : "flex-1"} border-gray-300 dark:border-gray-700 bg-white dark:bg-background text-gray-700 dark:text-gray-200 hover:!bg-yellow-50 hover:!text-yellow-700 hover:!border-yellow-300 dark:hover:!bg-yellow-950/30 dark:hover:!text-yellow-400 dark:hover:!border-yellow-900/40 font-medium text-xs h-9 transition-all`}
                        size="sm"
                      >
                        <UserIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        View Profile
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
          <div className="bg-white dark:bg-background p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/40">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium font-mono">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} creators
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1} 
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-xs h-8"
                >
                  Previous
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold px-3 font-mono">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-xs h-8"
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
