import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  Share2, 
  Eye, 
  Users, 
  Clock, 
  MapPin, 
  Film, 
  Tv, 
  Star, 
  TrendingUp,
  UserPlus,
  Bookmark,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Project interface
interface Project {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  category: string;
  status: string;
  location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string;
  duration_minutes: number | null;
  episodes: number | null;
  team_size: number;
  tags: string[] | null;
  skills_required: string[] | null;
  created_by: string;
  featured: boolean;
  popular: boolean;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  is_liked?: boolean;
  is_member?: boolean;
}

// Form schema
const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  project_type: z.string().min(1, "Please select a project type"),
  category: z.string().min(1, "Please select a category"),
  status: z.string().min(1, "Please select a status"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  duration_minutes: z.number().optional(),
  episodes: z.number().optional(),
  skills_required: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [projectDetailsTab, setProjectDetailsTab] = useState("details");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    projectType: "all",
    category: "all",
    status: "all",
    location: "all",
    budgetRange: "all"
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      project_type: "",
      category: "",
      status: "planning",
      location: "",
      budget_min: 0,
      budget_max: 0,
      duration_minutes: 0,
      episodes: 0,
      skills_required: "",
    },
  });

  // Hardcoded projects data
  const hardcodedProjects: Project[] = [
    {
      id: "1",
      title: "The Silent Revolution",
      description: "A gripping thriller about a whistleblower who uncovers corporate corruption in the tech industry. Seeking experienced cinematographer and editor for this indie feature film.",
      project_type: "Film",
      category: "Feature Film",
      status: "pre-production",
      location: "Mumbai, India",
      budget_min: 5000000,
      budget_max: 8000000,
      budget_currency: "₹",
      duration_minutes: 120,
      episodes: null,
      team_size: 8,
      tags: ["thriller", "indie", "corruption"],
      skills_required: ["Director", "Cinematographer", "Editor", "Sound Designer"],
      created_by: "user-1",
      featured: true,
      popular: true,
      created_at: "2024-12-01T10:00:00Z",
      updated_at: "2024-12-15T14:30:00Z",
      likes_count: 45,
      is_liked: false,
      is_member: false
    },
    {
      id: "2",
      title: "Digital Dreams",
      description: "A sci-fi web series exploring the intersection of artificial intelligence and human creativity. Looking for talented writers and VFX artists.",
      project_type: "Web Series",
      category: "Web Series",
      status: "planning",
      location: "Bangalore, India",
      budget_min: 2000000,
      budget_max: 5000000,
      budget_currency: "₹",
      duration_minutes: null,
      episodes: 8,
      team_size: 12,
      tags: ["sci-fi", "AI", "web-series"],
      skills_required: ["Writer", "VFX Artist", "Director", "Producer"],
      created_by: "user-2",
      featured: false,
      popular: true,
      created_at: "2024-11-28T09:15:00Z",
      updated_at: "2024-12-10T16:45:00Z",
      likes_count: 32,
      is_liked: false,
      is_member: false
    },
    {
      id: "3",
      title: "Mumbai Stories",
      description: "An anthology series showcasing diverse stories from the heart of Mumbai. Each episode tells a different tale of hope, struggle, and triumph.",
      project_type: "Television",
      category: "TV Series",
      status: "production",
      location: "Mumbai, India",
      budget_min: 10000000,
      budget_max: 15000000,
      budget_currency: "₹",
      duration_minutes: null,
      episodes: 12,
      team_size: 15,
      tags: ["drama", "anthology", "mumbai"],
      skills_required: ["Director", "Script Writer", "Cinematographer", "Production Designer"],
      created_by: "user-3",
      featured: true,
      popular: false,
      created_at: "2024-11-15T14:20:00Z",
      updated_at: "2024-12-12T11:30:00Z",
      likes_count: 28,
      is_liked: false,
      is_member: false
    },
    {
      id: "4",
      title: "The Last Dance",
      description: "A documentary following the journey of classical dancers preserving traditional Indian dance forms in the modern world.",
      project_type: "Documentary",
      category: "Documentary",
      status: "post-production",
      location: "Delhi, India",
      budget_min: 1500000,
      budget_max: 2500000,
      budget_currency: "₹",
      duration_minutes: 90,
      episodes: null,
      team_size: 6,
      tags: ["documentary", "dance", "culture"],
      skills_required: ["Director", "Cinematographer", "Editor", "Sound Recordist"],
      created_by: "user-4",
      featured: false,
      popular: false,
      created_at: "2024-10-20T08:30:00Z",
      updated_at: "2024-12-08T13:15:00Z",
      likes_count: 19,
      is_liked: false,
      is_member: false
    },
    {
      id: "5",
      title: "Short Circuit",
      description: "A quirky short film about a robot learning to love. Perfect for emerging filmmakers looking to build their portfolio.",
      project_type: "Short Film",
      category: "Short Film",
      status: "planning",
      location: "Pune, India",
      budget_min: 500000,
      budget_max: 800000,
      budget_currency: "₹",
      duration_minutes: 15,
      episodes: null,
      team_size: 5,
      tags: ["short-film", "robot", "love", "quirky"],
      skills_required: ["Director", "Cinematographer", "Editor", "Actor"],
      created_by: "user-5",
      featured: false,
      popular: false,
      created_at: "2024-12-05T16:45:00Z",
      updated_at: "2024-12-14T10:20:00Z",
      likes_count: 12,
      is_liked: false,
      is_member: false
    },
    {
      id: "6",
      title: "Bollywood Beats",
      description: "A music video series featuring fusion of classical Indian music with contemporary beats. Seeking musicians and choreographers.",
      project_type: "Music Video",
      category: "Music Video",
      status: "pre-production",
      location: "Chennai, India",
      budget_min: 800000,
      budget_max: 1200000,
      budget_currency: "₹",
      duration_minutes: 4,
      episodes: 6,
      team_size: 7,
      tags: ["music", "fusion", "classical", "contemporary"],
      skills_required: ["Music Director", "Choreographer", "Cinematographer", "Editor"],
      created_by: "user-6",
      featured: false,
      popular: true,
      created_at: "2024-11-30T12:00:00Z",
      updated_at: "2024-12-13T15:30:00Z",
      likes_count: 25,
      is_liked: false,
      is_member: false
    },
    {
      id: "7",
      title: "The Startup Story",
      description: "A corporate drama series following the journey of young entrepreneurs building India's next unicorn startup.",
      project_type: "Television",
      category: "TV Series",
      status: "planning",
      location: "Gurgaon, India",
      budget_min: 12000000,
      budget_max: 20000000,
      budget_currency: "₹",
      duration_minutes: null,
      episodes: 10,
      team_size: 18,
      tags: ["drama", "startup", "entrepreneurship"],
      skills_required: ["Director", "Writer", "Producer", "Cinematographer", "Production Manager"],
      created_by: "user-7",
      featured: true,
      popular: false,
      created_at: "2024-12-03T11:30:00Z",
      updated_at: "2024-12-16T09:45:00Z",
      likes_count: 38,
      is_liked: false,
      is_member: false
    },
    {
      id: "8",
      title: "Street Art Chronicles",
      description: "A documentary exploring the vibrant street art scene in Indian cities and the artists behind these beautiful creations.",
      project_type: "Documentary",
      category: "Documentary",
      status: "production",
      location: "Kolkata, India",
      budget_min: 2000000,
      budget_max: 3500000,
      budget_currency: "₹",
      duration_minutes: 75,
      episodes: null,
      team_size: 8,
      tags: ["documentary", "street-art", "culture", "urban"],
      skills_required: ["Director", "Cinematographer", "Editor", "Researcher"],
      created_by: "user-8",
      featured: false,
      popular: false,
      created_at: "2024-11-25T14:15:00Z",
      updated_at: "2024-12-11T12:00:00Z",
      likes_count: 21,
      is_liked: false,
      is_member: false
    }
  ];

  useEffect(() => {
    fetchProjects();
    fetchLikedProjects();
    fetchSavedProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Add some projects that appear as created by current user
      const userCreatedProjects: Project[] = [
        {
          id: "user-created-1",
          title: "My Indie Film Project",
          description: "A personal passion project about family relationships and cultural identity. Looking for talented actors and crew members to bring this story to life.",
          project_type: "Film",
          category: "Feature Film",
          status: "pre-production",
          location: "Mumbai, India",
          budget_min: 3000000,
          budget_max: 5000000,
          budget_currency: "₹",
          duration_minutes: 110,
          episodes: null,
          team_size: 6,
          tags: ["indie", "family", "culture"],
          skills_required: ["Director", "Actor", "Cinematographer", "Editor"],
          created_by: user?.id || "current-user",
          featured: false,
          popular: false,
          created_at: "2024-12-10T09:00:00Z",
          updated_at: "2024-12-16T14:30:00Z",
          likes_count: 15,
          is_liked: false,
          is_member: true
        },
        {
          id: "user-created-2",
          title: "Tech Startup Documentary",
          description: "Documenting the journey of young entrepreneurs building innovative tech solutions in India. Seeking experienced documentary filmmakers.",
          project_type: "Documentary",
          category: "Documentary",
          status: "production",
          location: "Bangalore, India",
          budget_min: 1800000,
          budget_max: 2800000,
          budget_currency: "₹",
          duration_minutes: 85,
          episodes: null,
          team_size: 4,
          tags: ["documentary", "tech", "startup"],
          skills_required: ["Director", "Cinematographer", "Editor", "Producer"],
          created_by: user?.id || "current-user",
          featured: false,
          popular: false,
          created_at: "2024-11-20T11:15:00Z",
          updated_at: "2024-12-14T16:45:00Z",
          likes_count: 22,
          is_liked: false,
          is_member: true
        },
        {
          id: "user-created-3",
          title: "Short Film: The Last Letter",
          description: "A touching short film about a grandfather writing letters to his grandchildren. Perfect for film festival submissions.",
          project_type: "Short Film",
          category: "Short Film",
          status: "post-production",
          location: "Delhi, India",
          budget_min: 400000,
          budget_max: 600000,
          budget_currency: "₹",
          duration_minutes: 12,
          episodes: null,
          team_size: 3,
          tags: ["short-film", "family", "emotional"],
          skills_required: ["Director", "Actor", "Editor"],
          created_by: user?.id || "current-user",
          featured: false,
          popular: false,
          created_at: "2024-10-15T08:30:00Z",
          updated_at: "2024-12-12T10:20:00Z",
          likes_count: 8,
          is_liked: false,
          is_member: true
        },
        {
          id: "user-created-4",
          title: "Web Series: Urban Tales",
          description: "An anthology web series exploring modern urban life in Indian cities. Each episode focuses on different characters and their struggles.",
          project_type: "Web Series",
          category: "Web Series",
          status: "planning",
          location: "Mumbai, India",
          budget_min: 2500000,
          budget_max: 4000000,
          budget_currency: "₹",
          duration_minutes: null,
          episodes: 6,
          team_size: 10,
          tags: ["web-series", "urban", "anthology"],
          skills_required: ["Director", "Writer", "Producer", "Cinematographer"],
          created_by: user?.id || "current-user",
          featured: false,
          popular: false,
          created_at: "2024-12-05T13:45:00Z",
          updated_at: "2024-12-15T11:30:00Z",
          likes_count: 18,
          is_liked: false,
          is_member: true
        }
      ];

      // Combine hardcoded projects with user-created projects
      const allProjects = [...hardcodedProjects, ...userCreatedProjects];
      
      // Use hardcoded projects instead of Supabase
      const projectsWithDetails = allProjects.map((project) => {
        // Check if user liked this project (mock data)
        const isLiked = likedProjects.includes(project.id);
        
        // Check if user is a member (mock data)
        const isMember = project.created_by === user?.id || project.is_member || Math.random() > 0.8; // Random for demo
        
        return {
          ...project,
          is_liked: isLiked,
          is_member: isMember,
        };
      });

      setProjects(projectsWithDetails);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedProjects = async () => {
    if (!user) return;
    
    try {
      // Mock liked projects for demo - in real app, fetch from database
      const mockLikedProjects = ["1", "3", "6"]; // Some projects are liked by default
      setLikedProjects(mockLikedProjects);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSavedProjects = async () => {
    if (!user) return;
    
    try {
      // Mock saved projects for demo - in real app, fetch from database
      const mockSavedProjects = ["2", "4", "7"]; // Some projects are saved by default
      setSavedProjects(mockSavedProjects);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) return;

    try {
      const skillsArray = data.skills_required 
        ? data.skills_required.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : [];

      // Create new project object
      const newProject: Project = {
        id: Date.now().toString(), // Simple ID generation
        title: data.title,
        description: data.description,
        project_type: data.project_type,
        category: data.category,
        status: data.status,
        location: data.location,
        budget_min: data.budget_min && data.budget_min > 0 ? data.budget_min : null,
        budget_max: data.budget_max && data.budget_max > 0 ? data.budget_max : null,
        budget_currency: "₹",
        duration_minutes: data.duration_minutes && data.duration_minutes > 0 ? data.duration_minutes : null,
        episodes: data.episodes && data.episodes > 0 ? data.episodes : null,
        team_size: Math.floor(Math.random() * 10) + 5, // Random team size for demo
        tags: [],
        skills_required: skillsArray,
        created_by: user.id,
        featured: false,
        popular: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
        is_liked: false,
        is_member: false
      };

      // Add to hardcoded projects array (this will be picked up in next fetch)
      hardcodedProjects.unshift(newProject); // Add to beginning
      
      toast({
        title: "Success",
        description: "Project created successfully"
      });
      form.reset();
      setIsCreateDialogOpen(false);
      fetchProjects(); // Refresh the display
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  const handleSaveProject = async (projectId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to save projects"
      });
      return;
    }

    try {
      const isSaved = savedProjects.includes(projectId);

      if (isSaved) {
        // Unsave project
        setSavedProjects(prev => prev.filter(id => id !== projectId));
        toast({
          title: "Project Unsaved",
          description: "Project has been removed from your saved list"
        });
      } else {
        // Save project
        setSavedProjects(prev => [...prev, projectId]);
        toast({
          title: "Project Saved",
          description: "Project has been added to your saved list"
        });
      }

      // Refresh projects to update counts
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLikeProject = async (projectId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to like projects"
      });
      return;
    }

    try {
      const isLiked = likedProjects.includes(projectId);

      if (isLiked) {
        // Unlike project
        setLikedProjects(prev => prev.filter(id => id !== projectId));
      } else {
        // Like project
        setLikedProjects(prev => [...prev, projectId]);
      }

      // Refresh projects to update like counts
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleJoinProject = async (projectId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign In Required",
        description: "Please sign in to join projects"
      });
      return;
    }

    try {
      // Add to applied projects
      setAppliedProjects(prev => [...prev, projectId]);
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully."
      });
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  const handleShareProject = async (project: Project) => {
    const projectUrl = `${window.location.origin}/projects/${project.id}`;
    const shareText = `Check out this project: ${project.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: shareText,
          url: projectUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${projectUrl}`);
        toast({
          title: "Link Copied",
          description: "Project link has been copied to clipboard"
        });
      } catch (error) {
        alert(`${shareText}\n${projectUrl}`);
      }
    }
  };

  const handleViewProjectDetails = (project: Project) => {
    // Navigate to project details page with tab information
    navigate(`/projects/${project.id}?tab=${activeTab}`);
  };

  const fetchApplicants = async (projectId: string) => {
    try {
      // Mock applicants data - in a real app, you'd fetch from your database
      const mockApplicants = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@email.com",
          avatar: "JS",
          appliedDate: "2025-01-08",
          status: "pending",
          experience: "5 years",
          skills: ["Director", "Producer", "Editor"],
          role: "Director"
        },
        {
          id: "2", 
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          avatar: "SJ",
          appliedDate: "2025-01-07",
          status: "reviewed",
          experience: "3 years",
          skills: ["Cinematographer", "Photographer"],
          role: "Cinematographer"
        },
        {
          id: "3",
          name: "Mike Chen",
          email: "mike.chen@email.com", 
          avatar: "MC",
          appliedDate: "2025-01-06",
          status: "shortlisted",
          experience: "7 years",
          skills: ["Actor", "Voice Artist"],
          role: "Lead Actor"
        }
      ];
      setApplicants(mockApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by tab
    if (activeTab === "joined") {
      filtered = filtered.filter(project => project.is_member);
    } else if (activeTab === "created") {
      filtered = filtered.filter(project => project.created_by === user?.id);
    } else if (activeTab === "saved") {
      filtered = filtered.filter(project => savedProjects.includes(project.id));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.project_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skills_required?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply additional filters
    if (filters.projectType !== "all") {
      filtered = filtered.filter(project => project.project_type === filters.projectType);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter(project => project.category === filters.category);
    }
    if (filters.status !== "all") {
      filtered = filtered.filter(project => project.status === filters.status);
    }
    if (filters.location !== "all") {
      filtered = filtered.filter(project => project.location === filters.location);
    }
    if (filters.budgetRange !== "all") {
      filtered = filtered.filter(project => {
        const budget = project.budget_max || 0;
        switch (filters.budgetRange) {
          case "low": return budget < 1000000;
          case "medium": return budget >= 1000000 && budget < 5000000;
          case "high": return budget >= 5000000;
          default: return true;
        }
      });
    }

    // Sort projects
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      case "budget":
        filtered.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0));
        break;
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-blue-500";
      case "planning": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Film": return <Film className="h-4 w-4" />;
      case "Television": return <Tv className="h-4 w-4" />;
      default: return <Film className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const formatBudget = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `${currency}${(min / 10000000).toFixed(1)}Cr - ${currency}${(max / 10000000).toFixed(1)}Cr`;
    if (min) return `${currency}${(min / 10000000).toFixed(1)}Cr+`;
    return `${currency}${(max! / 10000000).toFixed(1)}Cr`;
  };

  const filteredProjects = getFilteredProjects();

  return (
    <AppLayout pageTitle="Projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Discover and collaborate on film and entertainment projects
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search projects, titles, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-yellow-200 focus:border-yellow-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="budget">Highest Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-yellow-50 border-yellow-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">All Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="joined" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Joined ({projects.filter(p => p.is_member).length})</TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Created ({projects.filter(p => p.created_by === user?.id).length})</TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Saved ({savedProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            </div>

            {/* Projects Display */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'created' 
                      ? "You haven't created any projects yet. Click 'Create Project' to get started."
                      : activeTab === 'saved'
                      ? "You haven't saved any projects yet. Click the save icon on projects to add them here."
                      : "Try adjusting your search criteria or check back later for new projects."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (activeTab === "joined" || activeTab === "created" || activeTab === "saved") ? (
              // Table format for joined, created, and saved tabs
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div 
                              className="font-semibold cursor-pointer hover:text-primary transition-colors"
                              onClick={() => {
                                handleViewProjectDetails(project);
                              }}
                            >
                              {project.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {project.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(project.project_type)}
                            <span className="text-sm">{project.project_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                            <Badge variant="outline" className="text-xs capitalize">
                              {project.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{project.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-green-600">
                            {formatBudget(project.budget_min, project.budget_max, project.budget_currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(project.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activeTab === "created" ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewProjectDetails(project)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleShareProject(project)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewProjectDetails(project)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSaveProject(project.id)}
                                  className={savedProjects.includes(project.id) ? "text-primary" : ""}
                                >
                                  <Bookmark className={`h-4 w-4 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleShareProject(project)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Card format for "All Projects" tab
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow border-yellow-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1 text-gray-900">{project.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeIcon(project.project_type)}
                            <span className="text-sm text-gray-600">
                              {project.project_type} • {project.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {project.featured && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {project.popular && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                          <span className="text-sm text-muted-foreground capitalize">{project.status}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm text-muted-foreground">{project.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSaveProject(project.id)}
                            className={savedProjects.includes(project.id) ? "text-primary" : ""}
                          >
                            <Bookmark className={`h-4 w-4 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShareProject(project)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.team_size} team members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(project.created_at)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Budget: {formatBudget(project.budget_min, project.budget_max, project.budget_currency)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            {project.duration_minutes ? `${project.duration_minutes} minutes` : 
                             project.episodes ? `${project.episodes} episodes` : 'Duration not specified'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                          onClick={() => handleViewProjectDetails(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {!project.is_member && project.created_by !== user?.id && (
                          <Button 
                            variant={appliedProjects.includes(project.id) ? "default" : "outline"}
                            size="sm"
                            className={appliedProjects.includes(project.id) 
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white" 
                              : "border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                            }
                            onClick={() => handleJoinProject(project.id)}
                            disabled={appliedProjects.includes(project.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {appliedProjects.includes(project.id) ? "Applied" : "Join Project"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Project Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Share your creative vision and find collaborators
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. The Silent..." className="border-yellow-200 focus:border-yellow-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="project_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Project Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Film">Film</SelectItem>
                            <SelectItem value="Television">Television</SelectItem>
                            <SelectItem value="Web Series">Web Series</SelectItem>
                            <SelectItem value="Documentary">Documentary</SelectItem>
                            <SelectItem value="Short Film">Short Film</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project, its vision, and what you're looking for in collaborators..."
                          className="min-h-[100px] border-yellow-200 focus:border-yellow-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Feature Film">Feature Film</SelectItem>
                            <SelectItem value="Short Film">Short Film</SelectItem>
                            <SelectItem value="Web Series">Web Series</SelectItem>
                            <SelectItem value="TV Series">TV Series</SelectItem>
                            <SelectItem value="Documentary">Documentary</SelectItem>
                            <SelectItem value="Music Video">Music Video</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="pre-production">Pre-Production</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="post-production">Post-Production</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Location</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g. Los Angeles, CA" className="border-yellow-200 focus:border-yellow-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Budget Min (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 1000000"
                            className="border-yellow-200 focus:border-yellow-500"
                            value={field.value === 0 ? "" : field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : parseInt(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budget_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Budget Max (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 5000000"
                            className="border-yellow-200 focus:border-yellow-500"
                            value={field.value === 0 ? "" : field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : parseInt(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 120"
                            className="border-yellow-200 focus:border-yellow-500"
                            value={field.value === 0 ? "" : field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : parseInt(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="episodes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Episodes (for series)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 8"
                            className="border-yellow-200 focus:border-yellow-500"
                            value={field.value === 0 ? "" : field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : parseInt(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="skills_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Skills Required (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Director, Cinematographer, Editor" className="border-yellow-200 focus:border-yellow-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Filter Panel */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-80 bg-background h-full shadow-lg overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type</label>
                    <Select value={filters.projectType} onValueChange={(value) => setFilters(prev => ({ ...prev, projectType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Film">Film</SelectItem>
                        <SelectItem value="Television">Television</SelectItem>
                        <SelectItem value="Web Series">Web Series</SelectItem>
                        <SelectItem value="Documentary">Documentary</SelectItem>
                        <SelectItem value="Short Film">Short Film</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Feature Film">Feature Film</SelectItem>
                        <SelectItem value="Short Film">Short Film</SelectItem>
                        <SelectItem value="Web Series">Web Series</SelectItem>
                        <SelectItem value="TV Series">TV Series</SelectItem>
                        <SelectItem value="Documentary">Documentary</SelectItem>
                        <SelectItem value="Music Video">Music Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="pre-production">Pre-Production</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="post-production">Post-Production</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                        <SelectItem value="New York, NY">New York, NY</SelectItem>
                        <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                        <SelectItem value="London, UK">London, UK</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Range</label>
                    <Select value={filters.budgetRange} onValueChange={(value) => setFilters(prev => ({ ...prev, budgetRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Budgets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Budgets</SelectItem>
                        <SelectItem value="low">Under ₹10L</SelectItem>
                        <SelectItem value="medium">₹10L - ₹50L</SelectItem>
                        <SelectItem value="high">Above ₹50L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setFilters({
                        projectType: "all",
                        category: "all",
                        status: "all",
                        location: "all",
                        budgetRange: "all"
                      })}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Details Dialog */}
        <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject?.title}</DialogTitle>
              <DialogDescription>
                {selectedProject?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6">
                {/* Tabs for created projects */}
                {selectedProject.created_by === user?.id ? (
                  <Tabs value={projectDetailsTab} onValueChange={setProjectDetailsTab}>
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="details">Project Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-6">
                      {/* Project Details Content */}
                      <div className="space-y-6">
                        {/* Project Overview */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Project Overview</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="font-medium">{selectedProject.project_type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="font-medium">{selectedProject.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant="outline" className="capitalize">{selectedProject.status}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-medium">{selectedProject.location}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Budget:</span>
                                <span className="font-medium text-green-600">
                                  {formatBudget(selectedProject.budget_min, selectedProject.budget_max, selectedProject.budget_currency)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">
                                  {selectedProject.duration_minutes ? `${selectedProject.duration_minutes} minutes` : 
                                   selectedProject.episodes ? `${selectedProject.episodes} episodes` : 'Not specified'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Team Size:</span>
                                <span className="font-medium">{selectedProject.team_size} members</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span className="font-medium">{formatDate(selectedProject.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Full Description */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Project Description</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">
                              {selectedProject.full_description || selectedProject.description}
                            </p>
                          </div>
                        </div>

                        {/* Skills Required */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Skills Required</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.skills_required?.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                                {skill}
                              </Badge>
                            )) || <span className="text-muted-foreground">No skills specified</span>}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Requirements</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                              {selectedProject.requirements?.map((req, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{req}</span>
                                </li>
                              )) || <span className="text-muted-foreground">No specific requirements listed</span>}
                            </ul>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Benefits & Perks</h3>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                              {selectedProject.benefits?.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="text-green-600 mt-1">✓</span>
                                  <span>{benefit}</span>
                                </li>
                              )) || <span className="text-muted-foreground">Benefits will be discussed during interview</span>}
                            </ul>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Project Timeline</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedProject.timeline && Object.entries(selectedProject.timeline).map(([phase, duration]) => (
                              <div key={phase} className="bg-blue-50 p-3 rounded-lg text-center">
                                <div className="text-sm font-medium capitalize">{phase.replace('_', ' ')}</div>
                                <div className="text-xs text-muted-foreground mt-1">{duration}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-3 text-lg">Target Audience</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-700">{selectedProject.target_audience}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-3 text-lg">Distribution Plan</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-700">{selectedProject.distribution_plan}</p>
                            </div>
                          </div>
                        </div>

                        {/* Production Notes */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Production Notes</h3>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">{selectedProject.production_notes}</p>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Contact Information</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{selectedProject.contact_info?.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{selectedProject.contact_info?.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Preferred Contact:</span>
                                <span className="font-medium">{selectedProject.contact_info?.preferred_contact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  // Regular project details for non-creators
                  <div className="space-y-6">
                    {/* Project Overview */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Project Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{selectedProject.project_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{selectedProject.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline" className="capitalize">{selectedProject.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{selectedProject.location}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium text-green-600">
                              {formatBudget(selectedProject.budget_min, selectedProject.budget_max, selectedProject.budget_currency)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">
                              {selectedProject.duration_minutes ? `${selectedProject.duration_minutes} minutes` : 
                               selectedProject.episodes ? `${selectedProject.episodes} episodes` : 'Not specified'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Team Size:</span>
                            <span className="font-medium">{selectedProject.team_size} members</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">{formatDate(selectedProject.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Project Description</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedProject.full_description || selectedProject.description}
                        </p>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.skills_required?.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                            {skill}
                          </Badge>
                        )) || <span className="text-muted-foreground">No skills specified</span>}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Requirements</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {selectedProject.requirements?.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          )) || <span className="text-muted-foreground">No specific requirements listed</span>}
                        </ul>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Benefits & Perks</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {selectedProject.benefits?.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 mt-1">✓</span>
                              <span>{benefit}</span>
                            </li>
                          )) || <span className="text-muted-foreground">Benefits will be discussed during interview</span>}
                        </ul>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Project Timeline</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProject.timeline && Object.entries(selectedProject.timeline).map(([phase, duration]) => (
                          <div key={phase} className="bg-blue-50 p-3 rounded-lg text-center">
                            <div className="text-sm font-medium capitalize">{phase.replace('_', ' ')}</div>
                            <div className="text-xs text-muted-foreground mt-1">{duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">Target Audience</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProject.target_audience}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">Distribution Plan</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProject.distribution_plan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Production Notes */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Production Notes</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedProject.production_notes}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Contact Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{selectedProject.contact_info?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{selectedProject.contact_info?.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preferred Contact:</span>
                            <span className="font-medium">{selectedProject.contact_info?.preferred_contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                        onClick={() => handleJoinProject(selectedProject.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Project
                      </Button>
                      <Button variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50" onClick={() => handleShareProject(selectedProject)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Project
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
