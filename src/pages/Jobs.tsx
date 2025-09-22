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
  Calendar
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
  benefits?: string;
  posted_date: string;
  user_id: string;
  status: string;
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
  benefits: z.string().optional()
});

type JobFormData = z.infer<typeof jobSchema>;

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase.from('jobs').select('*');
      
      if (activeTab === 'created' && user) {
        query = query.eq('user_id', user.id);
      } else if (activeTab === 'all') {
        query = query.eq('status', 'Active');
      }

      const { data, error } = await query.order('posted_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch jobs"
        });
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab, user]);

  const onSubmit = async (data: JobFormData) => {
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

      const insertData = {
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
        user_id: user.id,
        status: 'Active'
      };

      console.log('Inserting job data:', insertData);

      const { error } = await supabase.from('jobs').insert(insertData);

      if (error) {
        console.error('Error creating job:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create job posting: ${error.message || 'Unknown error'}`
        });
      } else {
        toast({
          title: "Success",
          description: "Job posted successfully!"
        });
        form.reset();
        setIsDialogOpen(false);
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
            <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
            <p className="text-muted-foreground">Discover opportunities in the film industry</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
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
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="created">My Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs ({savedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, company, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
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
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
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
                                      onClick={() => handleViewDetails(job)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleEditJob(job)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
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
                                      onClick={() => handleViewDetails(job)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleSaveJob(job.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Bookmark className="h-4 w-4 fill-current" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
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
                  <Card key={job.id} className="hover:shadow-soft transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">{job.job_title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building className="h-4 w-4" />
                            {job.company_name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSaveJob(job.id)}
                            className={savedJobs.includes(job.id) ? "text-primary" : ""}
                          >
                            <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                          </Button>
                          {activeTab === "created" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          onClick={() => handleApplyJob(job)}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
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
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob?.job_title}</DialogTitle>
              <DialogDescription className="text-lg">
                {selectedJob?.company_name} • {selectedJob?.location}
              </DialogDescription>
            </DialogHeader>
            
            {selectedJob && (
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
                      {/* Job Details Content */}
                      <div>
                        {/* Job Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-2">Job Details</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Job Type:</span>
                                  <Badge variant="secondary">{selectedJob.job_type}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Experience Level:</span>
                                  <Badge variant="outline">{selectedJob.experience_level}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Industry:</span>
                                  <Badge variant="outline">{selectedJob.industry}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Posted:</span>
                                  <span>{formatDate(selectedJob.posted_date)}</span>
                                </div>
                                {selectedJob.salary_range && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Salary:</span>
                                    <span className="font-medium text-green-600">{selectedJob.salary_range}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-2">Company</h3>
                              <div className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg">{selectedJob.company_name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{selectedJob.location}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-lg mb-2">Created by</h3>
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg">
                                  {selectedJob.user_id === user?.id ? "You" : "FilmCollab User"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Job Description</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">{selectedJob.job_description}</p>
                          </div>
                        </div>

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
                            <div className="prose prose-sm max-w-none">
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
                            onClick={() => handleSaveJob(selectedJob.id)}
                            className={savedJobs.includes(selectedJob.id) ? "text-primary" : ""}
                          >
                            <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                            {savedJobs.includes(selectedJob.id) ? "Saved" : "Save Job"}
                          </Button>
                        </div>
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
                                      <Button size="sm" variant="outline">
                                        View Resume
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
                  <div>
                    {/* Job Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Job Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Job Type:</span>
                              <Badge variant="secondary">{selectedJob.job_type}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Experience Level:</span>
                              <Badge variant="outline">{selectedJob.experience_level}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Industry:</span>
                              <Badge variant="outline">{selectedJob.industry}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Posted:</span>
                              <span>{formatDate(selectedJob.posted_date)}</span>
                            </div>
                            {selectedJob.salary_range && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Salary:</span>
                                <span className="font-medium text-green-600">{selectedJob.salary_range}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Company</h3>
                          <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg">{selectedJob.company_name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{selectedJob.location}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Created by</h3>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg">
                              {selectedJob.user_id === user?.id ? "You" : "FilmCollab User"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Job Description</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{selectedJob.job_description}</p>
                      </div>
                    </div>

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
                        <div className="prose prose-sm max-w-none">
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
                        onClick={() => handleSaveJob(selectedJob.id)}
                        className={savedJobs.includes(selectedJob.id) ? "text-primary" : ""}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(selectedJob.id) ? "Saved" : "Save Job"}
                      </Button>
                    </div>
                  </div>
                )}
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
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
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
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
