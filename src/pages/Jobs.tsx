import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Search,
  Filter,
  Plus,
  Bookmark,
  Share2,
  Building,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Star,
  Gift,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Job {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  experience_level: string;
  industry: string;
  salary_range?: string;
  salary_min?: number;
  salary_max?: number;
  skills_required?: string[];
  job_description: string;
  requirements?: string;
  benefits?: string;
  posted_date: string;
  user_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const jobSchema = z.object({
  job_title: z.string().min(2, "Job title must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  job_type: z.string().min(1, "Please select a job type"),
  experience_level: z.string().min(1, "Please select an experience level"),
  industry: z.string().min(1, "Please select an industry"),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  skills_required: z.string().optional(),
  job_description: z.string().min(10, "Job description must be at least 10 characters"),
  requirements: z.string().optional(),
  benefits: z.string().optional()
});

type JobFormData = z.infer<typeof jobSchema>;

export default function Jobs() {
  // Hardcoded jobs data - Updated to fix loading issues
  const hardcodedJobs: Job[] = [
    {
      id: "1",
      job_title: "Film Director",
      company_name: "Hollywood Studios",
      location: "Los Angeles, CA",
      job_type: "Full-time",
      experience_level: "Senior",
      industry: "Director",
      salary_range: "₹80,000 - ₹120,000",
      status: "Active",
      posted_date: "2024-01-15",
      job_description: "We are looking for an experienced film director to lead our next feature film project. Must have 5+ years of experience in film direction.",
      requirements: "5+ years experience, Portfolio required, Strong leadership skills",
      benefits: "Health insurance, 401k, Flexible schedule",
      skills_required: ["Film Direction", "Leadership", "Creative Vision", "Project Management"],
      user_id: "admin-user-id"
    },
    // My Jobs - Jobs posted by current user
    {
      id: "my-1",
      job_title: "Lead Actor",
      company_name: "FilmCollab Productions",
      location: "Mumbai, India",
      job_type: "Full-time",
      experience_level: "Senior",
      industry: "Lead Actor / Actress",
      salary_range: "₹1,50,000 - ₹2,50,000",
      status: "Active",
      posted_date: "2024-01-20",
      job_description: "We are seeking a talented lead actor for our upcoming feature film. The role requires strong acting skills, emotional range, and ability to work with diverse cast and crew.",
      requirements: "5+ years acting experience, Theater/film background, Strong communication skills",
      benefits: "Health insurance, Accommodation provided, Travel allowance, Performance bonus",
      skills_required: ["Acting", "Emotional Range", "Communication", "Character Development"],
      user_id: "current-user-id"
    },
    {
      id: "my-2",
      job_title: "Music Director",
      company_name: "Melody Studios",
      location: "Chennai, India",
      job_type: "Contract",
      experience_level: "Mid-level",
      industry: "Music Director",
      salary_range: "₹80,000 - ₹1,20,000",
      status: "Active",
      posted_date: "2024-01-19",
      job_description: "Create original music compositions for our upcoming web series. Work closely with director to create music that enhances the storytelling.",
      requirements: "Music composition degree, 3+ years experience, Knowledge of various music genres",
      benefits: "Creative freedom, Royalty sharing, Professional equipment access",
      skills_required: ["Music Composition", "Sound Design", "Audio Production", "Collaboration"],
      user_id: "current-user-id"
    },
    {
      id: "my-3",
      job_title: "Costume Designer",
      company_name: "Fashion Forward Films",
      location: "Delhi, India",
      job_type: "Full-time",
      experience_level: "Mid-level",
      industry: "Costume Designer",
      salary_range: "₹45,000 - ₹70,000",
      status: "Active",
      posted_date: "2024-01-18",
      job_description: "Design and create costumes for period drama series. Work with production team to ensure historical accuracy and visual appeal.",
      requirements: "Fashion design background, Historical costume knowledge, 2+ years experience",
      benefits: "Health insurance, Design budget, Creative collaboration, Skill development",
      skills_required: ["Fashion Design", "Historical Research", "Pattern Making", "Costume Construction"],
      user_id: "current-user-id"
    },
    {
      id: "my-4",
      job_title: "Assistant Director",
      company_name: "Bollywood Dreams",
      location: "Pune, India",
      job_type: "Full-time",
      experience_level: "Mid-level",
      industry: "Assistant Director",
      salary_range: "₹35,000 - ₹55,000",
      status: "Active",
      posted_date: "2024-01-17",
      job_description: "Assist the director in managing daily production activities. Coordinate between different departments and ensure smooth workflow.",
      requirements: "Film production knowledge, Leadership skills, Problem-solving ability",
      benefits: "Health insurance, Learning opportunities, Industry exposure, Growth potential",
      skills_required: ["Production Management", "Leadership", "Communication", "Problem Solving"],
      user_id: "current-user-id"
    },
    {
      id: "my-5",
      job_title: "Makeup Artist",
      company_name: "Glamour Studios",
      location: "Bangalore, India",
      job_type: "Part-time",
      experience_level: "Mid-level",
      industry: "Makeup Artist",
      salary_range: "₹25,000 - ₹40,000",
      status: "Active",
      posted_date: "2024-01-16",
      job_description: "Create stunning makeup looks for actors in various genres. Work on both natural and special effects makeup.",
      requirements: "Professional makeup certification, Portfolio required, 2+ years experience",
      benefits: "Flexible schedule, Creative projects, Professional products, Skill enhancement",
      skills_required: ["Makeup Artistry", "Special Effects", "Color Theory", "Character Design"],
      user_id: "current-user-id"
    },
    {
      id: "2",
      job_title: "Cinematographer",
      company_name: "Creative Films Inc",
      location: "New York, NY",
      job_type: "Contract",
      experience_level: "Mid-level",
      industry: "Cinematographer / DOP",
      salary_range: "₹60,000 - ₹90,000",
      status: "Active",
      posted_date: "2024-01-14",
      job_description: "Seeking a talented cinematographer for upcoming documentary series. Experience with digital cameras required.",
      requirements: "3+ years experience, Camera operation skills, Creative vision",
      benefits: "Project-based pay, Equipment provided, Travel opportunities",
      skills_required: ["Camera Operation", "Lighting", "Composition", "Digital Photography"],
      user_id: "admin-user-id"
    },
    {
      id: "3",
      job_title: "Film Editor",
      company_name: "Post Production House",
      location: "Atlanta, GA",
      job_type: "Full-time",
      experience_level: "Mid-level",
      industry: "Video Editor",
      salary_range: "₹50,000 - ₹75,000",
      status: "Active",
      posted_date: "2024-01-13",
      job_description: "Join our post-production team as a film editor. Work on various projects including commercials, documentaries, and feature films.",
      requirements: "Adobe Premiere Pro, After Effects experience, 2+ years editing",
      benefits: "Health insurance, Paid time off, Professional development",
      skills_required: ["Adobe Premiere Pro", "After Effects", "Video Editing", "Color Grading"],
      user_id: "admin-user-id"
    },
    {
      id: "4",
      job_title: "Sound Designer",
      company_name: "Audio Visual Studios",
      location: "Chicago, IL",
      job_type: "Part-time",
      experience_level: "Mid-level",
      industry: "Sound Engineer",
      salary_range: "₹40,000 - ₹60,000",
      status: "Active",
      posted_date: "2024-01-12",
      job_description: "Create immersive sound experiences for films and documentaries. Work with cutting-edge audio technology.",
      requirements: "Audio engineering background, Pro Tools experience, Creative mindset",
      benefits: "Flexible hours, Equipment access, Creative freedom",
      skills_required: ["Pro Tools", "Audio Engineering", "Sound Design", "Mixing"],
      user_id: "admin-user-id"
    },
    {
      id: "5",
      job_title: "Production Manager",
      company_name: "Indie Film Collective",
      location: "Austin, TX",
      job_type: "Full-time",
      experience_level: "Senior",
      industry: "Director",
      salary_range: "₹55,000 - ₹80,000",
      status: "Active",
      posted_date: "2024-01-11",
      job_description: "Manage all aspects of film production from pre-production to post. Coordinate with various departments and ensure smooth operations.",
      requirements: "Project management experience, Film industry knowledge, Leadership skills",
      benefits: "Health insurance, 401k, Flexible schedule, Growth opportunities",
      skills_required: ["Project Management", "Film Production", "Leadership", "Budget Management"],
      user_id: "admin-user-id"
    },
    {
      id: "6",
      job_title: "Script Supervisor",
      company_name: "Narrative Films",
      location: "Portland, OR",
      job_type: "Contract",
      experience_level: "Mid-level",
      industry: "Director",
      salary_range: "₹45,000 - ₹65,000",
      status: "Active",
      posted_date: "2024-01-10",
      job_description: "Ensure continuity and accuracy in film production. Work closely with director and editor to maintain script integrity.",
      requirements: "Attention to detail, Script analysis skills, Film production knowledge",
      benefits: "Project-based pay, Creative input, Professional networking",
      skills_required: ["Script Analysis", "Continuity", "Attention to Detail", "Film Production"],
      user_id: "admin-user-id"
    },
    {
      id: "7",
      job_title: "Visual Effects Artist",
      company_name: "VFX Studios",
      location: "San Francisco, CA",
      job_type: "Full-time",
      experience_level: "Mid-level",
      industry: "VFX Artist",
      salary_range: "₹70,000 - ₹100,000",
      status: "Active",
      posted_date: "2024-01-09",
      job_description: "Create stunning visual effects for feature films and commercials. Work with industry-standard software and cutting-edge technology.",
      requirements: "Maya/Blender experience, Compositing skills, 3+ years VFX work",
      benefits: "Health insurance, 401k, Creative projects, Team collaboration",
      skills_required: ["Maya", "Blender", "Compositing", "3D Modeling"],
      user_id: "admin-user-id"
    },
    {
      id: "8",
      job_title: "Film Producer",
      company_name: "Independent Films LLC",
      location: "Miami, FL",
      job_type: "Full-time",
      experience_level: "Senior",
      industry: "Director",
      salary_range: "₹90,000 - ₹150,000",
      status: "Active",
      posted_date: "2024-01-08",
      job_description: "Lead production of independent films from concept to distribution. Manage budgets, schedules, and creative teams.",
      requirements: "5+ years producing experience, Budget management, Industry connections",
      benefits: "High salary potential, Creative control, Industry recognition",
      skills_required: ["Film Producing", "Budget Management", "Project Management", "Industry Networking"],
      user_id: "admin-user-id"
    },
    {
      id: "9",
      job_title: "Film Marketing Coordinator",
      company_name: "Cinema Marketing Group",
      location: "Denver, CO",
      job_type: "Full-time",
      experience_level: "Entry-level",
      industry: "Digital Marketer",
      salary_range: "₹35,000 - ₹50,000",
      status: "Active",
      posted_date: "2024-01-07",
      job_description: "Develop and execute marketing campaigns for film releases. Work with social media, advertising, and promotional events.",
      requirements: "Marketing degree preferred, Social media skills, Creative thinking",
      benefits: "Health insurance, Professional development, Creative environment",
      skills_required: ["Digital Marketing", "Social Media", "Content Creation", "Campaign Management"],
      user_id: "admin-user-id"
    }
  ];

  const [jobs, setJobs] = useState<Job[]>(hardcodedJobs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [viewDetailsTab, setViewDetailsTab] = useState("details");
  const [applicants, setApplicants] = useState<any[]>([]);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_title: "",
      company_name: "",
      location: "",
      job_type: "",
      experience_level: "",
      industry: "",
      salary_min: 0,
      salary_max: 0,
      skills_required: "",
      job_description: "",
      benefits: ""
    }
  });

  const fetchJobs = () => {
      setLoading(true);
    
    // Filter hardcoded jobs based on active tab
    let filteredJobs = hardcodedJobs;
      
      if (activeTab === 'created' && user) {
      // Replace "current-user-id" with actual user ID for My Jobs
      const jobsWithCurrentUser = hardcodedJobs.map(job => 
        job.user_id === "current-user-id" ? { ...job, user_id: user.id } : job
      );
      filteredJobs = jobsWithCurrentUser.filter(job => job.user_id === user.id);
      } else if (activeTab === 'all') {
      filteredJobs = hardcodedJobs.filter(job => job.status === 'Active');
    }
    
    setJobs(filteredJobs);
      setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab, user]);

  const onSubmit = (data: JobFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to post a job"
      });
      return;
    }

    try {
      const skillsArray = data.skills_required 
        ? data.skills_required.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : [];

      // Create salary range string if both min and max are provided
      const salaryRange = (data.salary_min > 0 && data.salary_max > 0)
        ? `₹${data.salary_min.toLocaleString()} - ₹${data.salary_max.toLocaleString()}`
        : data.salary_min > 0
        ? `₹${data.salary_min.toLocaleString()}+`
        : null;

      const newJob: Job = {
        id: (hardcodedJobs.length + 1).toString(),
        job_title: data.job_title,
        company_name: data.company_name,
        location: data.location,
        job_type: data.job_type,
        experience_level: data.experience_level,
        industry: data.industry,
        salary_range: salaryRange || undefined,
        job_description: data.job_description,
        requirements: data.requirements,
        benefits: data.benefits,
        skills_required: skillsArray,
        user_id: user.id,
        status: 'Active',
        posted_date: new Date().toISOString().split('T')[0]
      };

      // Add the new job to the hardcoded jobs array
      const updatedJobs = [...hardcodedJobs, newJob];
      setJobs(updatedJobs);

        toast({
          title: "Success",
          description: "Job posted successfully!"
        });
        form.reset();
        setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.skills_required && job.skills_required.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    const matchesType = filterType === "all" || job.job_type === filterType;
    const matchesLocation = filterLocation === "all" || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "created" && job.user_id === user?.id) ||
                      (activeTab === "saved" && savedJobs.includes(job.id));
    
    // Date filter logic
    let matchesDate = true;
    if (filterDate !== "all") {
      const jobDate = new Date(job.posted_date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterDate) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
        case "3months":
          matchesDate = daysDiff <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesTab && matchesDate;
  });

  // Pagination logic
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterLocation, activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSaveJob = (jobId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save jobs"
      });
      return;
    }

    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        // Remove from saved jobs
        const newSavedJobs = prev.filter(id => id !== jobId);
        toast({
          title: "Job Removed",
          description: "Job removed from saved jobs"
        });
        return newSavedJobs;
      } else {
        // Add to saved jobs
        const newSavedJobs = [...prev, jobId];
        toast({
          title: "Job Saved",
          description: "Job added to saved jobs"
        });
        return newSavedJobs;
      }
    });
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setViewDetailsTab("details");
    setIsViewDetailsOpen(true);
    
    // If it's the user's own job, fetch applicants
    if (job.user_id === user?.id) {
      fetchApplicants(job.id);
    }
  };

  const fetchApplicants = async (jobId: string) => {
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
          skills: ["React", "Node.js", "TypeScript"],
          resume: "john_smith_resume.pdf"
        },
        {
          id: "2", 
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          avatar: "SJ",
          appliedDate: "2025-01-07",
          status: "reviewed",
          experience: "3 years",
          skills: ["Vue.js", "Python", "Django"],
          resume: "sarah_johnson_resume.pdf"
        },
        {
          id: "3",
          name: "Mike Chen",
          email: "mike.chen@email.com", 
          avatar: "MC",
          appliedDate: "2025-01-06",
          status: "shortlisted",
          experience: "7 years",
          skills: ["Angular", "Java", "Spring Boot"],
          resume: "mike_chen_resume.pdf"
        }
      ];
      setApplicants(mockApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const handleApplyJob = (job: Job) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to apply for jobs"
      });
      return;
    }

    // Here you would typically redirect to application form or open application modal
    toast({
      title: "Application Started",
      description: `Redirecting to application for ${job.job_title} at ${job.company_name}`
    });
    
    // For now, just show a success message
    // In a real app, you'd redirect to application form or open application modal
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    form.reset({
      job_title: job.job_title,
      company_name: job.company_name,
      location: job.location,
      job_type: job.job_type,
      experience_level: job.experience_level,
      industry: job.industry,
      salary_min: job.salary_min || 0,
      salary_max: job.salary_max || 0,
      skills_required: job.skills_required?.join(', ') || "",
      job_description: job.job_description,
      benefits: job.benefits || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobToDelete.id);

      if (error) {
        console.error('Error deleting job:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete job"
        });
      } else {
        toast({
          title: "Success",
          description: "Job deleted successfully"
        });
        fetchJobs();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const onEditSubmit = async (data: JobFormData) => {
    if (!selectedJob || !user) return;

    try {
      const skillsArray = data.skills_required 
        ? data.skills_required.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : [];

      // Create salary range string if both min and max are provided
      const salaryRange = (data.salary_min > 0 && data.salary_max > 0)
        ? `₹${data.salary_min.toLocaleString()} - ₹${data.salary_max.toLocaleString()}`
        : data.salary_min > 0
        ? `₹${data.salary_min.toLocaleString()}+`
        : null;

      const { error } = await supabase
        .from('jobs')
        .update({
          job_title: data.job_title,
          company_name: data.company_name,
          location: data.location,
          job_type: data.job_type,
          experience_level: data.experience_level,
          industry: data.industry,
          salary_range: salaryRange,
          salary_min: data.salary_min > 0 ? data.salary_min : null,
          salary_max: data.salary_max > 0 ? data.salary_max : null,
          skills_required: skillsArray,
          job_description: data.job_description,
          benefits: data.benefits || null,
        })
        .eq('id', selectedJob.id);

      if (error) {
        console.error('Error updating job:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update job"
        });
      } else {
        toast({
          title: "Success",
          description: "Job updated successfully"
        });
        form.reset();
        setIsEditDialogOpen(false);
        setSelectedJob(null);
        fetchJobs();
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

  const handleShareJob = async (job: Job) => {
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const shareText = `Check out this job opportunity: ${job.job_title} at ${job.company_name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.job_title,
          text: shareText,
          url: jobUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${jobUrl}`);
        toast({
          title: "Link Copied",
          description: "Job link has been copied to clipboard"
        });
      } catch (error) {
        // Fallback: show URL in alert
        alert(`${shareText}\n${jobUrl}`);
      }
    }
  };

  return (
    <AppLayout pageTitle="Jobs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-600">Discover opportunities in the film industry</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Share opportunities with the film industry community
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="job_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior Director" className="border-yellow-200 focus:border-yellow-500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Netflix Studios" className="border-yellow-200 focus:border-yellow-500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mumbai, Maharashtra" className="border-yellow-200 focus:border-yellow-500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salary_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Min Salary</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number"
                                placeholder="e.g. 500000" 
                                className="pl-8 border-yellow-200 focus:border-yellow-500"
                                value={field.value === 0 ? "" : field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? 0 : parseInt(value) || 0);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salary_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Max Salary</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number"
                                placeholder="e.g. 800000" 
                                className="pl-8 border-yellow-200 focus:border-yellow-500"
                                value={field.value === 0 ? "" : field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? 0 : parseInt(value) || 0);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="job_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Job Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Entry">Entry Level</SelectItem>
                              <SelectItem value="Mid">Mid Level</SelectItem>
                              <SelectItem value="Senior">Senior Level</SelectItem>
                              <SelectItem value="Executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
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
                        <FormLabel className="text-gray-700">Required Skills (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Adobe Premiere, Final Cut Pro, Cinematography (comma separated)" className="border-yellow-200 focus:border-yellow-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="job_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="min-h-[120px] border-yellow-200 focus:border-yellow-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Benefits (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe benefits, perks, and additional compensation..."
                            className="min-h-[80px] border-yellow-200 focus:border-yellow-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                      Post Job
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-yellow-50 border-yellow-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">All Jobs</TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">My Jobs</TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Saved Jobs ({savedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, company, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-yellow-200 focus:border-yellow-500"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32 border-yellow-200 focus:border-yellow-500">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="los angeles">Los Angeles</SelectItem>
                    <SelectItem value="new york">New York</SelectItem>
                    <SelectItem value="atlanta">Atlanta</SelectItem>
                    <SelectItem value="vancouver">Vancouver</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Posted" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Count */}
            {!loading && filteredJobs.length > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} jobs
                </p>
              </div>
            )}

            {/* Jobs Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="border-yellow-200">
                <CardContent className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">
                    {activeTab === 'created' 
                      ? "You haven't posted any jobs yet. Click 'Post Job' to get started."
                      : "Try adjusting your search criteria or check back later for new opportunities."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {activeTab === "created" || activeTab === "saved" ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Posted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <div 
                                  className="font-semibold cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => {
                                    if (activeTab === "saved") {
                                      handleViewDetails(job);
                                    } else if (activeTab === "created") {
                                      navigate(`/jobs/${job.id}`);
                                    } else {
                                      navigate(`/jobs/${job.id}`);
                                    }
                                  }}
                                >
                                  {job.job_title}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {job.job_description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                {job.company_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {job.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {job.job_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {job.experience_level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {job.salary_range ? (
                                <span className="text-sm font-medium text-green-600">
                                  {job.salary_range}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatDate(job.posted_date)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={job.status === "active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {activeTab === "created" ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                                      onClick={() => handleViewDetails(job)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                                      onClick={() => handleEditJob(job)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="hover:bg-yellow-50">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditJob(job)}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Job
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteJob(job)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Job
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                ) : (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                                      onClick={() => handleViewDetails(job)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                                      onClick={() => handleSaveJob(job.id)}
                                    >
                                      <Bookmark className="h-4 w-4 fill-current" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                                      onClick={() => handleShareJob(job)}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-soft transition-shadow border-yellow-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2 text-gray-900">{job.job_title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 text-gray-600">
                            <Building className="h-4 w-4" />
                            {job.company_name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-yellow-50"
                            onClick={() => handleSaveJob(job.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                          </Button>
                          {activeTab === "created" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-yellow-50">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditJob(job)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteJob(job)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleShareJob(job)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(job.posted_date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.job_type}</Badge>
                        <Badge variant="outline">{job.experience_level}</Badge>
                        <Badge variant="outline">{job.industry}</Badge>
                      </div>
                      
                      {job.salary_range && (
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          {job.salary_range}
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.job_description}
                      </p>
                      
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills_required.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_required.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills_required.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                          onClick={() => handleApplyJob(job)}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                          onClick={() => handleViewDetails(job)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-foreground mb-1">
                {selectedJob?.job_title}
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                {selectedJob?.company_name} • {selectedJob?.location}
              </DialogDescription>
            </DialogHeader>
            
            {selectedJob ? (
              <div className="space-y-6">
                {/* Tabs for job creators only */}
                {selectedJob.user_id === user?.id ? (
                  <Tabs value={viewDetailsTab} onValueChange={setViewDetailsTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Job Details</TabsTrigger>
                      <TabsTrigger value="applicants">
                        Applicants ({applicants.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-6">
                      {/* Job Details Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Job Overview */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Job Details</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center py-1 border-b border-muted/50">
                              <span className="text-muted-foreground">Job Type</span>
                              <Badge variant="secondary">{selectedJob.job_type}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-muted/50">
                              <span className="text-muted-foreground">Experience Level</span>
                              <Badge variant="outline">{selectedJob.experience_level}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-muted/50">
                              <span className="text-muted-foreground">Category</span>
                              <Badge variant="outline">{selectedJob.industry}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-muted/50">
                              <span className="text-muted-foreground">Posted</span>
                              <span className="font-medium">{formatDate(selectedJob.posted_date)}</span>
                            </div>
                            {selectedJob.salary_range && (
                              <div className="flex justify-between items-center py-1">
                                <span className="text-muted-foreground">Salary</span>
                                <span className="font-semibold text-green-600">{selectedJob.salary_range}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          {/* Company Info */}
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Company</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{selectedJob.company_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{selectedJob.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Posted By */}
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Posted By</h3>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {selectedJob.user_id === user?.id ? "Y" : "F"}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {selectedJob.user_id === user?.id ? "You" : "FilmCollab User"}
                                </div>
                                <div className="text-sm text-muted-foreground">Job Poster</div>
                              </div>
                            </div>
                          </div>

                          {/* Application Stats */}
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Application Stats</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 border-b border-muted/50">
                                <span className="text-sm text-muted-foreground">Total Applications</span>
                                <span className="font-semibold">{Math.floor(Math.random() * 50) + 10}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Full Width Sections */}
                      {/* Job Description */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Job Description</h3>
                        <div className="text-muted-foreground leading-relaxed">
                          <p className="whitespace-pre-wrap">{selectedJob.job_description}</p>
                        </div>
                      </div>

                      {/* Requirements */}
                      {selectedJob.requirements && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                          <div className="text-muted-foreground leading-relaxed">
                            <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
                          </div>
                        </div>
                      )}

                      {/* Required Skills */}
                      {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skills_required.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {selectedJob.benefits && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Benefits & Perks</h3>
                          <div className="text-muted-foreground leading-relaxed">
                            <p className="whitespace-pre-wrap">{selectedJob.benefits}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4 border-t">
                        <Button 
                          size="lg" 
                          className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          onClick={() => {
                            handleApplyJob(selectedJob);
                            setIsViewDetailsOpen(false);
                          }}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                          onClick={() => handleSaveJob(selectedJob.id)}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                          {savedJobs.includes(selectedJob.id) ? "Saved" : "Save Job"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                          onClick={() => handleShareJob(selectedJob)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="applicants" className="space-y-6">
                      {/* Applicants Content */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Job Applicants</h3>
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
                                      <Button size="sm" variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
                                        View Resume
                                      </Button>
                                      <Button size="sm" variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50">
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
                  <div className="space-y-6">
                    {/* Job Details Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Overview */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Job Details</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center py-1 border-b border-muted/50">
                            <span className="text-muted-foreground">Job Type</span>
                            <Badge variant="secondary">{selectedJob.job_type}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-muted/50">
                            <span className="text-muted-foreground">Experience Level</span>
                            <Badge variant="outline">{selectedJob.experience_level}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-muted/50">
                            <span className="text-muted-foreground">Category</span>
                            <Badge variant="outline">{selectedJob.industry}</Badge>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-muted/50">
                            <span className="text-muted-foreground">Posted</span>
                            <span className="font-medium">{formatDate(selectedJob.posted_date)}</span>
                          </div>
                          {selectedJob.salary_range && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-muted-foreground">Salary</span>
                              <span className="font-semibold text-green-600">{selectedJob.salary_range}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Company Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Company</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{selectedJob.company_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{selectedJob.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Posted By */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Posted By</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {selectedJob.user_id === user?.id ? "Y" : "F"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {selectedJob.user_id === user?.id ? "You" : "FilmCollab User"}
                              </div>
                              <div className="text-sm text-muted-foreground">Job Poster</div>
                            </div>
                          </div>
                        </div>

                        {/* Application Stats */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Application Stats</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-muted/50">
                              <span className="text-sm text-muted-foreground">Total Applications</span>
                              <span className="font-semibold">{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Width Sections */}
                    {/* Job Description */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Job Description</h3>
                      <div className="text-muted-foreground leading-relaxed">
                        <p className="whitespace-pre-wrap">{selectedJob.job_description}</p>
                      </div>
                    </div>

                    {/* Requirements */}
                    {selectedJob.requirements && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                        <div className="text-muted-foreground leading-relaxed">
                          <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
                        </div>
                      </div>
                    )}

                    {/* Required Skills */}
                    {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills_required.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    {selectedJob.benefits && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Benefits & Perks</h3>
                        <div className="text-muted-foreground leading-relaxed">
                          <p className="whitespace-pre-wrap">{selectedJob.benefits}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons for Non-Creators */}
                {selectedJob.user_id !== user?.id && (
                  <div className="flex gap-4 pt-4 border-t">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                      onClick={() => {
                        handleApplyJob(selectedJob);
                        setIsViewDetailsOpen(false);
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                      onClick={() => handleSaveJob(selectedJob.id)}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                      {savedJobs.includes(selectedJob.id) ? "Saved" : "Save Job"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50"
                      onClick={() => handleShareJob(selectedJob)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading job details...</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Job Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
              <DialogDescription>
                Update the job details
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Director" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Netflix Studios" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <FormField
                    control={form.control}
                    name="salary_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Salary (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="e.g. 500000" 
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
                    name="salary_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Salary (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="e.g. 800000" 
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="job_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Freelance">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Entry">Entry Level</SelectItem>
                            <SelectItem value="Mid">Mid Level</SelectItem>
                            <SelectItem value="Senior">Senior Level</SelectItem>
                            <SelectItem value="Executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Required Skills (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Adobe Premiere, Final Cut Pro, Cinematography (comma separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the role, responsibilities, and requirements..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe benefits, perks, and additional compensation..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" className="border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                    Update Job
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteJob}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
