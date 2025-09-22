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

  useEffect(() => {
    fetchProjects();
    fetchLikedProjects();
    fetchSavedProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      // Fetch likes and members separately for each project
      const projectsWithDetails = await Promise.all(
        (data || []).map(async (project) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('project_likes')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          // Check if user liked this project
          const { data: userLike } = await supabase
            .from('project_likes')
            .select('id')
            .eq('project_id', project.id)
            .eq('user_id', user?.id || '')
            .single();

          // Check if user is a member
          const { data: userMember } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', project.id)
            .eq('user_id', user?.id || '')
            .single();

          return {
            ...project,
            likes_count: likesCount || 0,
            is_liked: !!userLike,
            is_member: !!userMember,
          };
        })
      );

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
      const { data, error } = await supabase
        .from('project_likes')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching liked projects:', error);
        return;
      }

      setLikedProjects(data?.map(like => like.project_id) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSavedProjects = async () => {
    if (!user) return;
    
    try {
      // For now, we'll use the same table as likes for saved projects
      // In a real app, you might want a separate saved_projects table
      const { data, error } = await supabase
        .from('project_likes')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved projects:', error);
        return;
      }

      setSavedProjects(data?.map(like => like.project_id) || []);
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

      const { error } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description,
          project_type: data.project_type,
          category: data.category,
          status: data.status,
          location: data.location,
          budget_min: data.budget_min && data.budget_min > 0 ? data.budget_min : null,
          budget_max: data.budget_max && data.budget_max > 0 ? data.budget_max : null,
          duration_minutes: data.duration_minutes && data.duration_minutes > 0 ? data.duration_minutes : null,
          episodes: data.episodes && data.episodes > 0 ? data.episodes : null,
          skills_required: skillsArray,
          created_by: user.id,
        });

      if (error) {
        console.error('Error creating project:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create project"
        });
      } else {
        toast({
          title: "Success",
          description: "Project created successfully"
        });
        form.reset();
        setIsCreateDialogOpen(false);
        fetchProjects();
      }
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
        const { error } = await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error unsaving project:', error);
          return;
        }

        setSavedProjects(prev => prev.filter(id => id !== projectId));
        toast({
          title: "Project Unsaved",
          description: "Project has been removed from your saved list"
        });
      } else {
        // Save project
        const { error } = await supabase
          .from('project_likes')
          .insert({
            project_id: projectId,
            user_id: user.id,
          });

        if (error) {
          console.error('Error saving project:', error);
          return;
        }

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
        const { error } = await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error unliking project:', error);
          return;
        }

        setLikedProjects(prev => prev.filter(id => id !== projectId));
      } else {
        // Like project
        const { error } = await supabase
          .from('project_likes')
          .insert({
            project_id: projectId,
            user_id: user.id,
          });

        if (error) {
          console.error('Error liking project:', error);
          return;
        }

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
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: user.id,
        });

      if (error) {
        console.error('Error joining project:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to join project"
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully joined the project"
        });
        fetchProjects();
      }
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
    setSelectedProject(project);
    setProjectDetailsTab("details");
    setShowProjectDetails(true);
    
    // If it's the user's own project, fetch applicants
    if (project.created_by === user?.id) {
      fetchApplicants(project.id);
    }
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
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Discover and collaborate on film and entertainment projects
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects, titles, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="joined">Joined ({projects.filter(p => p.is_member).length})</TabsTrigger>
            <TabsTrigger value="created">Created ({projects.filter(p => p.created_by === user?.id).length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
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
                                if (activeTab === "created" || activeTab === "joined") {
                                  navigate(`/projects/${project.id}`);
                                } else {
                                  handleViewProjectDetails(project);
                                }
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
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeIcon(project.project_type)}
                            <span className="text-sm text-muted-foreground">
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
                          className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          onClick={() => handleViewProjectDetails(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {!project.is_member && project.created_by !== user?.id && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleJoinProject(project.id)}
                          >
                            <UserPlus className="h-4 w-4" />
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
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. The Silent..." {...field} />
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
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project, its vision, and what you're looking for in collaborators..."
                          className="min-h-[100px]"
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
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Los Angeles, CA" {...field} />
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
                        <FormLabel>Budget Min (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 1000000"
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
                        <FormLabel>Budget Max (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 5000000"
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
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 120"
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
                        <FormLabel>Episodes (for series)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 8"
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
                      <FormLabel>Skills Required (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Director, Cinematographer, Editor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
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
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Project Details</TabsTrigger>
                      <TabsTrigger value="applicants">
                        Applicants ({applicants.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-6">
                      {/* Project Details Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Project Information</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span>{selectedProject.project_type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <span>{selectedProject.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant="outline" className="capitalize">{selectedProject.status}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span>{selectedProject.location}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Budget & Duration</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Budget:</span>
                                <span className="font-medium text-green-600">
                                  {formatBudget(selectedProject.budget_min, selectedProject.budget_max, selectedProject.budget_currency)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span>
                                  {selectedProject.duration_minutes ? `${selectedProject.duration_minutes} minutes` : 
                                   selectedProject.episodes ? `${selectedProject.episodes} episodes` : 'Not specified'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Team Size:</span>
                                <span>{selectedProject.team_size} members</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.skills_required?.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              )) || <span className="text-muted-foreground text-sm">No skills specified</span>}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Project Details</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{formatDate(selectedProject.created_at)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{formatDate(selectedProject.updated_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="applicants" className="space-y-6">
                      {/* Applicants Content */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Project Applicants</h3>
                        {applicants.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No applicants yet</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {applicants.map((applicant) => (
                              <Card key={applicant.id} className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                      <span className="text-white font-semibold text-sm">
                                        {applicant.avatar}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-lg">{applicant.name}</h4>
                                      <p className="text-muted-foreground text-sm">{applicant.email}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>Applied: {formatDate(applicant.appliedDate)}</span>
                                        <span>Experience: {applicant.experience}</span>
                                        <span>Role: {applicant.role}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {applicant.skills.map((skill: string, index: number) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge 
                                      variant={
                                        applicant.status === "shortlisted" ? "default" :
                                        applicant.status === "reviewed" ? "secondary" : "outline"
                                      }
                                    >
                                      {applicant.status}
                                    </Badge>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">
                                        View Profile
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        Contact
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  // Regular project details for non-creators
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Project Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{selectedProject.project_type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Category:</span>
                              <span>{selectedProject.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant="outline" className="capitalize">{selectedProject.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Location:</span>
                              <span>{selectedProject.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Budget & Duration</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-medium text-green-600">
                                {formatBudget(selectedProject.budget_min, selectedProject.budget_max, selectedProject.budget_currency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>
                                {selectedProject.duration_minutes ? `${selectedProject.duration_minutes} minutes` : 
                                 selectedProject.episodes ? `${selectedProject.episodes} episodes` : 'Not specified'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => handleJoinProject(selectedProject.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Project
                      </Button>
                      <Button variant="outline" onClick={() => handleShareProject(selectedProject)}>
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
