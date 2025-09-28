import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Building,
  Briefcase,
  Star,
  Share2,
  Bookmark,
  Film,
  Tv,
  UserPlus,
  Heart,
  Eye,
  MessageCircle,
  CheckSquare,
  Plus,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  created_by: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  popular: boolean;
  likes_count: number;
  is_member: boolean;
  is_liked: boolean;
  is_saved: boolean;
  full_description?: string;
  production_notes?: string;
  target_audience?: string;
  distribution_plan?: string;
  timeline?: string;
  requirements?: string;
  benefits?: string;
  contact_info?: string;
}

interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joined_date: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  message: string;
  timestamp: string;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: string;
  skills: string[];
  applied_date: string;
  status: 'pending' | 'accepted' | 'rejected';
  avatar: string;
}

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sourceTab, setSourceTab] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "medium" as const,
    due_date: ""
  });

  // Hardcoded projects data
  const hardcodedProjects: Project[] = [
    {
      id: "proj-1",
      title: "Indie Film Production",
      description: "An independent film exploring themes of identity and belonging in modern society.",
      project_type: "Film",
      category: "Drama",
      status: "ongoing",
      location: "Los Angeles, CA",
      budget_min: 500000,
      budget_max: 1000000,
      budget_currency: "₹",
      duration_minutes: 120,
      episodes: null,
      team_size: 8,
      created_by: "user-1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      featured: true,
      popular: false,
      likes_count: 45,
      is_member: false,
      is_liked: false,
      is_saved: false,
      full_description: "This independent film project explores the complex themes of identity, belonging, and self-discovery in contemporary society. Set against the backdrop of a bustling metropolis, the story follows the journey of a young artist who must navigate the challenges of pursuing their dreams while maintaining their authentic self. The film combines elements of drama and psychological thriller to create a compelling narrative that resonates with audiences of all ages.",
      production_notes: "Production is scheduled to begin in March 2024 with principal photography expected to last 6 weeks. We are looking for experienced crew members who are passionate about independent cinema and willing to work collaboratively in a creative environment.",
      target_audience: "Young adults aged 18-35, film festival audiences, independent cinema enthusiasts",
      distribution_plan: "Film festival circuit, streaming platforms, limited theatrical release",
      timeline: "Pre-production: Feb-Mar 2024, Production: Mar-Apr 2024, Post-production: May-Jul 2024, Release: Aug 2024",
      requirements: "Experience in independent film production, strong communication skills, ability to work in fast-paced environment, creative problem-solving abilities",
      benefits: "Creative freedom, networking opportunities, portfolio building, festival recognition potential, collaborative work environment",
      contact_info: "Email: producer@indiefilm.com, Phone: +1 (555) 123-4567"
    },
    {
      id: "proj-2",
      title: "Web Series: Digital Nomads",
      description: "A comedy web series following digital nomads as they work and travel around the world.",
      project_type: "Television",
      category: "Comedy",
      status: "planning",
      location: "Remote",
      budget_min: 200000,
      budget_max: 500000,
      budget_currency: "₹",
      duration_minutes: null,
      episodes: 8,
      team_size: 12,
      created_by: "user-2",
      created_at: "2024-01-14T09:00:00Z",
      updated_at: "2024-01-14T09:00:00Z",
      featured: false,
      popular: true,
      likes_count: 78,
      is_member: true,
      is_liked: true,
      is_saved: true,
      full_description: "Digital Nomads is a comedy web series that follows a group of remote workers as they navigate the challenges and adventures of working while traveling the world. Each episode explores different aspects of the digital nomad lifestyle, from finding reliable WiFi in exotic locations to dealing with time zone differences and cultural misunderstandings.",
      production_notes: "The series will be shot in multiple international locations, requiring a flexible and adaptable crew. We're looking for team members who are comfortable with travel and can work in various cultural contexts.",
      target_audience: "Digital nomads, remote workers, travel enthusiasts, comedy fans aged 25-45",
      distribution_plan: "YouTube, streaming platforms, social media marketing",
      timeline: "Pre-production: Jan-Feb 2024, Production: Mar-Jun 2024, Post-production: Jul-Sep 2024, Release: Oct 2024",
      requirements: "Travel experience preferred, adaptability to different cultures, strong communication skills, experience with remote collaboration",
      benefits: "Travel opportunities, international networking, diverse cultural experiences, flexible work schedule",
      contact_info: "Email: casting@digitalnomads.com, Phone: +1 (555) 234-5678"
    },
    {
      id: "proj-3",
      title: "Documentary: Climate Change Impact",
      description: "A documentary examining the real-world impact of climate change on coastal communities.",
      project_type: "Film",
      category: "Documentary",
      status: "ongoing",
      location: "Miami, FL",
      budget_min: 300000,
      budget_max: 600000,
      budget_currency: "₹",
      duration_minutes: 90,
      episodes: null,
      team_size: 6,
      created_by: "user-3",
      created_at: "2024-01-13T08:00:00Z",
      updated_at: "2024-01-13T08:00:00Z",
      featured: false,
      popular: false,
      likes_count: 32,
      is_member: false,
      is_liked: false,
      is_saved: false,
      full_description: "This documentary project aims to shed light on the real-world impact of climate change on coastal communities. Through intimate interviews and powerful visuals, we'll explore how rising sea levels, increased storm intensity, and environmental degradation are affecting the lives of people who call these areas home.",
      production_notes: "Documentary filming requires sensitivity and respect for the communities we're documenting. We need crew members who understand the importance of ethical storytelling and can work with vulnerable populations.",
      target_audience: "Environmental activists, documentary film enthusiasts, policy makers, general public interested in climate issues",
      distribution_plan: "Film festivals, educational institutions, streaming platforms, environmental organizations",
      timeline: "Research: Jan-Feb 2024, Production: Mar-May 2024, Post-production: Jun-Aug 2024, Release: Sep 2024",
      requirements: "Documentary experience, environmental awareness, sensitivity to vulnerable communities, strong research skills",
      benefits: "Meaningful impact, environmental advocacy, educational value, festival potential",
      contact_info: "Email: director@climatefilm.com, Phone: +1 (555) 345-6789"
    },
    {
      id: "proj-4",
      title: "Music Video Production",
      description: "High-energy music video for an upcoming pop artist's latest single.",
      project_type: "Film",
      category: "Music Video",
      status: "planning",
      location: "New York, NY",
      budget_min: 100000,
      budget_max: 250000,
      budget_currency: "₹",
      duration_minutes: 4,
      episodes: null,
      team_size: 15,
      created_by: "user-4",
      created_at: "2024-01-12T07:00:00Z",
      updated_at: "2024-01-12T07:00:00Z",
      featured: false,
      popular: true,
      likes_count: 89,
      is_member: false,
      is_liked: false,
      is_saved: false,
      full_description: "This music video project will showcase the artist's latest single with a high-energy, visually stunning production. The concept involves multiple locations, choreography, and special effects to create an engaging visual experience that complements the song's upbeat tempo and contemporary pop sound.",
      production_notes: "Fast-paced production schedule with multiple location shoots. Looking for experienced crew who can work efficiently under tight deadlines while maintaining high production values.",
      target_audience: "Pop music fans aged 16-35, music video enthusiasts, social media audiences",
      distribution_plan: "YouTube, music streaming platforms, social media promotion, music television",
      timeline: "Pre-production: Jan 2024, Production: Feb 2024, Post-production: Mar 2024, Release: Apr 2024",
      requirements: "Music video experience, ability to work under tight deadlines, creative problem-solving, experience with special effects",
      benefits: "High-profile project, portfolio enhancement, networking with music industry professionals, creative collaboration",
      contact_info: "Email: producer@musicvideo.com, Phone: +1 (555) 456-7890"
    },
    {
      id: "proj-5",
      title: "Corporate Training Video",
      description: "Professional training video series for corporate onboarding and skill development.",
      project_type: "Television",
      category: "Corporate",
      status: "ongoing",
      location: "Chicago, IL",
      budget_min: 150000,
      budget_max: 300000,
      budget_currency: "₹",
      duration_minutes: null,
      episodes: 12,
      team_size: 8,
      created_by: "user-5",
      created_at: "2024-01-11T06:00:00Z",
      updated_at: "2024-01-11T06:00:00Z",
      featured: false,
      popular: false,
      likes_count: 23,
      is_member: true,
      is_liked: false,
      is_saved: true,
      full_description: "This corporate training video series will provide comprehensive onboarding and skill development content for a Fortune 500 company. The series covers topics including company culture, technical skills, leadership development, and workplace safety protocols.",
      production_notes: "Professional corporate environment requiring polished, high-quality production values. Content must be engaging while maintaining educational effectiveness and corporate brand standards.",
      target_audience: "Corporate employees, HR professionals, training departments, new hires",
      distribution_plan: "Internal corporate platform, learning management systems, HR departments",
      timeline: "Pre-production: Jan-Feb 2024, Production: Mar-May 2024, Post-production: Jun-Jul 2024, Release: Aug 2024",
      requirements: "Corporate video experience, understanding of adult learning principles, professional demeanor, experience with educational content",
      benefits: "Stable corporate client, professional portfolio, consistent work schedule, competitive compensation",
    },
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
      created_by: "current-user",
      created_at: "2024-12-10T09:00:00Z",
      updated_at: "2024-12-16T14:30:00Z",
      featured: false,
      popular: false,
      likes_count: 15,
      is_member: true,
      is_liked: false,
      is_saved: false,
      full_description: "This is a deeply personal indie film project that explores the complex dynamics of family relationships and cultural identity in modern India. The story follows a young protagonist who must navigate between traditional family expectations and personal dreams, creating a narrative that resonates with audiences across different cultural backgrounds. We're looking for passionate actors and crew members who can bring authenticity and emotional depth to this meaningful story.",
      production_notes: "This project is currently in pre-production phase. We're looking for experienced crew members who understand the nuances of indie filmmaking and can work within budget constraints while maintaining high production values. The project requires sensitivity to cultural themes and authentic storytelling.",
      target_audience: "Young adults aged 18-35, film festival audiences, independent cinema enthusiasts, audiences interested in cultural identity themes",
      distribution_plan: "Film festival circuit, independent cinema releases, streaming platforms, cultural events",
      timeline: "Pre-production: Dec 2024 - Feb 2025, Production: Mar - Apr 2025, Post-production: May - Jul 2025, Release: Aug 2025",
      requirements: "Experience in indie film production, understanding of cultural themes, ability to work with limited budgets, strong communication skills, passion for meaningful storytelling",
      benefits: "Creative freedom, meaningful project, festival recognition potential, portfolio building, networking with indie filmmakers, cultural impact",
      contact_info: "Email: indieproducer@filmcollab.com, Phone: +91 98765 43210"
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
      created_by: "current-user",
      created_at: "2024-11-20T11:15:00Z",
      updated_at: "2024-12-14T16:45:00Z",
      featured: false,
      popular: false,
      likes_count: 22,
      is_member: true,
      is_liked: false,
      is_saved: false,
      full_description: "This documentary project chronicles the inspiring journey of young Indian entrepreneurs who are building innovative tech solutions to address real-world problems. The film follows multiple startup founders as they navigate the challenges of building companies, securing funding, and making a positive impact on society through technology.",
      production_notes: "Currently in production phase. We need experienced documentary filmmakers who can capture authentic moments and tell compelling stories. The project involves filming in various tech hubs across India and requires understanding of startup culture and technology.",
      target_audience: "Entrepreneurs, tech enthusiasts, startup community, investors, general audience interested in innovation and entrepreneurship",
      distribution_plan: "Tech conferences, startup events, streaming platforms, educational institutions, business schools",
      timeline: "Production: Nov 2024 - Mar 2025, Post-production: Apr - Jun 2025, Release: Jul 2025",
      requirements: "Documentary filmmaking experience, understanding of startup ecosystem, ability to work with tech-savvy subjects, strong storytelling skills",
      benefits: "Access to startup ecosystem, networking opportunities, portfolio enhancement, potential for follow-up projects, industry recognition",
      contact_info: "Email: docproducer@filmcollab.com, Phone: +91 98765 43211"
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
      created_by: "current-user",
      created_at: "2024-10-15T08:30:00Z",
      updated_at: "2024-12-12T10:20:00Z",
      featured: false,
      popular: false,
      likes_count: 8,
      is_member: true,
      is_liked: false,
      is_saved: false,
      full_description: "The Last Letter is an emotionally resonant short film that tells the story of an elderly grandfather who writes heartfelt letters to his grandchildren, sharing life lessons and family memories. The film explores themes of family bonds, generational wisdom, and the power of written communication in our digital age.",
      production_notes: "Currently in post-production phase. The film has been shot and is being edited. We're looking for skilled editors who can enhance the emotional impact of the story through careful pacing and visual storytelling.",
      target_audience: "Film festival audiences, families, older adults, audiences interested in intergenerational stories",
      distribution_plan: "Film festivals, family events, educational screenings, streaming platforms",
      timeline: "Post-production: Oct 2024 - Jan 2025, Festival submissions: Feb - Mar 2025, Release: Apr 2025",
      requirements: "Short film editing experience, understanding of emotional storytelling, ability to work with limited footage, festival submission knowledge",
      benefits: "Festival recognition potential, emotional storytelling experience, portfolio enhancement, networking with indie filmmakers",
      contact_info: "Email: shortfilm@filmcollab.com, Phone: +91 98765 43212"
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
      created_by: "current-user",
      created_at: "2024-12-05T13:45:00Z",
      updated_at: "2024-12-15T11:30:00Z",
      featured: false,
      popular: false,
      likes_count: 18,
      is_member: true,
      is_liked: false,
      is_saved: false,
      full_description: "Urban Tales is an anthology web series that explores the diverse experiences of people living in modern Indian cities. Each episode focuses on different characters and their unique struggles, dreams, and relationships, creating a mosaic of urban life that reflects the complexity and vibrancy of contemporary India.",
      production_notes: "Currently in planning phase. We're developing scripts and assembling the creative team. Looking for experienced writers, directors, and producers who understand urban storytelling and can work on episodic content.",
      target_audience: "Young urban adults aged 20-40, streaming platform audiences, people interested in contemporary Indian culture and urban life",
      distribution_plan: "Streaming platforms, web series festivals, social media promotion, urban cultural events",
      timeline: "Planning: Dec 2024 - Feb 2025, Pre-production: Mar - Apr 2025, Production: May - Aug 2025, Post-production: Sep - Nov 2025, Release: Dec 2025",
      requirements: "Web series experience, understanding of urban themes, episodic storytelling skills, ability to work with diverse characters and stories",
      benefits: "Creative storytelling opportunities, streaming platform exposure, portfolio building, networking with web series creators",
      contact_info: "Email: urbantales@filmcollab.com, Phone: +91 98765 43213"
    }
  ];

  // Hardcoded data for tasks, chat, and applicants
  const hardcodedTasks: Task[] = [
    {
      id: "task-1",
      title: "Script Review and Finalization",
      description: "Review the final draft of the script and make necessary revisions before production begins.",
      assigned_to: "Sarah Johnson",
      assigned_by: "Project Creator",
      status: "in-progress",
      priority: "high",
      due_date: "2024-12-25",
      created_at: "2024-12-15T10:00:00Z"
    },
    {
      id: "task-2",
      title: "Location Scouting",
      description: "Find and secure filming locations for the Mumbai scenes.",
      assigned_to: "Michael Chen",
      assigned_by: "Project Creator",
      status: "pending",
      priority: "medium",
      due_date: "2024-12-30",
      created_at: "2024-12-16T09:00:00Z"
    },
    {
      id: "task-3",
      title: "Equipment Rental",
      description: "Arrange rental of camera equipment and lighting for the shoot.",
      assigned_to: "Emily Rodriguez",
      assigned_by: "Project Creator",
      status: "completed",
      priority: "high",
      due_date: "2024-12-20",
      created_at: "2024-12-10T14:00:00Z"
    }
  ];

  const hardcodedChatMessages: ChatMessage[] = [
    {
      id: "msg-1",
      user_id: "user-1",
      user_name: "Sarah Johnson",
      user_avatar: "SJ",
      message: "Hey team! Just finished reviewing the script. It looks great, but I have a few suggestions for the dialogue in scene 3.",
      timestamp: "2024-12-16T10:30:00Z"
    },
    {
      id: "msg-2",
      user_id: "user-2",
      user_name: "Michael Chen",
      user_avatar: "MC",
      message: "Thanks Sarah! I'll take a look at those suggestions. Also, I found some great locations in Bandra for the family scenes.",
      timestamp: "2024-12-16T11:15:00Z"
    },
    {
      id: "msg-3",
      user_id: "user-3",
      user_name: "Emily Rodriguez",
      user_avatar: "ER",
      message: "Perfect! I've secured the camera equipment. We'll have everything we need for the shoot next week.",
      timestamp: "2024-12-16T12:00:00Z"
    },
    {
      id: "msg-4",
      user_id: "user-4",
      user_name: "David Kim",
      user_avatar: "DK",
      message: "Great work everyone! The pre-production is coming together nicely. Let's schedule a team meeting for tomorrow to discuss the shooting schedule.",
      timestamp: "2024-12-16T13:45:00Z"
    }
  ];

  const hardcodedApplicants: Applicant[] = [
    {
      id: "app-1",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      role: "Actor",
      experience: "5 years",
      skills: ["Acting", "Dancing", "Voice Modulation"],
      applied_date: "2024-12-14",
      status: "pending",
      avatar: "PS"
    },
    {
      id: "app-2",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      role: "Cinematographer",
      experience: "8 years",
      skills: ["Cinematography", "Lighting", "Camera Operation"],
      applied_date: "2024-12-13",
      status: "accepted",
      avatar: "RK"
    },
    {
      id: "app-3",
      name: "Anita Singh",
      email: "anita.singh@email.com",
      role: "Production Assistant",
      experience: "2 years",
      skills: ["Production Management", "Coordination", "Logistics"],
      applied_date: "2024-12-12",
      status: "pending",
      avatar: "AS"
    }
  ];

  const projectMembers: ProjectMember[] = [
    {
      id: "member-1",
      name: "Sarah Johnson",
      role: "Director",
      avatar: "SJ",
      joined_date: "2024-01-10"
    },
    {
      id: "member-2",
      name: "Michael Chen",
      role: "Producer",
      avatar: "MC",
      joined_date: "2024-01-12"
    },
    {
      id: "member-3",
      name: "Emily Rodriguez",
      role: "Cinematographer",
      avatar: "ER",
      joined_date: "2024-01-14"
    },
    {
      id: "member-4",
      name: "David Kim",
      role: "Editor",
      avatar: "DK",
      joined_date: "2024-01-16"
    }
  ];

  const handleJoinProject = () => {
    setIsMember(true);
    toast({
      title: "Joined project",
      description: "You have successfully joined this project."
    });
  };

  const handleLeaveProject = () => {
    setIsMember(false);
    toast({
      title: "Left project",
      description: "You have left this project."
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked ? "Project removed from liked projects." : "Project added to liked projects."
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Unsaved" : "Saved",
      description: isSaved ? "Project removed from saved projects." : "Project added to saved projects."
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: project?.title || "Project",
      text: `Check out this project: ${project?.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Project link has been copied to clipboard."
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assigned_to: newTask.assigned_to,
      assigned_by: "Current User",
      status: "pending",
      priority: newTask.priority,
      due_date: newTask.due_date,
      created_at: new Date().toISOString()
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      assigned_to: "",
      priority: "medium",
      due_date: ""
    });
    setShowCreateTask(false);
    
    toast({
      title: "Task created",
      description: "New task has been created successfully."
    });
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    
    toast({
      title: "Task updated",
      description: `Task status updated to ${status}.`
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      user_id: "current-user",
      user_name: "Alex Rodriguez",
      user_avatar: "AR",
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleAcceptApplicant = (applicantId: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId ? { ...applicant, status: "accepted" } : applicant
    ));
    
    toast({
      title: "Applicant accepted",
      description: "The applicant has been accepted to the project."
    });
  };

  const handleRejectApplicant = (applicantId: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId ? { ...applicant, status: "rejected" } : applicant
    ));
    
    toast({
      title: "Applicant rejected",
      description: "The applicant has been rejected."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `${currency}${(min / 100000).toFixed(1)}L - ${currency}${(max / 100000).toFixed(1)}L`;
    if (min) return `${currency}${(min / 100000).toFixed(1)}L+`;
    return `${currency}${(max! / 100000).toFixed(1)}L`;
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

  useEffect(() => {
    const fetchProjectDetails = () => {
      // Get the source tab from URL parameters
      const tabParam = searchParams.get('tab');
      setSourceTab(tabParam || '');
      
      if (!projectId) {
        setLoading(false);
        return;
      }

      const foundProject = hardcodedProjects.find(project => project.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
        setIsSaved(foundProject.is_saved);
        setIsLiked(foundProject.is_liked);
        setIsMember(foundProject.is_member);
        setTasks(hardcodedTasks);
        setChatMessages(hardcodedChatMessages);
        setApplicants(hardcodedApplicants);
        setLoading(false);
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Project not found",
          description: "The requested project could not be found."
        });
      }
    };

    fetchProjectDetails();
  }, [projectId, searchParams, toast]);

  if (loading) {
    return (
      <AppLayout pageTitle="Project Details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout pageTitle="Project Not Found">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested project could not be found.</p>
            <Button onClick={() => navigate("/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={`${project.title} - Project Details`}>
      <div className="w-full space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {project.title}
                  </CardTitle>
                  {project.featured && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {project.popular && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTypeIcon(project.project_type)}
                  <span className="font-medium">{project.project_type} • {project.category}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                  <span className="text-sm text-muted-foreground capitalize">{project.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Project Details with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${sourceTab === 'created' ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            {sourceTab === 'created' && (
              <TabsTrigger value="applicants">Applicants</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Project Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Project Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {project?.full_description || project?.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Production Notes */}
                {project?.production_notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Production Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.production_notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Target Audience */}
                {project?.target_audience && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.target_audience}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Distribution Plan */}
                {project?.distribution_plan && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribution Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.distribution_plan}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline */}
                {project?.timeline && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.timeline}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {project?.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.requirements}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {project?.benefits && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.benefits}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Budget Range</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBudget(project?.budget_min, project?.budget_max, project?.budget_currency || "₹")}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {project?.duration_minutes ? `${project.duration_minutes} minutes` : 
                           project?.episodes ? `${project.episodes} episodes` : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Team Size</p>
                        <p className="text-sm text-muted-foreground">{project?.team_size} members</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Created Date</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(project?.created_at || "")}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Likes</p>
                        <p className="text-sm text-muted-foreground">{project?.likes_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                {project?.contact_info && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {project.contact_info}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6">
                    {isMember ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleLeaveProject}
                      >
                        Leave Project
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground" 
                        onClick={handleJoinProject}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Project
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Project Tasks</h3>
              <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Task Title</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Assign To</label>
                      <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_to: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask}>
                        Create Task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{task.title}</h4>
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Assigned to: {task.assigned_to}</span>
                          <span>Due: {formatDate(task.due_date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={task.status} onValueChange={(value: any) => handleUpdateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Circle className="h-3 w-3" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="in-progress">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3" />
                                In Progress
                              </div>
                            </SelectItem>
                            <SelectItem value="completed">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {message.user_avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {member.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">Joined: {formatDate(member.joined_date)}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applicants Tab (Only for created projects) */}
          {sourceTab === 'created' && (
            <TabsContent value="applicants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Project Applicants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <div key={applicant.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {applicant.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{applicant.name}</h4>
                          <p className="text-sm text-muted-foreground">{applicant.email}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Role: {applicant.role}</span>
                            <span>Experience: {applicant.experience}</span>
                            <span>Applied: {formatDate(applicant.applied_date)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {applicant.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={
                            applicant.status === "accepted" ? "default" :
                            applicant.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {applicant.status}
                          </Badge>
                          {applicant.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleAcceptApplicant(applicant.id)}>
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectApplicant(applicant.id)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}