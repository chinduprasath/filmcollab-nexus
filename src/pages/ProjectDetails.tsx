import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Building, 
  Users, 
  Film, 
  Tv, 
  Star, 
  TrendingUp,
  UserPlus,
  MessageCircle,
  CheckSquare,
  User,
  Send,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
}

// Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assigned_to: string;
  due_date: string;
  created_at: string;
}

// Team member interface
interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joined_at: string;
}

// Applicant interface
interface Applicant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  experience: string;
  skills: string[];
  role: string;
  portfolio?: string;
}

// Chat message interface
interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  timestamp: string;
  avatar: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", assigned_to: "", due_date: "" });
  const [deleteMemberDialog, setDeleteMemberDialog] = useState<{ open: boolean; member: TeamMember | null }>({ open: false, member: null });

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchTasks();
      fetchTeamMembers();
      fetchApplicants();
      fetchChatMessages();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch project details"
        });
        navigate('/projects');
        return;
      }

      setProject(data);
    } catch (error) {
      console.error('Error:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      // Mock tasks data - in a real app, you'd fetch from your database
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Script Writing",
          description: "Complete the first draft of the script",
          status: "in-progress",
          assigned_to: "John Smith",
          due_date: "2025-01-15",
          created_at: "2025-01-08"
        },
        {
          id: "2",
          title: "Location Scouting",
          description: "Find and secure filming locations",
          status: "pending",
          assigned_to: "Sarah Johnson",
          due_date: "2025-01-20",
          created_at: "2025-01-08"
        },
        {
          id: "3",
          title: "Casting",
          description: "Hold auditions for main characters",
          status: "completed",
          assigned_to: "Mike Chen",
          due_date: "2025-01-10",
          created_at: "2025-01-08"
        }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Mock team members data - in a real app, you'd fetch from your database
      const mockTeamMembers: TeamMember[] = [
        {
          id: "1",
          user_id: "user1",
          name: "John Smith",
          email: "john.smith@email.com",
          role: "Director",
          avatar: "JS",
          joined_at: "2025-01-01"
        },
        {
          id: "2",
          user_id: "user2",
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          role: "Producer",
          avatar: "SJ",
          joined_at: "2025-01-02"
        },
        {
          id: "3",
          user_id: "user3",
          name: "Mike Chen",
          email: "mike.chen@email.com",
          role: "Cinematographer",
          avatar: "MC",
          joined_at: "2025-01-03"
        }
      ];

      // Add current user to team members if not already present
      if (user?.id && !mockTeamMembers.some(member => member.user_id === user.id)) {
        const currentUserMember: TeamMember = {
          id: "current-user",
          user_id: user.id,
          name: user.user_metadata?.full_name || "Current User",
          email: user.email || "user@email.com",
          role: "Team Member",
          avatar: (user.user_metadata?.full_name || "CU").split(' ').map(n => n[0]).join('').toUpperCase(),
          joined_at: new Date().toISOString().split('T')[0]
        };
        mockTeamMembers.push(currentUserMember);
      }

      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchApplicants = async () => {
    try {
      // Mock applicants data - in a real app, you'd fetch from your database
      const mockApplicants: Applicant[] = [
        {
          id: "1",
          name: "Alice Brown",
          email: "alice.brown@email.com",
          avatar: "AB",
          appliedDate: "2025-01-08",
          status: "pending",
          experience: "3 years",
          skills: ["Actor", "Voice Artist"],
          role: "Lead Actor",
          portfolio: "alicebrown.com"
        },
        {
          id: "2",
          name: "David Wilson",
          email: "david.w@email.com",
          avatar: "DW",
          appliedDate: "2025-01-07",
          status: "reviewed",
          experience: "5 years",
          skills: ["Sound Designer", "Audio Engineer"],
          role: "Sound Designer",
          portfolio: "davidwilson.audio"
        },
        {
          id: "3",
          name: "Emma Davis",
          email: "emma.d@email.com",
          avatar: "ED",
          appliedDate: "2025-01-06",
          status: "shortlisted",
          experience: "7 years",
          skills: ["Editor", "Post-Production"],
          role: "Video Editor",
          portfolio: "emmadavis.film"
        }
      ];
      setApplicants(mockApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const fetchChatMessages = async () => {
    try {
      // Mock chat messages data - in a real app, you'd fetch from your database
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          user_id: "user1",
          user_name: "John Smith",
          message: "Welcome everyone to the project! Let's make this amazing.",
          timestamp: "2025-01-08T10:00:00Z",
          avatar: "JS"
        },
        {
          id: "2",
          user_id: "user2",
          user_name: "Sarah Johnson",
          message: "Thanks John! I'm excited to work with this team.",
          timestamp: "2025-01-08T10:05:00Z",
          avatar: "SJ"
        },
        {
          id: "3",
          user_id: "user3",
          user_name: "Mike Chen",
          message: "The script looks great. When do we start location scouting?",
          timestamp: "2025-01-08T10:10:00Z",
          avatar: "MC"
        }
      ];
      setChatMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      // In a real app, you'd update the database
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus as any } : task
      ));
      
      toast({
        title: "Task Updated",
        description: "Task status has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status"
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: "pending",
        assigned_to: newTask.assigned_to,
        due_date: newTask.due_date,
        created_at: new Date().toISOString()
      };

      setTasks(prev => [...prev, task]);
      setNewTask({ title: "", description: "", assigned_to: "", due_date: "" });
      
      toast({
        title: "Task Added",
        description: "New task has been added successfully"
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user_id: user?.id || "",
        user_name: user?.email?.split('@')[0] || "User",
        message: newMessage,
        timestamp: new Date().toISOString(),
        avatar: user?.email?.charAt(0).toUpperCase() || "U"
      };

      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleApplicantStatusUpdate = async (applicantId: string, newStatus: string) => {
    try {
      setApplicants(prev => prev.map(applicant => 
        applicant.id === applicantId ? { ...applicant, status: newStatus as any } : applicant
      ));
      
      toast({
        title: "Status Updated",
        description: "Applicant status has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating applicant status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update applicant status"
      });
    }
  };

  const handleDeleteTeamMember = async (member: TeamMember) => {
    try {
      setTeamMembers(prev => prev.filter(m => m.id !== member.id));
      setDeleteMemberDialog({ open: false, member: null });
      
      toast({
        title: "Member Removed",
        description: `${member.name} has been removed from the team`
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team member"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-blue-500";
      case "planning": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "reviewed": return "bg-purple-500";
      case "shortlisted": return "bg-green-500";
      case "rejected": return "bg-red-500";
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
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatBudget = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `${currency}${(min / 10000000).toFixed(1)}Cr - ${currency}${(max / 10000000).toFixed(1)}Cr`;
    if (min) return `${currency}${(min / 10000000).toFixed(1)}Cr+`;
    return `${currency}${(max! / 10000000).toFixed(1)}Cr`;
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Loading...">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout pageTitle="Project Not Found">
        <div className="text-center py-12">
          <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Project Not Found</h3>
          <p className="text-muted-foreground">The project you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">Back to Projects</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={project.title}>
      <div className="max-w-6xl mx-auto py-2 px-2 sm:px-4 lg:px-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-2 flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <Card className="mb-2">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-foreground">{project.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(project.project_type)}
                    <span>{project.project_type} • {project.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                    <span className="capitalize">{project.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDate(project.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {project.featured && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {project.popular && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${project.created_by === user?.id ? 'grid-cols-5' : 'grid-cols-3'} bg-muted`}>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Chats
            </TabsTrigger>
            {project.created_by === user?.id && (
              <>
                <TabsTrigger 
                  value="team" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Team ({teamMembers.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="applicants" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Applicants ({applicants.length})
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-sm">{project.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Required Skills */}
                {project.skills_required && project.skills_required.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex flex-wrap gap-1">
                        {project.skills_required.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Project Type:</span>
                      <Badge variant="secondary" className="text-xs">{project.project_type}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline" className="text-xs">{project.category}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="capitalize text-xs">{project.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-xs">{project.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="text-xs">{project.team_size} members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-xs">{formatDate(project.created_at)}</span>
                    </div>
                    {project.budget_min && project.budget_max && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium text-green-600 text-xs">
                          {formatBudget(project.budget_min, project.budget_max, project.budget_currency)}
                        </span>
                      </div>
                    )}
                    {project.duration_minutes && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="text-xs">{project.duration_minutes} minutes</span>
                      </div>
                    )}
                    {project.episodes && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Episodes:</span>
                        <span className="text-xs">{project.episodes} episodes</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold">Project Tasks</h3>
              {project.created_by === user?.id && (
                <Button onClick={() => setActiveTab("tasks")} size="sm">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>

            {/* Add Task Form - Only for project creators */}
            {project.created_by === user?.id && (
              <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Add New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Select
                    value={newTask.assigned_to}
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_to: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                  <Button onClick={handleAddTask}>
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{task.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Assigned to: {task.assigned_to}</span>
                          <span>Due: {formatDate(task.due_date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.created_by === user?.id ? (
                          <Select
                            value={task.status}
                            onValueChange={(value) => handleTaskStatusUpdate(task.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="capitalize">
                            {task.status}
                          </Badge>
                        )}
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats" className="space-y-2">
            <Card className="h-[400px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-4 w-4" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-2">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input - Available for all users */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Members Tab - Only for project creators */}
          {project.created_by === user?.id && (
            <TabsContent value="team" className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {formatDate(member.joined_at)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteMemberDialog({ open: true, member })}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          )}

          {/* Applicants Tab - Only for project creators */}
          {project.created_by === user?.id && (
            <TabsContent value="applicants" className="space-y-2">
            <div className="space-y-2">
              {applicants.map((applicant) => (
                <Card key={applicant.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {applicant.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{applicant.name}</h4>
                          <p className="text-muted-foreground text-sm">{applicant.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Applied: {formatDate(applicant.appliedDate)}</span>
                            <span>Experience: {applicant.experience}</span>
                            <span>Role: {applicant.role}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {applicant.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          {applicant.portfolio && (
                            <p className="text-sm text-blue-600 mt-2">
                              Portfolio: <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="underline">{applicant.portfolio}</a>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Select
                          value={applicant.status}
                          onValueChange={(value) => handleApplicantStatusUpdate(applicant.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          )}
        </Tabs>

        {/* Delete Team Member Confirmation Dialog - Only for project creators */}
        {project.created_by === user?.id && (
          <AlertDialog open={deleteMemberDialog.open} onOpenChange={(open) => setDeleteMemberDialog({ open, member: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {deleteMemberDialog.member?.name} from the team? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMemberDialog.member && handleDeleteTeamMember(deleteMemberDialog.member)}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        )}
      </div>
    </AppLayout>
  );
}
