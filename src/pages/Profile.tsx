"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Camera,
  Mic,
  PenTool,
  Scissors,
  Music,
  Palette,
  Building2,
  Award,
  Star,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Eye,
  Plus,
  Settings,
  Bell,
  UserCheck,
  UserX,
  UserPlus,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Trophy,
  FileText,
  Image as ImageIcon,
  Video,
  FileText as FileIcon,
  Music as MusicIcon,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface ProfileData {
  id: string;
  user_id?: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  role: string;
  company?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  joinedDate: string;
  verified: boolean;
  online: boolean;
  stats: {
    connections: number;
    projects: number;
    posts: number;
    followers: number;
  };
  skills: string[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  recentActivity: Activity[];
  portfolio: PortfolioItem[];
  directoryFiles: DirectoryFile[];
  systemRole?: "user" | "admin";
}

export interface DirectoryFile {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "audio";
  url: string;
  uploadDate: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "award" | "certification" | "publication" | "recognition";
}

interface Activity {
  id: string;
  type: "post" | "project" | "connection" | "achievement";
  title: string;
  description: string;
  date: string;
  icon: React.ComponentType<any>;
}

interface PortfolioItem {
  id: string;
  title: string;
  type: "image" | "video" | "document" | "audio";
  thumbnail: string;
  description: string;
  date: string;
  views: number;
  likes: number;
}

const emptyProfileData: ProfileData = {
  id: "",
  user_id: "",
  name: "",
  username: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  avatar: "",
  coverImage: "",
  role: "",
  company: "",
  website: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  youtube: "",
  joinedDate: new Date().toISOString(),
  verified: false,
  online: true,
  stats: { connections: 0, projects: 0, posts: 0, followers: 0 },
  skills: [],
  experience: [],
  education: [],
  achievements: [],
  recentActivity: [],
  portfolio: [],
};

// Map DB profile row -> ProfileData
function rowToProfile(row: any, authEmail?: string | null): ProfileData {
  return {
    id: row?.id ?? "",
    user_id: row?.user_id ?? "",
    name: row?.full_name ?? [row?.first_name, row?.last_name].filter(Boolean).join(" ").trim() ?? "",
    username: row?.username ?? "",
    email: row?.email ?? authEmail ?? "",
    phone: row?.phone ?? "",
    location: row?.location ?? "",
    bio: row?.bio ?? "",
    avatar: row?.avatar_url ?? "",
    coverImage: row?.cover_image_url ?? "",
    role: row?.category || row?.role || "Creator", // Map DB's category to UI's role (creative profession)
    company: row?.company ?? "",
    website: row?.website ?? "",
    linkedin: row?.linkedin_url ?? "",
    twitter: row?.twitter_url ?? "",
    instagram: row?.instagram_url ?? "",
    youtube: row?.youtube_url ?? "",
    joinedDate: row?.created_at ?? new Date().toISOString(),
    verified: !!row?.is_verified,
    online: true,
    stats: {
      connections: row?.followers_count ?? 0,
      projects: row?.projects_count ?? 0,
      posts: row?.posts_count ?? 0,
      followers: row?.followers_count ?? 0,
    },
    skills: Array.isArray(row?.skills) ? row.skills : [],
    experience: Array.isArray(row?.experiences) ? row.experiences : [],
    education: Array.isArray(row?.education) ? row.education : [],
    achievements: Array.isArray(row?.achievements) ? row.achievements : [],
    portfolio: Array.isArray(row?.portfolio) ? row.portfolio : [],
    recentActivity: [],
    systemRole: (row?.role === "admin" || row?.role === "ADMIN") ? "admin" : "user",
  };
}

function profileToRow(p: ProfileData, userId: string) {
  const [first_name, ...rest] = (p.name || "").split(" ");
  const last_name = rest.join(" ");
  return {
    user_id: userId,
    full_name: p.name || null,
    first_name: first_name || null,
    last_name: last_name || null,
    username: p.username || null,
    email: p.email || null,
    phone: p.phone || null,
    location: p.location || null,
    bio: p.bio || null,
    avatar_url: p.avatar || null,
    cover_image_url: p.coverImage || null,
    role: p.systemRole || "user", // Save system role 'user' or 'admin' in database
    category: p.role || "Creator", // Save UI's role (creative profession e.g. Writer, Actor) in database
    company: p.company || null,
    website: p.website || null,
    linkedin_url: p.linkedin || null,
    twitter_url: p.twitter || null,
    instagram_url: p.instagram || null,
    youtube_url: p.youtube || null,
    skills: p.skills ?? [],
    experiences: p.experience ?? [],
    education: p.education ?? [],
    achievements: p.achievements ?? [],
    portfolio: p.portfolio ?? [],
    updated_at: new Date().toISOString(),
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(emptyProfileData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(emptyProfileData);
  const [expandedEditExperience, setExpandedEditExperience] = useState<Set<string>>(new Set());
  const [expandedEditAchievements, setExpandedEditAchievements] = useState<Set<string>>(new Set());
  const [expandedEditEducation, setExpandedEditEducation] = useState<Set<string>>(new Set());
  const [skillsInput, setSkillsInput] = useState("");
  const [directoryFiles, setDirectoryFiles] = useState<DirectoryFile[]>([]);
  const [directoryPage, setDirectoryPage] = useState(1);
  const [directoryFilter, setDirectoryFilter] = useState<"all"|"document"|"image"|"video"|"audio">("all");
  const directoryFileInputRef = React.useRef<HTMLInputElement>(null);
  const directoryMainFileInputRef = React.useRef<HTMLInputElement>(null);

  const userIdParam = routeId || searchParams.get("id");
  const usernameParam = searchParams.get("u");

  const isOwnProfile = !userIdParam && !usernameParam || (profile.user_id === user?.id) || (profile.id === user?.id);

  // Load profile from database
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      
      let actualUserIdParam = userIdParam;
      if (actualUserIdParam === "undefined" || actualUserIdParam === "null") {
        actualUserIdParam = undefined;
      }

      let query = supabase.from("profiles").select("*");
      if (actualUserIdParam) {
        const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualUserIdParam);
        if (isValidUuid) {
          query = query.or(`user_id.eq.${actualUserIdParam},id.eq.${actualUserIdParam}`);
        } else {
          query = query.eq("username", actualUserIdParam);
        }
      } else if (usernameParam) {
        query = query.eq("username", usernameParam);
      } else {
        query = query.eq("user_id", user.id);
      }
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Profile load error", error);
        toast({ title: "Failed to load profile", description: error.message, variant: "destructive" });
      }

      if (data) {
        const mapped = rowToProfile(data, user.email);
        setProfile(mapped);
        setEditForm(mapped);
      } else {
        // No profile yet — seed with auth email so user can edit/save
        const seeded = { ...emptyProfileData, email: user.email ?? "", name: (user.user_metadata as any)?.full_name ?? "" };
        setProfile(seeded);
        setEditForm(seeded);
      }
      setLoading(false);
    };
    load();
  }, [user, userIdParam, usernameParam, toast]);


  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`directory_${user.id}`);
      if (saved) {
        try {
          setDirectoryFiles(JSON.parse(saved));
        } catch(e) {
          console.error("Failed to parse directory files", e);
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`directory_${user.id}`, JSON.stringify(directoryFiles));
    }
  }, [directoryFiles, user?.id]);

  const roleIcons = {
    "Director": Camera,
    "Producer": Building2,
    "Cinematographer": Camera,
    "Editor": Scissors,
    "Writer": PenTool,
    "Composer": Music,
    "Designer": Palette,
    "Sound Designer": Mic,
  };

  const handleEditProfile = () => {
    setEditForm(profile);
    setSkillsInput((profile.skills || []).join(", "));
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast({ title: "Not signed in", description: "Please sign in to save your profile.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const parsedSkills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);
    const formWithSkills = { ...editForm, skills: parsedSkills };
    const payload = profileToRow(formWithSkills, user.id);
    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload as any, { onConflict: "user_id" })
      .select()
      .maybeSingle();
    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    const updated = data ? rowToProfile(data, user.email) : editForm;
    setProfile(updated);
    setEditForm(updated);
    setShowEditProfile(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  // Quick Actions
  const handleSendMessage = () => navigate("/messages");
  const handleConnect = () => toast({ title: "Connection request sent", description: "We'll notify you once accepted." });
  const handleDirectoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: DirectoryFile[] = Array.from(files).map(file => {
      let type: "document" | "image" | "video" | "audio" = "document";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";
      return {
        id: crypto.randomUUID(),
        name: file.name,
        type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString()
      };
    });
    setDirectoryFiles(prev => [...newFiles, ...prev]);
    if (directoryFileInputRef.current) directoryFileInputRef.current.value = "";
    if (directoryMainFileInputRef.current) directoryMainFileInputRef.current.value = "";
  };
  const handleShareProfile = async () => {
    const url = `${window.location.origin}/profile${profile.username ? `?u=${encodeURIComponent(profile.username)}` : ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.name || "Profile", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Profile link copied to clipboard." });
      }
    } catch {
      /* user cancelled */
    }
  };
  const handleDownloadCV = () => {
    const lines = [
      profile.name,
      profile.role,
      profile.email,
      profile.phone,
      profile.location,
      "",
      "ABOUT",
      profile.bio,
      "",
      "SKILLS",
      (profile.skills || []).join(", "),
      "",
      "EXPERIENCE",
      ...(profile.experience || []).map((e) => `- ${e.title} @ ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate ?? ""})\n  ${e.description ?? ""}`),
      "",
      "EDUCATION",
      ...(profile.education || []).map((e) => `- ${e.degree} @ ${e.school} (${e.startDate} - ${e.current ? "Present" : e.endDate ?? ""})`),
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(profile.name || "profile").replace(/\s+/g, "_")}_CV.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast({ title: "CV downloaded" });
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setShowEditProfile(false);
  };

  const handleFormChange = (field: keyof ProfileData, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setEditForm(prev => ({
      ...prev,
      skills
    }));
  };

  const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

  // Generic list helpers for experience/achievements/education/portfolio
  const addItem = <K extends "experience" | "achievements" | "education" | "portfolio">(key: K, item: any, expandSetter?: (id: string) => void) => {
    const id = newId();
    setEditForm(prev => ({ ...prev, [key]: [...(prev[key] as any[]), { id, ...item }] } as ProfileData));
    expandSetter?.(id);
  };
  const updateItem = <K extends "experience" | "achievements" | "education" | "portfolio">(key: K, id: string, patch: any) => {
    setEditForm(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map(it => it.id === id ? { ...it, ...patch } : it),
    } as ProfileData));
  };
  const deleteItem = <K extends "experience" | "achievements" | "education" | "portfolio">(key: K, id: string) => {
    setEditForm(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter(it => it.id !== id),
    } as ProfileData));
  };

  const addExperience = () => addItem("experience", { title: "New Role", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }, (id) => setExpandedEditExperience(prev => new Set(prev).add(id)));
  const addAchievement = () => addItem("achievements", { title: "New Achievement", type: "award", date: "", description: "" }, (id) => setExpandedEditAchievements(prev => new Set(prev).add(id)));
  const addEducation = () => addItem("education", { degree: "New Degree", school: "", location: "", startDate: "", endDate: "", current: false, description: "" }, (id) => setExpandedEditEducation(prev => new Set(prev).add(id)));
  const addPortfolio = () => addItem("portfolio", { title: "New Portfolio Item", type: "image", thumbnail: "", description: "", date: "", views: 0, likes: 0 });


  const toggleEditExperienceExpansion = (id: string) => {
    setExpandedEditExperience(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleEditAchievementExpansion = (id: string) => {
    setExpandedEditAchievements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleEditEducationExpansion = (id: string) => {
    setExpandedEditEducation(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getRoleIcon = (role: string) => {
    const roleKey = Object.keys(roleIcons).find(key => 
      role.toLowerCase().includes(key.toLowerCase())
    );
    return roleKey ? roleIcons[roleKey as keyof typeof roleIcons] : Camera;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4 bg-yellow-50 min-h-screen p-4 -m-4">
        {/* Profile Header */}
        <Card className="relative overflow-hidden border-yellow-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg flex-shrink-0">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.verified && (
                      <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                    {profile.online && (
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-gray-600">@{profile.username}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-700 font-medium">{profile.role}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      Joined {formatDate(profile.joinedDate)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {isOwnProfile ? (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white hover:bg-gray-50 border-gray-300"
                    onClick={handleEditProfile}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white hover:bg-gray-50 border-gray-300"
                      onClick={() => navigate(`/messages?u=${encodeURIComponent(profile.username)}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleConnect}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Statistics Row */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{profile.stats.connections.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{profile.stats.projects}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{profile.stats.posts}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{profile.stats.followers.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-yellow-50 border-yellow-200">
                <TabsTrigger 
                  value="overview" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger 
                  value="achievements" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Achievements
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="directory" 
                  className="text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Directory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Bio */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.portfolio.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.type === "video" && <Video className="w-5 h-5 text-gray-500" />}
                            {item.type === "image" && <ImageIcon className="w-5 h-5 text-gray-500" />}
                            {item.type === "document" && <FileIcon className="w-5 h-5 text-gray-500" />}
                            {item.type === "audio" && <MusicIcon className="w-5 h-5 text-gray-500" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.views} views
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                {/* Experience */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{exp.title}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            <p className="text-xs text-gray-500">{exp.location}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateShort(exp.startDate)} - {exp.current ? "Present" : formatDateShort(exp.endDate!)}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.portfolio.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-32 bg-gray-200 flex items-center justify-center">
                            {item.type === "video" && <Video className="w-8 h-8 text-gray-500" />}
                            {item.type === "image" && <ImageIcon className="w-8 h-8 text-gray-500" />}
                            {item.type === "document" && <FileIcon className="w-8 h-8 text-gray-500" />}
                            {item.type === "audio" && <MusicIcon className="w-8 h-8 text-gray-500" />}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(item.date)}</span>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {item.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {item.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Achievements & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.achievements.map((achievement) => (
                        <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
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
                                  {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                              <p className="text-xs text-gray-500">{achievement.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            <p className="text-xs text-gray-500">{edu.location}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateShort(edu.startDate)} - {edu.current ? "Present" : formatDateShort(edu.endDate!)}
                            </p>
                            {edu.description && (
                              <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="directory" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Directory</CardTitle>
                    <div className="flex gap-2 items-center">
                      <input type="file" ref={directoryMainFileInputRef} className="hidden" multiple onChange={handleDirectoryUpload} />
                      <Button size="sm" onClick={() => directoryMainFileInputRef.current?.click()} className="h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                        <Plus className="w-4 h-4 mr-1" />
                        Upload Files
                      </Button>
                      <Select value={directoryFilter} onValueChange={(v: any) => { setDirectoryFilter(v); setDirectoryPage(1); }}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Files</SelectItem>
                          <SelectItem value="document">Documents</SelectItem>
                          <SelectItem value="image">Images</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {(() => {
                        const filtered = directoryFiles.filter(f => directoryFilter === "all" || f.type === directoryFilter).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
                        const paginated = filtered.slice((directoryPage - 1) * 9, directoryPage * 9);
                        if (filtered.length === 0) return <p className="text-sm text-gray-500 col-span-full">No files found.</p>;
                        return paginated.map(file => (
                          <div key={file.id} className="border rounded-md p-3 flex flex-col gap-2 hover:bg-gray-50">
                            {file.type === 'image' ? <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded" /> :
                              file.type === 'video' ? <video src={file.url} className="w-full h-32 object-cover rounded" controls /> :
                              file.type === 'audio' ? <audio src={file.url} className="w-full mt-auto" controls /> :
                              <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded"><FileText className="w-8 h-8 text-gray-400" /></div>}
                            <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                          </div>
                        ));
                      })()}
                    </div>
                    {(() => {
                      const filtered = directoryFiles.filter(f => directoryFilter === "all" || f.type === directoryFilter);
                      const totalPages = Math.ceil(filtered.length / 9);
                      if (totalPages <= 1) return null;
                      return (
                        <div className="flex justify-center items-center gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => setDirectoryPage(p => Math.max(1, p - 1))} disabled={directoryPage === 1}>Prev</Button>
                          <span className="text-sm text-gray-500">Page {directoryPage} of {totalPages}</span>
                          <Button variant="outline" size="sm" onClick={() => setDirectoryPage(p => Math.min(totalPages, p + 1))} disabled={directoryPage === totalPages}>Next</Button>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.location}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={profile.website} className="text-blue-600 hover:underline text-sm">
                      {profile.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.linkedin && (
                  <a href={profile.linkedin} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} className="flex items-center gap-2 text-sm text-pink-600 hover:underline">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                {profile.youtube && (
                  <a href={profile.youtube} className="flex items-center gap-2 text-sm text-red-600 hover:underline">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" className="w-full justify-start border-yellow-200 text-gray-700 hover:bg-yellow-50" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start border-yellow-200 text-gray-700 hover:bg-yellow-50" onClick={() => navigate(`/messages?u=${encodeURIComponent(profile.username)}`)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-yellow-200 text-gray-700 hover:bg-yellow-50">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start border-yellow-200 text-gray-700 hover:bg-yellow-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-yellow-200 text-gray-700 hover:bg-yellow-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Popup */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-100">
              <TabsTrigger 
                value="profile" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="directory" 
                className="text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Directory
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => handleFormChange('username', e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      placeholder="Enter your location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={editForm.role} onValueChange={(value) => handleFormChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Producer">Producer</SelectItem>
                        <SelectItem value="Cinematographer">Cinematographer</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Writer">Writer</SelectItem>
                        <SelectItem value="Composer">Composer</SelectItem>
                        <SelectItem value="Designer">Designer</SelectItem>
                        <SelectItem value="Sound Designer">Sound Designer</SelectItem>
                        <SelectItem value="Actor">Actor</SelectItem>
                        <SelectItem value="Actress">Actress</SelectItem>
                        <SelectItem value="Screenwriter">Screenwriter</SelectItem>
                        <SelectItem value="Production Manager">Production Manager</SelectItem>
                        <SelectItem value="Assistant Director">Assistant Director</SelectItem>
                        <SelectItem value="Camera Operator">Camera Operator</SelectItem>
                        <SelectItem value="Sound Engineer">Sound Engineer</SelectItem>
                        <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                        <SelectItem value="Costume Designer">Costume Designer</SelectItem>
                        <SelectItem value="Set Designer">Set Designer</SelectItem>
                        <SelectItem value="VFX Artist">VFX Artist</SelectItem>
                        <SelectItem value="Motion Graphics Designer">Motion Graphics Designer</SelectItem>
                        <SelectItem value="Colorist">Colorist</SelectItem>
                        <SelectItem value="Film Distributor">Film Distributor</SelectItem>
                        <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
                        <SelectItem value="Social Media Manager">Social Media Manager</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editForm.company || ''}
                      onChange={(e) => handleFormChange('company', e.target.value)}
                      placeholder="Enter your company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website || ''}
                      onChange={(e) => handleFormChange('website', e.target.value)}
                      placeholder="Enter your website URL"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">About You</h3>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => handleFormChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onBlur={() => handleSkillsChange(skillsInput.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Enter your skills separated by commas"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={editForm.linkedin || ''}
                      onChange={(e) => handleFormChange('linkedin', e.target.value)}
                      placeholder="Enter your LinkedIn profile URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={editForm.twitter || ''}
                      onChange={(e) => handleFormChange('twitter', e.target.value)}
                      placeholder="Enter your Twitter profile URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={editForm.instagram || ''}
                      onChange={(e) => handleFormChange('instagram', e.target.value)}
                      placeholder="Enter your Instagram profile URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={editForm.youtube || ''}
                      onChange={(e) => handleFormChange('youtube', e.target.value)}
                      placeholder="Enter your YouTube channel URL"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                  <Button size="sm" onClick={addExperience} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Experience
                  </Button>
                </div>
                <div className="space-y-4">
                  {editForm.experience.map((exp, index) => {
                    const isExpanded = expandedEditExperience.has(exp.id);
                    return (
                      <Card key={exp.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleEditExperienceExpansion(exp.id)}
                          >
                            <div className="flex gap-3 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{exp.title}</h4>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                                <p className="text-xs text-gray-500">{exp.location}</p>
                                <p className="text-xs text-gray-500">
                                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="p-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Job Title</Label>
                                  <Input value={exp.title} onChange={(e) => updateItem("experience", exp.id, { title: e.target.value })} placeholder="Enter job title" />
                                </div>
                                <div>
                                  <Label>Company</Label>
                                  <Input value={exp.company} onChange={(e) => updateItem("experience", exp.id, { company: e.target.value })} placeholder="Enter company name" />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input value={exp.location} onChange={(e) => updateItem("experience", exp.id, { location: e.target.value })} placeholder="Enter location" />
                                </div>
                                <div>
                                  <Label>Start Date</Label>
                                  <Input value={exp.startDate} onChange={(e) => updateItem("experience", exp.id, { startDate: e.target.value })} placeholder="MM/YYYY" />
                                </div>
                                <div>
                                  <Label>End Date</Label>
                                  <Input value={exp.endDate || ''} onChange={(e) => updateItem("experience", exp.id, { endDate: e.target.value })} placeholder="MM/YYYY (leave empty if current)" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" checked={exp.current} onChange={(e) => updateItem("experience", exp.id, { current: e.target.checked })} />
                                  <Label>Currently working here</Label>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Label>Description</Label>
                                <Textarea value={exp.description} onChange={(e) => updateItem("experience", exp.id, { description: e.target.value })} rows={3} placeholder="Describe your role and responsibilities" />
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="destructive" onClick={() => deleteItem("experience", exp.id)}>Delete</Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Achievements & Awards</h3>
                  <Button size="sm" onClick={addAchievement} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Achievement
                  </Button>
                </div>
                <div className="space-y-4">
                  {editForm.achievements.map((achievement, index) => {
                    const isExpanded = expandedEditAchievements.has(achievement.id);
                    return (
                      <Card key={achievement.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleEditAchievementExpansion(achievement.id)}
                          >
                            <div className="flex gap-3 flex-1">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {achievement.type === 'award' && <Award className="w-4 h-4 text-purple-600" />}
                                {achievement.type === 'certification' && <GraduationCap className="w-4 h-4 text-purple-600" />}
                                {achievement.type === 'publication' && <FileText className="w-4 h-4 text-purple-600" />}
                                {achievement.type === 'recognition' && <Star className="w-4 h-4 text-purple-600" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">{achievement.date}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="p-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Achievement Title</Label>
                                  <Input value={achievement.title} onChange={(e) => updateItem("achievements", achievement.id, { title: e.target.value })} placeholder="Enter achievement title" />
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <Select value={achievement.type} onValueChange={(v) => updateItem("achievements", achievement.id, { type: v })}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="award">Award</SelectItem>
                                      <SelectItem value="certification">Certification</SelectItem>
                                      <SelectItem value="publication">Publication</SelectItem>
                                      <SelectItem value="recognition">Recognition</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Date</Label>
                                  <Input value={achievement.date} onChange={(e) => updateItem("achievements", achievement.id, { date: e.target.value })} placeholder="MM/YYYY" />
                                </div>
                              </div>
                              <div className="mt-4">
                                <Label>Description</Label>
                                <Textarea value={achievement.description} onChange={(e) => updateItem("achievements", achievement.id, { description: e.target.value })} rows={3} placeholder="Describe the achievement" />
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="destructive" onClick={() => deleteItem("achievements", achievement.id)}>Delete</Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Portfolio Items</h3>
                  <Button size="sm" onClick={addPortfolio} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Portfolio Item
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editForm.portfolio.map((item) => (
                    <Card key={item.id} className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {item.type === "video" && <Video className="w-10 h-10 text-yellow-600" />}
                        {item.type === "image" && <ImageIcon className="w-10 h-10 text-blue-600" />}
                        {item.type === "document" && <FileIcon className="w-10 h-10 text-green-600" />}
                        {item.type === "audio" && <MusicIcon className="w-10 h-10 text-orange-600" />}
                      </div>
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <Label className="text-xs">Title</Label>
                          <Input value={item.title} onChange={(e) => updateItem("portfolio", item.id, { title: e.target.value })} placeholder="Title" />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select value={item.type} onValueChange={(v) => updateItem("portfolio", item.id, { type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Textarea value={item.description} onChange={(e) => updateItem("portfolio", item.id, { description: e.target.value })} rows={2} placeholder="Description" />
                        </div>
                        <div>
                          <Label className="text-xs">Date</Label>
                          <Input value={item.date} onChange={(e) => updateItem("portfolio", item.id, { date: e.target.value })} placeholder="YYYY-MM-DD" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" variant="destructive" className="flex-1" onClick={() => deleteItem("portfolio", item.id)}>Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <Button size="sm" onClick={addEducation} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {editForm.education.map((edu, index) => {
                    const isExpanded = expandedEditEducation.has(edu.id);
                    return (
                      <Card key={edu.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleEditEducationExpansion(edu.id)}
                          >
                            <div className="flex gap-3 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{edu.degree}</h4>
                                <p className="text-sm text-gray-600">{edu.school}</p>
                                <p className="text-xs text-gray-500">{edu.location}</p>
                                <p className="text-xs text-gray-500">
                                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="p-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Degree</Label>
                                  <Input value={edu.degree} onChange={(e) => updateItem("education", edu.id, { degree: e.target.value })} placeholder="Enter degree" />
                                </div>
                                <div>
                                  <Label>School</Label>
                                  <Input value={edu.school} onChange={(e) => updateItem("education", edu.id, { school: e.target.value })} placeholder="Enter school name" />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input value={edu.location} onChange={(e) => updateItem("education", edu.id, { location: e.target.value })} placeholder="Enter location" />
                                </div>
                                <div>
                                  <Label>Start Date</Label>
                                  <Input value={edu.startDate} onChange={(e) => updateItem("education", edu.id, { startDate: e.target.value })} placeholder="MM/YYYY" />
                                </div>
                                <div>
                                  <Label>End Date</Label>
                                  <Input value={edu.endDate || ''} onChange={(e) => updateItem("education", edu.id, { endDate: e.target.value })} placeholder="MM/YYYY (leave empty if current)" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" checked={edu.current} onChange={(e) => updateItem("education", edu.id, { current: e.target.checked })} />
                                  <Label>Currently studying</Label>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Label>Description</Label>
                                <Textarea value={edu.description || ''} onChange={(e) => updateItem("education", edu.id, { description: e.target.value })} rows={3} placeholder="Describe your education" />
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="destructive" onClick={() => deleteItem("education", edu.id)}>Delete</Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Directory Tab */}
            <TabsContent value="directory" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Directory</h3>
                <div className="flex gap-2 items-center">
                  <Select value={directoryFilter} onValueChange={(v: any) => { setDirectoryFilter(v); setDirectoryPage(1); }}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Files</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="file" ref={directoryFileInputRef} className="hidden" multiple onChange={handleDirectoryUpload} />
                  <Button size="sm" onClick={() => directoryFileInputRef.current?.click()} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Files
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(() => {
                  const filtered = directoryFiles.filter(f => directoryFilter === "all" || f.type === directoryFilter).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
                  const paginated = filtered.slice((directoryPage - 1) * 9, directoryPage * 9);
                  if (filtered.length === 0) return <p className="text-sm text-gray-500 col-span-full">No files found.</p>;
                  return paginated.map(file => (
                    <div key={file.id} className="border border-gray-200 rounded-md p-3 flex flex-col gap-2 relative group hover:bg-gray-50 bg-white">
                       {file.type === 'image' ? <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded" /> :
                        file.type === 'video' ? <video src={file.url} className="w-full h-32 object-cover rounded" controls /> :
                        file.type === 'audio' ? <audio src={file.url} className="w-full mt-auto" controls /> :
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded"><FileText className="w-8 h-8 text-gray-400" /></div>}
                       <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                       <p className="text-xs text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</p>
                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setDirectoryFiles(prev => prev.filter(f => f.id !== file.id)); }}>
                         <X className="h-4 w-4" />
                       </Button>
                    </div>
                  ));
                })()}
              </div>
              {(() => {
                 const filtered = directoryFiles.filter(f => directoryFilter === "all" || f.type === directoryFilter);
                 const totalPages = Math.ceil(filtered.length / 9);
                 if (totalPages <= 1) return null;
                 return (
                   <div className="flex justify-center items-center gap-2 mt-4">
                     <Button variant="outline" size="sm" onClick={() => setDirectoryPage(p => Math.max(1, p - 1))} disabled={directoryPage === 1}>Prev</Button>
                     <span className="text-sm text-gray-500">Page {directoryPage} of {totalPages}</span>
                     <Button variant="outline" size="sm" onClick={() => setDirectoryPage(p => Math.min(totalPages, p + 1))} disabled={directoryPage === totalPages}>Next</Button>
                   </div>
                 );
              })()}
            </TabsContent>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={handleCancelEdit} className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                Save Changes
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
